import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/db';
import Abstract from '../../../models/Abstract';
import Registration from '../../../models/Registration';
import { sendAbstractSubmissionEmail } from '../../../lib/services/email';
import { generateQrCodeUrl, uploadAbstractFile } from '../../../lib/services/firebase';

// Helper to parse and validate multipart form data
async function parseMultipartFormData(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  
  // Convert form data to plain object
  const data: Record<string, any> = {};
  formData.forEach((value, key) => {
    if (key !== 'file') {
      // Handle co-authors as JSON string
      if (key === 'coAuthors') {
        try {
          data[key] = JSON.parse(value as string);
        } catch (e) {
          data[key] = [];
        }
      } else {
        data[key] = value;
      }
    }
  });
  
  return { data, file };
}

export async function POST(request: NextRequest) {
  try {
    // Parse multipart form data
    const { data, file } = await parseMultipartFormData(request);
    
    // Validate required fields
    const requiredFields = ['email', 'name', 'affiliation', 'designation', 
      'title', 'subject', 'articleType', 'presentationType'];
      
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { success: false, message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Validate file
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'Abstract file is required' },
        { status: 400 }
      );
    }
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type. Only PDF and Word documents are allowed' },
        { status: 400 }
      );
    }
    
    // Connect to database
    await connectToDatabase();
    
    // Create a new abstract
    const abstract = new Abstract({
      email: data.email,
      name: data.name,
      coAuthors: data.coAuthors || [],
      affiliation: data.affiliation,
      designation: data.designation,
      title: data.title,
      subject: data.subject,
      articleType: data.articleType,
      presentationType: data.presentationType,
      // We'll update the file URL after upload
    });
    
    // Create temporary code for the file upload
    await abstract.save();
    
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Upload file to Firebase
    const { url } = await uploadAbstractFile(buffer, file.type, abstract.abstractCode);
    
    // Update abstract with file URL
    abstract.abstractFileUrl = url;
    
    // Generate QR code
    const qrCodeUrl = await generateQrCodeUrl(abstract.abstractCode, 'abstract');
    abstract.qrCodeUrl = qrCodeUrl;
    
    await abstract.save();
    
    // Check if user is already registered
    const registration = await Registration.findOne({ email: data.email });
    
    if (registration) {
      // Link abstract to registration
      abstract.registration = registration._id;
      abstract.registrationCompleted = true;
      await abstract.save();
      
      // Add abstract to registration
      registration.abstracts = [...(registration.abstracts || []), abstract._id];
      await registration.save();
    }
    
    // Send confirmation email
    await sendAbstractSubmissionEmail({
      to: abstract.email,
      name: abstract.name,
      abstractCode: abstract.abstractCode,
      abstractTitle: abstract.title
    });
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Abstract submission successful',
      data: {
        abstractId: abstract._id,
        abstractCode: abstract.abstractCode,
        title: abstract.title,
        email: abstract.email,
        registrationCompleted: abstract.registrationCompleted
      }
    });
  } catch (error: any) {
    console.error('Abstract submission error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Abstract submission failed' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch abstract details by ID, email, or code
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const abstractId = searchParams.get('id');
    const email = searchParams.get('email');
    const abstractCode = searchParams.get('code');
    
    if (!abstractId && !email && !abstractCode) {
      return NextResponse.json(
        { success: false, message: 'Either id, email, or code parameter is required' },
        { status: 400 }
      );
    }
    
    // Connect to database
    await connectToDatabase();
    
    let query: any = {};
    if (abstractId) query._id = abstractId;
    else if (abstractCode) query.abstractCode = abstractCode;
    else if (email) query.email = email;
    
    // Handle multiple abstracts for email query
    if (email && !abstractId && !abstractCode) {
      const abstracts = await Abstract.find({ email }).sort({ createdAt: -1 });
      
      if (!abstracts || abstracts.length === 0) {
        return NextResponse.json(
          { success: false, message: 'No abstracts found for this email' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: abstracts
      });
    } else {
      // Single abstract lookup
      const abstract = await Abstract.findOne(query);
      
      if (!abstract) {
        return NextResponse.json(
          { success: false, message: 'Abstract not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: abstract
      });
    }
  } catch (error: any) {
    console.error('Error fetching abstract:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch abstract' },
      { status: 500 }
    );
  }
}
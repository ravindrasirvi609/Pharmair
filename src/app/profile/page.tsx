"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";

// Define types
interface Abstract {
  _id: string;
  name: string;
  email: string;
  title: string;
  subject: string;
  articleType: string;
  presentationType: string;
  status: string;
  abstractCode: string;
  rejectionComment?: string;
  createdAt: string;
  abstractFileUrl?: string;
  qrCodeUrl?: string;
  registrationCompleted: boolean;
  paymentCompleted: boolean;
  registrationStatus: string;
}

interface Registration {
  _id: string;
  name: string;
  email: string;
  registrationCode: string;
  registrationType: string;
  paymentStatus: string;
  registrationStatus: string;
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 }
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent dark:from-primary-400 dark:to-secondary-400 mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Your Profile
        </motion.h1>
        <motion.p 
          className="text-center text-gray-600 dark:text-gray-400 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          View and manage your submission and registration details
        </motion.p>
        <ProfileContent />
      </div>
    </div>
  );
}

function ProfileContent() {
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [abstract, setAbstract] = useState<Abstract | null>(null);
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [uploadingRevision, setUploadingRevision] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'abstract' | 'registration'>(abstract ? 'abstract' : 'registration');

  // Get abstract code or email from URL parameters
  const abstractCode = searchParams.get("abstractCode");
  const email = searchParams.get("email");
  const registrationCode = searchParams.get("regCode");

  useEffect(() => {
    const fetchData = async () => {
      if (!abstractCode && !email && !registrationCode) {
        setError(
          "Please provide an abstract code, email, or registration code to view your profile"
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Try to fetch abstract if code is provided
        if (abstractCode) {
          const abstractResponse = await axios.get(
            `/api/abstract?code=${abstractCode}`
          );
          if (abstractResponse.data.success) {
            setAbstract(abstractResponse.data.data);
            setActiveTab('abstract');

            // If abstract has a linked registration, fetch that too
            if (abstractResponse.data.data.registration) {
              try {
                const regResponse = await axios.get(
                  `/api/register?id=${abstractResponse.data.data.registration}`
                );
                if (regResponse.data.success) {
                  setRegistration(regResponse.data.data);
                }
              } catch (error) {
                console.error("Error fetching registration:", error);
              }
            }
          }
        }
        // Try to fetch by email
        else if (email) {
          const abstractResponse = await axios.get(
            `/api/abstract?email=${email}`
          );
          if (abstractResponse.data.success) {
            // If multiple abstracts, just use the first one for now
            setAbstract(
              Array.isArray(abstractResponse.data.data)
                ? abstractResponse.data.data[0]
                : abstractResponse.data.data
            );
            setActiveTab('abstract');

            // Try to fetch registration with the same email
            try {
              const regResponse = await axios.get(
                `/api/register?email=${email}`
              );
              if (regResponse.data.success) {
                setRegistration(regResponse.data.data);
              }
            } catch (error) {
              console.error("Error fetching registration:", error);
            }
          }
        }
        // Try to fetch by registration code
        else if (registrationCode) {
          const regResponse = await axios.get(
            `/api/register?code=${registrationCode}`
          );
          if (regResponse.data.success) {
            setRegistration(regResponse.data.data);
            setActiveTab('registration');

            // If registration has abstracts, fetch the first one
            if (
              regResponse.data.data.abstracts &&
              regResponse.data.data.abstracts.length > 0
            ) {
              try {
                const abstractResponse = await axios.get(
                  `/api/abstract?id=${regResponse.data.data.abstracts[0]}`
                );
                if (abstractResponse.data.success) {
                  setAbstract(abstractResponse.data.data);
                }
              } catch (error) {
                console.error("Error fetching abstract:", error);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load your profile information. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [abstractCode, email, registrationCode]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };

  const handleSubmitRevision = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedFile || !abstract) {
      setError("Please select a file to upload");
      return;
    }

    setUploadingRevision(true);
    setUploadProgress(0);

    try {
      // This would be replaced with the actual file upload logic
      // similar to what's in AbstractSubmissionForm
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("abstractId", abstract._id);

      // Simulate a file upload with progress
      const simulateUpload = () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setUploadProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
            // Once upload is complete, update the abstract status
            updateAbstractStatus();
          }
        }, 300);
      };

      simulateUpload();
    } catch (error) {
      console.error("Error uploading revision:", error);
      setError("Failed to upload revision. Please try again.");
      setUploadingRevision(false);
    }
  };

  const updateAbstractStatus = async () => {
    try {
      if (!abstract) return;

      // Call API to update the abstract status back to "InReview"
      await axios.patch(`/api/abstract/${abstract._id}`, {
        status: "InReview",
        // The URL would actually come from the upload response
        abstractFileUrl: `${abstract.abstractFileUrl}?v=${Date.now()}`,
      });

      setUploadSuccess(true);
      setUploadingRevision(false);

      // Update the local abstract state
      setAbstract((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          status: "InReview",
        };
      });

      // Wait 3 seconds then hide the success message
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error updating abstract status:", error);
      setError("Failed to update abstract status. Please try again.");
      setUploadingRevision(false);
    }
  };

  // Helper function to render status badge with appropriate colors
  const renderStatusBadge = (status: string, type: 'abstract' | 'registration') => {
    const getStatusConfig = () => {
      if (type === 'abstract') {
        switch(status) {
          case 'Accepted':
            return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-400', icon: '✓' };
          case 'Rejected':
            return { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-400', icon: '✕' };
          case 'Revisions':
            return { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-800 dark:text-purple-400', icon: '✎' };
          case 'InReview':
            return { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-800 dark:text-yellow-400', icon: '⌛' };
          default:
            return { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-400', icon: 'i' };
        }
      } else {
        switch(status) {
          case 'Confirmed':
            return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-400', icon: '✓' };
          case 'Completed':
            return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-400', icon: '✓' };
          case 'Pending':
            return { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-800 dark:text-yellow-400', icon: '⌛' };
          default:
            return { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-400', icon: 'i' };
        }
      }
    };
    
    const { bg, text, icon } = getStatusConfig();
    const displayStatus = status === 'Revisions' ? 'Revisions Required' : status;
    
    return (
      <span className={`px-3 py-1 text-sm font-semibold rounded-full inline-flex items-center gap-1.5 ${bg} ${text}`}>
        <span className="w-4 h-4 inline-flex items-center justify-center rounded-full bg-current text-white text-xs">
          {icon}
        </span>
        {displayStatus}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400 animate-pulse">Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="bg-red-50 dark:bg-red-900/20 p-8 rounded-xl shadow-md border border-red-100 dark:border-red-900/50"
        {...fadeIn}
      >
        <div className="flex items-center mb-4 text-red-600 dark:text-red-400">
          <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
          </svg>
          <h2 className="text-2xl font-bold">Error</h2>
        </div>
        <p className="text-red-600 dark:text-red-300 mb-6">{error}</p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white py-2.5 px-5 rounded-md transition-colors shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Return to Home
          </Link>
        </div>
      </motion.div>
    );
  }

  // No data found
  if (!abstract && !registration) {
    return (
      <motion.div 
        className="bg-yellow-50 dark:bg-yellow-900/20 p-8 rounded-xl shadow-md border border-yellow-100 dark:border-yellow-900/50"
        {...fadeIn}
      >
        <div className="flex items-center mb-4 text-yellow-600 dark:text-yellow-400">
          <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
          </svg>
          <h2 className="text-2xl font-bold">No information found</h2>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          We couldn&apos;t find any information with the provided details. If
          you&apos;ve registered or submitted an abstract, please make sure
          you&apos;re using the correct email or code.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white py-2.5 px-5 rounded-md transition-colors shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Return to Home
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile summary card */}
      <motion.div 
        className="bg-white dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Welcome, {registration?.name || abstract?.name || 'Attendee'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {registration?.email || abstract?.email || ''}
            </p>
          </div>
          
          {/* Quick Info */}
          <div className="flex flex-wrap gap-3">
            {registration && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm">
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
                </svg>
                <span className="font-medium text-blue-700 dark:text-blue-400">
                  Registration: {registration.registrationType}
                </span>
              </div>
            )}
            
            {abstract && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-sm">
                <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c-1.255 0-2.443.29-3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path>
                </svg>
                <span className="font-medium text-purple-700 dark:text-purple-400">
                  Abstract: {abstract.articleType}
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
      
      {/* Tabs for navigation between abstract and registration */}
      {abstract && registration && (
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('abstract')}
            className={`py-3 px-6 font-medium border-b-2 transition-colors -mb-px ${
              activeTab === 'abstract' 
                ? 'border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Abstract Details
          </button>
          <button
            onClick={() => setActiveTab('registration')}
            className={`py-3 px-6 font-medium border-b-2 transition-colors -mb-px ${
              activeTab === 'registration' 
                ? 'border-secondary-600 dark:border-secondary-400 text-secondary-600 dark:text-secondary-400' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Registration Details
          </button>
        </div>
      )}

      {/* Registration Details */}
      {registration && (activeTab === 'registration' || !abstract) && (
        <motion.div
          key="registration"
          {...fadeIn}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-4">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              Registration Details
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                <p className="text-lg font-medium text-gray-800 dark:text-gray-200">{registration.name}</p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-lg break-all text-gray-800 dark:text-gray-200">{registration.email}</p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Registration Type</p>
                <p className="text-lg text-gray-800 dark:text-gray-200">{registration.registrationType}</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Registration Code</p>
                <div className="flex items-center space-x-2">
                  <p className="text-lg font-medium text-blue-600 dark:text-blue-400 tracking-wider">
                    {registration.registrationCode || "Pending"}
                  </p>
                  {registration.registrationCode && (
                    <button 
                      onClick={() => navigator.clipboard.writeText(registration.registrationCode)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1.5"
                      title="Copy code"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Payment Status</p>
                <div className="mt-1">
                  {renderStatusBadge(registration.paymentStatus, 'registration')}
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Registration Status</p>
                <div className="mt-1">
                  {renderStatusBadge(registration.registrationStatus, 'registration')}
                </div>
                
                {registration.paymentStatus !== 'Completed' && (
                  <Button
                    variant="gradient"
                    size="md"
                    animate
                    className="mt-3 w-full"
                    onClick={() => window.location.href = `/payment?regCode=${registration.registrationCode}`}
                  >
                    Complete Payment
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Abstract Details */}
      {abstract && (activeTab === 'abstract' || !registration) && (
        <motion.div
          key="abstract"
          {...fadeIn}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 mr-4">
              <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c-1.255 0-2.443.29-3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-purple-600 dark:text-purple-400">
              Abstract Details
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6 md:col-span-2">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Title</p>
                <p className="text-xl font-medium text-gray-800 dark:text-gray-200">{abstract.title}</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Author</p>
                <p className="text-lg text-gray-800 dark:text-gray-200">{abstract.name}</p>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Abstract Code</p>
                <div className="flex items-center space-x-2">
                  <p className="text-lg font-medium text-purple-600 dark:text-purple-400 tracking-wider">
                    {abstract.abstractCode}
                  </p>
                  <button 
                    onClick={() => navigator.clipboard.writeText(abstract.abstractCode)}
                    className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 p-1.5"
                    title="Copy code"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Article Type</p>
                <p className="text-lg text-gray-800 dark:text-gray-200">{abstract.articleType}</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Presentation Type</p>
                <p className="text-lg text-gray-800 dark:text-gray-200">{abstract.presentationType}</p>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <div className="mt-1">
                  {renderStatusBadge(abstract.status, 'abstract')}
                </div>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Submitted On</p>
                <p className="text-lg text-gray-800 dark:text-gray-200">
                  {new Date(abstract.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
            
            <div className="md:col-span-2 flex flex-col md:flex-row justify-between gap-6">
              <div className="flex-1">
                {/* Abstract Document */}
                {abstract.abstractFileUrl && (
                  <a
                    href={abstract.abstractFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-5 bg-white dark:bg-gray-700 rounded-lg border border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-800/30 transition-colors shadow-sm hover:shadow"
                  >
                    <div className="bg-purple-100 dark:bg-purple-700 p-2.5 rounded-lg">
                      <svg className="w-8 h-8 text-purple-600 dark:text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Abstract Document</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Click to view your submitted abstract</p>
                    </div>
                  </a>
                )}
              </div>
              
              <div className="flex-1">
                {/* QR Code if available */}
                {abstract.qrCodeUrl && (
                  <div className="flex items-center gap-3 p-5 bg-white dark:bg-gray-700 rounded-lg border border-purple-200 dark:border-purple-800 shadow-sm text-center">
                    <div className="w-full">
                      <p className="font-medium text-gray-900 dark:text-gray-100 mb-3">Abstract QR Code</p>
                      <div className="inline-block bg-white p-2 rounded-md mx-auto">
                        <Image
                          src={abstract.qrCodeUrl}
                          alt="Abstract QR Code"
                          width={150}
                          height={150}
                          className="mx-auto"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reviewer Comments */}
          {abstract.rejectionComment && (
            <div className="mt-8 p-5 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-900/50">
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-400 flex items-center gap-2 mb-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                </svg>
                Reviewer Comments
              </h3>
              <div className="bg-white dark:bg-gray-700/50 p-4 rounded-md shadow-sm">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {abstract.rejectionComment}
                </p>
              </div>
            </div>
          )}

          {/* Submit Revision Form */}
          {abstract.status === "Revisions" && (
            <motion.div 
              className="mt-8 p-6 border border-purple-200 dark:border-purple-800 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-2 mb-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                </svg>
                Submit Revised Abstract
              </h3>
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Please upload your revised abstract based on the reviewer comments. Make sure to address all the feedback provided.
              </p>

              <form onSubmit={handleSubmitRevision}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Upload Revised Abstract
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer ${
                      selectedFile ? 'border-purple-300 bg-purple-50 dark:border-purple-600 dark:bg-purple-900/20' : 
                      'border-gray-300 hover:border-purple-300 dark:border-gray-600 dark:hover:border-purple-600'
                    } transition-colors ${uploadingRevision ? 'opacity-60' : ''}`}>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {selectedFile ? (
                          <>
                            <svg className="w-10 h-10 text-purple-500 mb-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path>
                            </svg>
                            <p className="mb-1 text-sm text-purple-600 dark:text-purple-400 font-medium">
                              {selectedFile.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </>
                        ) : (
                          <>
                            <svg className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                            </svg>
                            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              PDF or DOC files (MAX. 10MB)
                            </p>
                          </>
                        )}
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx" 
                        disabled={uploadingRevision}
                      />
                    </label>
                  </div>
                </div>

                {uploadingRevision && (
                  <div className="mb-6">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 flex justify-between">
                      <span>Uploading your revised abstract...</span>
                      <span className="font-medium">{uploadProgress}%</span>
                    </p>
                  </div>
                )}

                {uploadSuccess && (
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md border border-green-200 dark:border-green-900/40 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    Your revised abstract has been submitted successfully and is now under review.
                  </div>
                )}

                <Button
                  variant="gradient"
                  size="lg"
                  type="submit"
                  disabled={!selectedFile || uploadingRevision}
                  isLoading={uploadingRevision}
                  className="w-full"
                  animate
                >
                  {uploadingRevision ? "Uploading..." : "Submit Revised Abstract"}
                </Button>
              </form>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}

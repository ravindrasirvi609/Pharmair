import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { uploadAbstractFile } from "@/lib/services/firebase-client";

// Co-author type definition
type CoAuthor = {
  name: string;
  email: string;
  affiliation: string;
};

// Abstract submission form data type
type AbstractSubmissionData = {
  name: string;
  email: string;
  affiliation: string;
  designation: string;
  title: string;
  subject: string;
  articleType: "Research Paper" | "Review Article" | "Case Study" | "Poster";
  presentationType: "Oral" | "Poster" | "Workshop";
  coAuthors: CoAuthor[];
  abstractFileUrl?: string;
  abstractFilePath?: string;
  abstractCode?: string;
};

interface AbstractSubmissionFormProps {
  initialEmail?: string;
  registrationId?: string;
}

export default function AbstractSubmissionForm({
  initialEmail = "",
  registrationId = "",
}: AbstractSubmissionFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<AbstractSubmissionData>({
    name: "",
    email: initialEmail,
    affiliation: "",
    designation: "",
    title: "",
    subject: "",
    articleType: "Research Paper",
    presentationType: "Oral",
    coAuthors: [],
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coAuthorFields, setCoAuthorFields] = useState<CoAuthor>({
    name: "",
    email: "",
    affiliation: "",
  });
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [temporaryId, setTemporaryId] = useState<string>("");

  useEffect(() => {
    // Generate a temporary ID for the abstract code
    setTemporaryId(`TEMP-${Date.now()}-${Math.floor(Math.random() * 1000)}`);

    // Set up drag and drop event listeners
    const dropZone = dropZoneRef.current;
    if (dropZone) {
      const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
      };

      const handleDragLeave = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
      };

      const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
          handleFileValidation(e.dataTransfer.files[0]);
        }
      };

      dropZone.addEventListener("dragover", handleDragOver);
      dropZone.addEventListener("dragleave", handleDragLeave);
      dropZone.addEventListener("drop", handleDrop);

      return () => {
        dropZone.removeEventListener("dragover", handleDragOver);
        dropZone.removeEventListener("dragleave", handleDragLeave);
        dropZone.removeEventListener("drop", handleDrop);
      };
    }
  }, []);

  // Handle main form field changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate file and set it if valid
  const handleFileValidation = (file: File) => {
    // Validate file type
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!validTypes.includes(file.type)) {
      setError("Invalid file type. Only PDF and Word documents are allowed");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds the maximum limit of 10MB");
      return;
    }

    setSelectedFile(file);
    setError(null);
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileValidation(e.target.files[0]);
    }
  };

  // Handle co-author field changes
  const handleCoAuthorFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setCoAuthorFields((prev) => ({ ...prev, [name]: value }));
  };

  // Add a co-author to the list
  const handleAddCoAuthor = () => {
    // Validate co-author fields
    if (!coAuthorFields.name || !coAuthorFields.email) {
      setError("Co-author name and email are required");
      return;
    }

    // Add new co-author to the list
    setFormData((prev) => ({
      ...prev,
      coAuthors: [...prev.coAuthors, { ...coAuthorFields }],
    }));

    // Clear co-author fields
    setCoAuthorFields({
      name: "",
      email: "",
      affiliation: "",
    });

    setError(null);
  };

  // Remove a co-author from the list
  const handleRemoveCoAuthor = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      coAuthors: prev.coAuthors.filter((_, i) => i !== index),
    }));
  };

  // Upload file to Firebase
  const uploadFileToFirebase = async (): Promise<{
    url: string;
    path: string;
  } | null> => {
    if (!selectedFile) {
      setError("Please upload your abstract document");
      return null;
    }

    setIsUploading(true);
    setUploadProgress(0);

    return new Promise((resolve, reject) => {
      uploadAbstractFile(
        selectedFile,
        temporaryId,
        (progress) => {
          setUploadProgress(progress);
        },
        (error) => {
          setIsUploading(false);
          setError(`File upload failed: ${error.message}`);
          reject(error);
        },
        (url, path) => {
          setIsUploading(false);
          setUploadProgress(100);
          resolve({ url, path });
        }
      );
    });
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("Please upload your abstract document");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First upload the file to Firebase
      const uploadResult = await uploadFileToFirebase();

      if (!uploadResult) {
        setLoading(false);
        return;
      }

      // Prepare the submission data including the file URL
      const submissionData = {
        ...formData,
        abstractFileUrl: uploadResult.url,
        abstractFilePath: uploadResult.path,
        coAuthors: formData.coAuthors,
      };

      // Now send the form data with the file URL to the API
      const response = await axios.post("/api/abstract", submissionData);

      if (response.data.success) {
        // Get abstract data from response
        const { abstractId, registrationCompleted } = response.data.data;

        if (!registrationCompleted && !registrationId) {
          // Prompt user to register for the conference
          router.push(
            `/registration?abstractId=${abstractId}&email=${formData.email}`
          );
        } else {
          // Go to success page
          router.push(`/abstract-success?abstractId=${abstractId}`);
        }
      } else {
        setError(response.data.message || "Abstract submission failed");
      }
    } catch (error: unknown) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message ||
          "Something went wrong. Please try again."
        : "Something went wrong. Please try again.";

      setError(errorMessage);
      console.error("Abstract submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Input field style classes
  const inputClass =
    "w-full px-4 py-3 rounded-lg backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200/50 dark:border-gray-700/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 shadow-sm text-gray-900 dark:text-white";
  const labelClass =
    "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
  const formSectionClass =
    "backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 border border-white/20 dark:border-gray-700/30 rounded-xl p-6 shadow-lg";

  return (
    <div className="p-6">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-md bg-red-50/70 dark:bg-red-900/20 border border-red-200/50 dark:border-red-900/30 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative mb-6"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-8">
          {/* Author Information Section */}
          <motion.div
            className={formSectionClass}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
              Author Information
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="name" className={labelClass}>
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="email" className={labelClass}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="affiliation" className={labelClass}>
                  Affiliation *
                </label>
                <input
                  type="text"
                  name="affiliation"
                  id="affiliation"
                  value={formData.affiliation}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="designation" className={labelClass}>
                  Designation *
                </label>
                <input
                  type="text"
                  name="designation"
                  id="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
            </div>
          </motion.div>

          {/* Co-Authors Section */}
          <motion.div
            className={formSectionClass}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
              Co-Authors
            </h3>

            {/* Co-authors list */}
            {formData.coAuthors.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  Added Co-authors:
                </h4>
                <ul className="divide-y divide-gray-200/50 dark:divide-gray-700/50 border border-gray-200/50 dark:border-gray-700/50 rounded-lg backdrop-blur-sm bg-white/50 dark:bg-gray-800/50">
                  {formData.coAuthors.map((author, index) => (
                    <motion.li
                      key={index}
                      className="p-4 flex justify-between items-center"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">
                          {author.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {author.email}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {author.affiliation}
                        </p>
                      </div>
                      <Button
                        type="button"
                        onClick={() => handleRemoveCoAuthor(index)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        variant="ghost"
                      >
                        Remove
                      </Button>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {/* Add co-author form */}
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label htmlFor="coAuthorName" className={labelClass}>
                  Name
                </label>
                <input
                  type="text"
                  id="coAuthorName"
                  name="name"
                  value={coAuthorFields.name}
                  onChange={handleCoAuthorFieldChange}
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="coAuthorEmail" className={labelClass}>
                  Email
                </label>
                <input
                  type="email"
                  id="coAuthorEmail"
                  name="email"
                  value={coAuthorFields.email}
                  onChange={handleCoAuthorFieldChange}
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="coAuthorAffiliation" className={labelClass}>
                  Affiliation
                </label>
                <input
                  type="text"
                  id="coAuthorAffiliation"
                  name="affiliation"
                  value={coAuthorFields.affiliation}
                  onChange={handleCoAuthorFieldChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button
                type="button"
                onClick={handleAddCoAuthor}
                className="bg-blue-600/80 hover:bg-blue-600/90 text-white"
                variant="glass"
              >
                Add Co-Author
              </Button>
            </div>
          </motion.div>

          {/* Abstract Details Section */}
          <motion.div
            className={formSectionClass}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
              Abstract Details
            </h3>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="title" className={labelClass}>
                  Abstract Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="subject" className={labelClass}>
                  Subject Area *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="articleType" className={labelClass}>
                  Article Type *
                </label>
                <select
                  id="articleType"
                  name="articleType"
                  value={formData.articleType}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="Research Paper">Research Paper</option>
                  <option value="Review Article">Review Article</option>
                  <option value="Case Study">Case Study</option>
                  <option value="Poster">Poster</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="presentationType" className={labelClass}>
                  Presentation Type *
                </label>
                <select
                  id="presentationType"
                  name="presentationType"
                  value={formData.presentationType}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="Oral">Oral Presentation</option>
                  <option value="Poster">Poster Presentation</option>
                  <option value="Workshop">Workshop</option>
                </select>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="abstractFile" className={labelClass}>
                  Upload Abstract Document *
                </label>
                <div
                  ref={dropZoneRef}
                  className={`mt-2 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition-colors duration-300 ${
                    isDragOver
                      ? "border-blue-500 bg-blue-50/30 dark:bg-blue-900/20"
                      : "border-gray-300/50 hover:border-blue-400/50 dark:border-gray-600/50 dark:hover:border-blue-500/50"
                  }`}
                >
                  <input
                    type="file"
                    id="abstractFile"
                    ref={fileInputRef}
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="sr-only"
                    required
                  />

                  <div className="space-y-2 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        variant="ghost"
                        className="text-blue-600 dark:text-blue-400"
                      >
                        Select a file
                      </Button>{" "}
                      or drag and drop
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      PDF, DOC, DOCX up to 10MB
                    </p>
                  </div>

                  {selectedFile && (
                    <div className="mt-4 w-full">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  )}

                  {isUploading && (
                    <div className="w-full mt-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          Uploading...
                        </span>
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          {uploadProgress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            type="submit"
            disabled={loading || isUploading}
            variant="glass"
            size="lg"
            animate={true}
            isLoading={loading || isUploading}
            className="bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-600/90 hover:to-purple-600/90 text-white"
          >
            {loading || isUploading ? "Submitting..." : "Submit Abstract"}
          </Button>
        </motion.div>
      </form>
    </div>
  );
}

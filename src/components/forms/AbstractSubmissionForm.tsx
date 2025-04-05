import React, { useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

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

  // Handle main form field changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

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
      // Create form data for file upload
      const formDataToSend = new FormData();

      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "coAuthors") {
          // Convert co-authors array to JSON string
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, value as string);
        }
      });

      // Add registration ID if provided
      if (registrationId) {
        formDataToSend.append("registrationId", registrationId);
      }

      // Add file
      formDataToSend.append("file", selectedFile);

      // Send request to API
      const response = await axios.post("/api/abstract", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
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
                <div className="mt-1 flex items-center">
                  <input
                    type="file"
                    id="abstractFile"
                    ref={fileInputRef}
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="sr-only"
                    required
                  />
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="inline-flex items-center px-4 py-2 border border-gray-300/50 shadow-sm text-sm font-medium rounded-lg"
                  >
                    Choose File
                  </Button>
                  <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">
                    {selectedFile ? selectedFile.name : "No file selected"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Accepted formats: PDF, DOC, DOCX. Maximum file size: 10MB.
                </p>
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
            disabled={loading}
            variant="glass"
            size="lg"
            animate={true}
            isLoading={loading}
            className="bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-600/90 hover:to-purple-600/90 text-white"
          >
            {loading ? "Submitting..." : "Submit Abstract"}
          </Button>
        </motion.div>
      </form>
    </div>
  );
}

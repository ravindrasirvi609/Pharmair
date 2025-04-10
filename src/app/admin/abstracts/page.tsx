"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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
  createdAt: string;
  abstractFileUrl?: string;
  reviewComment?: string;
}

export default function AbstractsPage() {
  const [abstracts, setAbstracts] = useState<Abstract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedAbstract, setSelectedAbstract] = useState<{
    id: string;
    status: string;
  } | null>(null);
  const [reviewComment, setReviewComment] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchAbstracts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/admin/abstracts");
        const data = await response.json();

        if (data.success) {
          setAbstracts(data.data);
        } else {
          setError("Failed to fetch abstracts");
        }
      } catch (error) {
        console.error("Error fetching abstracts:", error);
        setError("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAbstracts();
  }, []);

  // Filter abstracts based on search term and filters
  const filteredAbstracts = abstracts.filter((abs) => {
    const matchesSearch =
      abs.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      abs.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      abs.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      abs.abstractCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      abs.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesType =
      typeFilter === "all" ||
      abs.articleType.toLowerCase() === typeFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesType;
  });

  // Function to update abstract status
  const updateStatus = async (id: string, status: string, comment: string) => {
    try {
      const response = await fetch(`/api/admin/abstracts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, reviewComment: comment }),
      });

      const data = await response.json();

      if (data.success) {
        // Update the abstract in the local state
        setAbstracts((prevAbstracts) =>
          prevAbstracts.map((abstract) =>
            abstract._id === id
              ? { ...abstract, status, reviewComment: comment }
              : abstract
          )
        );
        setUpdateSuccess(`Abstract status updated to ${status} successfully.`);
        setTimeout(() => setUpdateSuccess(null), 5000); // Clear success message after 5 seconds
      } else {
        setError(data.message || "Failed to update abstract status");
        setTimeout(() => setError(""), 5000); // Clear error message after 5 seconds
      }
    } catch (err) {
      console.error("Error updating abstract status:", err);
      setError("Something went wrong while updating the abstract status");
      setTimeout(() => setError(""), 5000); // Clear error message after 5 seconds
    }
  };

  // Handle the status change functionality
  const handleStatusChange = (id: string, newStatus: string) => {
    setSelectedAbstract({ id, status: newStatus });
    setReviewComment("");
    setShowModal(true);
  };

  const handleSubmitStatusChange = () => {
    if (selectedAbstract) {
      updateStatus(selectedAbstract.id, selectedAbstract.status, reviewComment);
      setShowModal(false);
      setSelectedAbstract(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Abstract Submissions</h1>
        <Link
          href="/admin"
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          Back to Dashboard
        </Link>
      </div>

      {updateSuccess && (
        <div className="bg-green-50 p-4 rounded-md mb-4">
          <p className="text-green-600">{updateSuccess}</p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, title or code..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="InReview">In Review</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
              <option value="Revisions">Revisions Required</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Article Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="Research Paper">Research Paper</option>
              <option value="Review Article">Review Article</option>
              <option value="Case Study">Case Study</option>
              <option value="Poster">Poster</option>
            </select>
          </div>
        </div>
      </div>

      {/* Abstracts Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Presentation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAbstracts.length > 0 ? (
                filteredAbstracts.map((abstract) => (
                  <tr key={abstract._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                        {abstract.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {abstract.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {abstract.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {abstract.articleType}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {abstract.presentationType}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          abstract.status === "Accepted"
                            ? "bg-green-100 text-green-800"
                            : abstract.status === "InReview"
                              ? "bg-yellow-100 text-yellow-800"
                              : abstract.status === "Rejected"
                                ? "bg-red-100 text-red-800"
                                : abstract.status === "Revisions"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {abstract.status === "Revisions"
                          ? "Revisions Required"
                          : abstract.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {abstract.abstractCode}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(abstract.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex flex-col space-y-1">
                        <a
                          href={abstract.abstractFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Abstract
                        </a>
                        <button
                          className="text-green-600 hover:text-green-900"
                          onClick={() =>
                            handleStatusChange(abstract._id, "Accepted")
                          }
                        >
                          Accept
                        </button>
                        <button
                          className="text-purple-600 hover:text-purple-900"
                          onClick={() =>
                            handleStatusChange(abstract._id, "Revisions")
                          }
                        >
                          Request Revisions
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() =>
                            handleStatusChange(abstract._id, "Rejected")
                          }
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No abstracts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Change Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              {selectedAbstract?.status === "Accepted" && "Accept Abstract"}
              {selectedAbstract?.status === "Rejected" && "Reject Abstract"}
              {selectedAbstract?.status === "Revisions" && "Request Revisions"}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comment for Author
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Provide feedback for the author..."
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedAbstract(null);
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitStatusChange}
                className={`px-4 py-2 text-white rounded-md ${
                  selectedAbstract?.status === "Accepted"
                    ? "bg-green-500 hover:bg-green-600"
                    : selectedAbstract?.status === "Rejected"
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-purple-500 hover:bg-purple-600"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

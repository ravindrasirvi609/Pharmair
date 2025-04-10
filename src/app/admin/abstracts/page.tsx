"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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
    title: string;
    author: string;
    status: string;
  } | null>(null);
  const [reviewComment, setReviewComment] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const modalRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    fetchAbstracts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModal]);

  // Sort abstracts based on sortConfig
  const sortedAbstracts = [...abstracts].sort((a, b) => {
    if (!sortConfig) return 0;
    
    let aValue, bValue;
    
    switch (sortConfig.key) {
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'date':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      case 'status':
        aValue = a.status.toLowerCase();
        bValue = b.status.toLowerCase();
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  // Filter abstracts based on search term and filters
  const filteredAbstracts = sortedAbstracts.filter((abs) => {
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

  // Function to request sort by key
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  // Function to get status badge styles
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
      case 'inreview':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' };
      case 'rejected':
        return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' };
      case 'revisions':
        return { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' };
      default:
        return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' };
    }
  };

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
  const handleStatusChange = (id: string, title: string, author: string, newStatus: string) => {
    setSelectedAbstract({ id, title, author, status: newStatus });
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

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return (
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    return sortConfig.direction === 'ascending' ? (
      <svg className="w-4 h-4 ml-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 ml-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[80vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400 animate-pulse">Loading abstracts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-xl shadow-md">
        <div className="flex items-center mb-4 text-red-600">
          <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
          </svg>
          <h2 className="text-2xl font-bold">Error</h2>
        </div>
        <p className="text-red-600 mb-6">{error}</p>
        <button 
          onClick={fetchAbstracts}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Abstract Submissions
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and review submitted abstracts
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/admin"
            className="inline-flex items-center px-4 py-2 bg-white hover:bg-gray-50 text-gray-800 rounded-md shadow-sm border border-gray-200"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <button 
            onClick={() => fetchAbstracts()}
            className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md shadow-sm"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Data
          </button>
        </div>
      </div>

      {updateSuccess && (
        <motion.div 
          className="bg-green-50 p-4 rounded-xl mb-4 border border-green-200 shadow-sm flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            <p className="text-green-700">{updateSuccess}</p>
          </div>
          <button 
            onClick={() => setUpdateSuccess(null)} 
            className="text-green-700 hover:text-green-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </motion.div>
      )}

      {/* Stats and Filters Card */}
      <div className="bg-white p-5 rounded-xl shadow-md mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Stats */}
          <div className="lg:col-span-4 flex flex-wrap gap-4">
            <div className="flex-1 min-w-[120px] px-4 py-3 bg-purple-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Total</div>
              <div className="text-2xl font-bold text-purple-700">{abstracts.length}</div>
            </div>
            <div className="flex-1 min-w-[120px] px-4 py-3 bg-blue-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">In Review</div>
              <div className="text-2xl font-bold text-blue-700">
                {abstracts.filter(a => a.status === 'InReview').length}
              </div>
            </div>
            <div className="flex-1 min-w-[120px] px-4 py-3 bg-green-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Accepted</div>
              <div className="text-2xl font-bold text-green-700">
                {abstracts.filter(a => a.status === 'Accepted').length}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="lg:col-span-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, title or code..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">All Statuses</option>
                <option value="inreview">In Review</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="revisions">Revisions Required</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Article Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">All Types</option>
                <option value="research paper">Research Paper</option>
                <option value="review article">Review Article</option>
                <option value="case study">Case Study</option>
                <option value="poster">Poster</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <span className="text-sm text-gray-700">
            {filteredAbstracts.length} {filteredAbstracts.length === 1 ? 'result' : 'results'}
          </span>
        </div>
        
        <div className="inline-flex bg-white border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 text-sm font-medium ${viewMode === 'table' 
              ? 'bg-purple-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 text-sm font-medium ${viewMode === 'grid' 
              ? 'bg-purple-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Abstracts Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('title')}
                  >
                    <div className="flex items-center">
                      Title
                      {getSortIcon('title')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('name')}
                  >
                    <div className="flex items-center">
                      Author
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Presentation
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      {getSortIcon('status')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('date')}
                  >
                    <div className="flex items-center">
                      Date
                      {getSortIcon('date')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAbstracts.length > 0 ? (
                  filteredAbstracts.map((abstract) => (
                    <tr key={abstract._id} className="hover:bg-gray-50 transition-colors">
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
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
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
                        <div className="text-sm text-gray-500 font-mono">
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
                            className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View
                          </a>
                          <button
                            className="text-green-600 hover:text-green-900 inline-flex items-center"
                            onClick={() =>
                              handleStatusChange(abstract._id, abstract.title, abstract.name, "Accepted")
                            }
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Accept
                          </button>
                          <button
                            className="text-purple-600 hover:text-purple-900 inline-flex items-center"
                            onClick={() =>
                              handleStatusChange(abstract._id, abstract.title, abstract.name, "Revisions")
                            }
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Request Revisions
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900 inline-flex items-center"
                            onClick={() =>
                              handleStatusChange(abstract._id, abstract.title, abstract.name, "Rejected")
                            }
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
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
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-lg font-medium">No abstracts found</p>
                        <p className="text-gray-400">Try changing your search criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Abstracts Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAbstracts.length > 0 ? (
            filteredAbstracts.map((abstract) => {
              const statusStyle = getStatusStyles(abstract.status);
              
              return (
                <motion.div 
                  key={abstract._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text} mb-3`}>
                        {abstract.status === "Revisions" ? "Revisions Required" : abstract.status}
                      </span>
                      <span className="text-xs text-gray-500">{new Date(abstract.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{abstract.title}</h3>
                    
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700">{abstract.name}</p>
                      <p className="text-xs text-gray-500">{abstract.email}</p>
                    </div>
                    
                    <div className="flex gap-3 flex-wrap mb-4">
                      <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md">
                        {abstract.articleType}
                      </span>
                      <span className="bg-gray-50 text-gray-700 text-xs px-2 py-1 rounded-md">
                        {abstract.presentationType}
                      </span>
                      <span className="bg-gray-50 text-gray-700 text-xs px-2 py-1 rounded-md font-mono">
                        {abstract.abstractCode}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 flex flex-wrap justify-between gap-2">
                    <a
                      href={abstract.abstractFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-900 inline-flex items-center text-sm"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </a>
                    
                    <div className="flex gap-3">
                      <button
                        className="text-green-600 hover:text-green-900"
                        onClick={() => handleStatusChange(abstract._id, abstract.title, abstract.name, "Accepted")}
                        title="Accept"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      
                      <button
                        className="text-purple-600 hover:text-purple-900"
                        onClick={() => handleStatusChange(abstract._id, abstract.title, abstract.name, "Revisions")}
                        title="Request Revisions"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleStatusChange(abstract._id, abstract.title, abstract.name, "Rejected")}
                        title="Reject"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full flex flex-col items-center py-12 bg-white rounded-xl border border-gray-200">
              <svg className="w-16 h-16 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-medium text-gray-700">No abstracts found</p>
              <p className="text-gray-400">Try changing your search criteria</p>
            </div>
          )}
        </div>
      )}

      {/* Status Change Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div 
              ref={modalRef}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-semibold flex items-center gap-2 ${
                  selectedAbstract?.status === "Accepted" ? "text-green-600" :
                  selectedAbstract?.status === "Rejected" ? "text-red-600" :
                  "text-purple-600"
                }`}>
                  {selectedAbstract?.status === "Accepted" && (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {selectedAbstract?.status === "Rejected" && (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {selectedAbstract?.status === "Revisions" && (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  )}
                  {selectedAbstract?.status === "Accepted" && "Accept Abstract"}
                  {selectedAbstract?.status === "Rejected" && "Reject Abstract"}
                  {selectedAbstract?.status === "Revisions" && "Request Revisions"}
                </h3>
                <button 
                  onClick={() => {
                    setShowModal(false);
                    setSelectedAbstract(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-lg text-gray-800">{selectedAbstract?.title}</p>
                <p className="text-gray-600 text-sm">Author: {selectedAbstract?.author}</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment for Author
                  {selectedAbstract?.status === 'Revisions' || selectedAbstract?.status === 'Rejected' ? 
                    <span className="text-red-500 ml-1">*</span> : null
                  }
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder={
                    selectedAbstract?.status === "Accepted"
                      ? "Optional: Add congratulatory message or acceptance details..."
                      : selectedAbstract?.status === "Rejected"
                        ? "Please provide detailed feedback explaining the rejection..."
                        : "Please specify what revisions are required..."
                  }
                  required={selectedAbstract?.status === 'Revisions' || selectedAbstract?.status === 'Rejected'}
                ></textarea>
                {(selectedAbstract?.status === 'Revisions' || selectedAbstract?.status === 'Rejected') && 
                  !reviewComment && (
                  <p className="text-xs text-red-500 mt-1">
                    Comment is required for revisions or rejection
                  </p>
                )}
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedAbstract(null);
                  }}
                  className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitStatusChange}
                  disabled={(selectedAbstract?.status === 'Revisions' || selectedAbstract?.status === 'Rejected') && !reviewComment}
                  className={`px-5 py-2 rounded-lg text-white ${
                    selectedAbstract?.status === "Accepted"
                      ? "bg-green-600 hover:bg-green-700"
                      : selectedAbstract?.status === "Rejected"
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-purple-600 hover:bg-purple-700"
                  } ${((selectedAbstract?.status === 'Revisions' || selectedAbstract?.status === 'Rejected') && !reviewComment) ? 
                    "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

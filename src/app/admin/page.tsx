"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

// Define proper interfaces for our data types
interface Registration {
  registrationStatus: string;
  paymentStatus: string;
  registrationType: string;
  // Add other properties as needed
}

interface Abstract {
  status: string;
  articleType: string;
  // Add other properties as needed
}

interface DashboardStats {
  totalRegistrations: number;
  confirmedRegistrations: number;
  pendingRegistrations: number;
  totalAbstracts: number;
  acceptedAbstracts: number;
  inReviewAbstracts: number;
  rejectedAbstracts: number;
  revisionsAbstracts: number;
  registrationTypes: Record<string, number>;
  articleTypes: Record<string, number>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRegistrations: 0,
    confirmedRegistrations: 0,
    pendingRegistrations: 0,
    totalAbstracts: 0,
    acceptedAbstracts: 0,
    inReviewAbstracts: 0,
    rejectedAbstracts: 0,
    revisionsAbstracts: 0,
    registrationTypes: {},
    articleTypes: {},
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Function to count occurrences in array
  const countOccurrences = <T extends Record<K, string>, K extends string>(
    items: T[],
    key: K
  ): Record<string, number> => {
    return items.reduce(
      (acc, item) => {
        const value = item[key];
        acc[value] = (acc[value] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  };

  const fetchDashboardStats = async () => {
    try {
      setRefreshing(true);

      // Fetch registrations
      const regResponse = await fetch("/api/admin/registrations");
      const regData = await regResponse.json();

      // Fetch abstracts
      const absResponse = await fetch("/api/admin/abstracts");
      const absData = await absResponse.json();

      if (regData.success && absData.success) {
        const registrations = regData.data as Registration[];
        const abstracts = absData.data as Abstract[];

        const registrationTypes = countOccurrences(
          registrations,
          "registrationType"
        );
        const articleTypes = countOccurrences(abstracts, "articleType");

        setStats({
          totalRegistrations: registrations.length,
          confirmedRegistrations: registrations.filter(
            (reg: Registration) => reg.registrationStatus === "Confirmed"
          ).length,
          pendingRegistrations: registrations.filter(
            (reg: Registration) => reg.registrationStatus === "Pending"
          ).length,
          totalAbstracts: abstracts.length,
          acceptedAbstracts: abstracts.filter(
            (abs: Abstract) => abs.status === "Accepted"
          ).length,
          inReviewAbstracts: abstracts.filter(
            (abs: Abstract) => abs.status === "InReview"
          ).length,
          rejectedAbstracts: abstracts.filter(
            (abs: Abstract) => abs.status === "Rejected"
          ).length,
          revisionsAbstracts: abstracts.filter(
            (abs: Abstract) => abs.status === "Revisions"
          ).length,
          registrationTypes,
          articleTypes,
        });
      } else {
        setError("Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[80vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400 animate-pulse">
          Loading dashboard data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-xl shadow-md">
        <div className="flex items-center mb-4 text-red-600">
          <svg
            className="w-8 h-8 mr-3"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            ></path>
          </svg>
          <h2 className="text-2xl font-bold">Error</h2>
        </div>
        <p className="text-red-600 mb-6">{error}</p>
        <button
          onClick={fetchDashboardStats}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 md:mb-0">
          Admin Dashboard
        </h1>

        <button
          onClick={() => fetchDashboardStats()}
          disabled={refreshing}
          className={`flex items-center px-4 py-2 rounded-lg transition-all shadow hover:shadow-md ${
            refreshing
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-50 text-blue-600"
          }`}
        >
          <svg
            className={`w-5 h-5 mr-2 ${refreshing ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {refreshing ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-xl shadow-lg text-white relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="absolute right-0 top-0 -mt-4 -mr-16 opacity-30">
            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
            </svg>
          </div>
          <h2 className="text-lg font-medium mb-2">Registrations</h2>
          <p className="text-4xl md:text-5xl font-bold mb-2">
            {stats.totalRegistrations}
          </p>
          <div className="flex justify-between text-sm text-blue-100">
            <span>Confirmed: {stats.confirmedRegistrations}</span>
            <span>Pending: {stats.pendingRegistrations}</span>
          </div>
          <Link
            href="/admin/registrations"
            className="mt-5 inline-flex items-center text-sm bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-colors"
          >
            <span>View Details</span>
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-purple-500 to-purple-700 p-6 rounded-xl shadow-lg text-white relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="absolute right-0 top-0 -mt-4 -mr-16 opacity-30">
            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <h2 className="text-lg font-medium mb-2">Abstracts</h2>
          <p className="text-4xl md:text-5xl font-bold mb-2">
            {stats.totalAbstracts}
          </p>
          <div className="flex justify-between text-sm text-purple-100">
            <span>Accepted: {stats.acceptedAbstracts}</span>
            <span>In Review: {stats.inReviewAbstracts}</span>
          </div>
          <Link
            href="/admin/abstracts"
            className="mt-5 inline-flex items-center text-sm bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-colors"
          >
            <span>View Details</span>
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-green-500 to-green-700 p-6 rounded-xl shadow-lg text-white relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="absolute right-0 top-0 -mt-4 -mr-16 opacity-30">
            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <h2 className="text-lg font-medium mb-2">Acceptance Rate</h2>
          <p className="text-4xl md:text-5xl font-bold mb-2">
            {stats.totalAbstracts
              ? Math.round(
                  (stats.acceptedAbstracts / stats.totalAbstracts) * 100
                ) + "%"
              : "0%"}
          </p>
          <div className="flex justify-between text-sm text-green-100">
            <span>Accepted: {stats.acceptedAbstracts}</span>
            <span>Rejected: {stats.rejectedAbstracts}</span>
          </div>
          <div className="mt-5 w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full"
              style={{
                width: `${stats.totalAbstracts ? (stats.acceptedAbstracts / stats.totalAbstracts) * 100 : 0}%`,
              }}
            ></div>
          </div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-amber-500 to-amber-700 p-6 rounded-xl shadow-lg text-white relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="absolute right-0 top-0 -mt-4 -mr-16 opacity-30">
            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
            </svg>
          </div>
          <h2 className="text-lg font-medium mb-2">Review Status</h2>
          <p className="text-4xl md:text-5xl font-bold mb-2">
            {stats.totalAbstracts
              ? Math.round(
                  ((stats.acceptedAbstracts + stats.rejectedAbstracts) /
                    stats.totalAbstracts) *
                    100
                ) + "%"
              : "0%"}
          </p>
          <div className="flex justify-between text-sm text-amber-100">
            <span>Pending: {stats.inReviewAbstracts}</span>
            <span>Revisions: {stats.revisionsAbstracts}</span>
          </div>
          <div className="mt-5 flex items-center gap-1">
            <div
              className="h-2 bg-green-400 rounded-l-full"
              style={{
                width: `${stats.totalAbstracts ? (stats.acceptedAbstracts / stats.totalAbstracts) * 100 : 0}%`,
              }}
            ></div>
            <div
              className="h-2 bg-red-400"
              style={{
                width: `${stats.totalAbstracts ? (stats.rejectedAbstracts / stats.totalAbstracts) * 100 : 0}%`,
              }}
            ></div>
            <div
              className="h-2 bg-purple-400"
              style={{
                width: `${stats.totalAbstracts ? (stats.revisionsAbstracts / stats.totalAbstracts) * 100 : 0}%`,
              }}
            ></div>
            <div
              className="h-2 bg-white/50 rounded-r-full"
              style={{
                width: `${stats.totalAbstracts ? (stats.inReviewAbstracts / stats.totalAbstracts) * 100 : 0}%`,
              }}
            ></div>
          </div>
        </motion.div>
      </div>

      {/* Details and Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Abstracts Distribution */}
        <motion.div
          className="bg-white rounded-xl shadow-md overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Abstract Status Distribution
            </h2>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Accepted</span>
                  <span className="font-medium">
                    {stats.acceptedAbstracts} (
                    {stats.totalAbstracts
                      ? Math.round(
                          (stats.acceptedAbstracts / stats.totalAbstracts) * 100
                        )
                      : 0}
                    %)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${stats.totalAbstracts ? (stats.acceptedAbstracts / stats.totalAbstracts) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">In Review</span>
                  <span className="font-medium">
                    {stats.inReviewAbstracts} (
                    {stats.totalAbstracts
                      ? Math.round(
                          (stats.inReviewAbstracts / stats.totalAbstracts) * 100
                        )
                      : 0}
                    %)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{
                      width: `${stats.totalAbstracts ? (stats.inReviewAbstracts / stats.totalAbstracts) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Revisions Required</span>
                  <span className="font-medium">
                    {stats.revisionsAbstracts} (
                    {stats.totalAbstracts
                      ? Math.round(
                          (stats.revisionsAbstracts / stats.totalAbstracts) *
                            100
                        )
                      : 0}
                    %)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{
                      width: `${stats.totalAbstracts ? (stats.revisionsAbstracts / stats.totalAbstracts) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Rejected</span>
                  <span className="font-medium">
                    {stats.rejectedAbstracts} (
                    {stats.totalAbstracts
                      ? Math.round(
                          (stats.rejectedAbstracts / stats.totalAbstracts) * 100
                        )
                      : 0}
                    %)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{
                      width: `${stats.totalAbstracts ? (stats.rejectedAbstracts / stats.totalAbstracts) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border-t border-gray-200 p-4">
            <Link
              href="/admin/abstracts"
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              View All Abstracts
              <svg
                className="w-4 h-4 ml-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Link>
          </div>
        </motion.div>

        {/* Article Types Distribution */}
        <motion.div
          className="bg-white rounded-xl shadow-md overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Abstract Types
            </h2>
            <div className="space-y-3">
              {Object.entries(stats.articleTypes).map(
                ([type, count], index) => {
                  const colors = [
                    "blue",
                    "green",
                    "purple",
                    "pink",
                    "yellow",
                    "indigo",
                  ];
                  const colorClass = `bg-${colors[index % colors.length]}-500`;
                  const percentage = stats.totalAbstracts
                    ? Math.round((count / stats.totalAbstracts) * 100)
                    : 0;

                  return (
                    <div key={type}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{type}</span>
                        <span className="font-medium">
                          {count} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={colorClass + " h-2 rounded-full"}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                }
              )}

              {Object.keys(stats.articleTypes).length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No abstract types data available
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl shadow-md mb-8 border border-blue-100 dark:border-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/registrations"
            className="flex flex-col items-center p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
          >
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mb-3">
              <svg
                className="w-8 h-8 text-blue-600 dark:text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
              </svg>
            </div>
            <h3 className="font-medium text-gray-800 dark:text-gray-200">
              Manage Registrations
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center mt-1">
              View and update registration status
            </p>
          </Link>

          <Link
            href="/admin/abstracts"
            className="flex flex-col items-center p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
          >
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mb-3">
              <svg
                className="w-8 h-8 text-purple-600 dark:text-purple-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <h3 className="font-medium text-gray-800 dark:text-gray-200">
              Review Abstracts
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center mt-1">
              Evaluate and manage abstract submissions
            </p>
          </Link>

          <a
            href="#"
            className="flex flex-col items-center p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
          >
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mb-3">
              <svg
                className="w-8 h-8 text-green-600 dark:text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <h3 className="font-medium text-gray-800 dark:text-gray-200">
              Event Schedule
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center mt-1">
              Manage event agenda and sessions
            </p>
          </a>

          <a
            href="#"
            className="flex flex-col items-center p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
          >
            <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full mb-3">
              <svg
                className="w-8 h-8 text-amber-600 dark:text-amber-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <h3 className="font-medium text-gray-800 dark:text-gray-200">
              Generate Reports
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center mt-1">
              Create statistical reports and analytics
            </p>
          </a>
        </div>
      </motion.div>
    </div>
  );
}

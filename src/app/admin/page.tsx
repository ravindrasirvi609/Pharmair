"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Define proper interfaces for our data types
interface Registration {
  registrationStatus: string;
  // Add other properties as needed
}

interface Abstract {
  status: string;
  // Add other properties as needed
}

interface DashboardStats {
  totalRegistrations: number;
  confirmedRegistrations: number;
  pendingRegistrations: number;
  totalAbstracts: number;
  acceptedAbstracts: number;
  inReviewAbstracts: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRegistrations: 0,
    confirmedRegistrations: 0,
    pendingRegistrations: 0,
    totalAbstracts: 0,
    acceptedAbstracts: 0,
    inReviewAbstracts: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoading(true);

        // Fetch registrations
        const regResponse = await fetch("/api/admin/registrations");
        const regData = await regResponse.json();

        // Fetch abstracts
        const absResponse = await fetch("/api/admin/abstracts");
        const absData = await absResponse.json();

        if (regData.success && absData.success) {
          const registrations = regData.data as Registration[];
          const abstracts = absData.data as Abstract[];

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
          });
        } else {
          setError("Failed to fetch dashboard data");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

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
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg text-gray-500 font-medium">
            Total Registrations
          </h2>
          <p className="text-4xl font-bold text-blue-600">
            {stats.totalRegistrations}
          </p>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-green-500">
              Confirmed: {stats.confirmedRegistrations}
            </span>
            <span className="text-yellow-500">
              Pending: {stats.pendingRegistrations}
            </span>
          </div>
          <Link
            href="/admin/registrations"
            className="block mt-4 text-blue-500 hover:underline"
          >
            View all registrations →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg text-gray-500 font-medium">Total Abstracts</h2>
          <p className="text-4xl font-bold text-purple-600">
            {stats.totalAbstracts}
          </p>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-green-500">
              Accepted: {stats.acceptedAbstracts}
            </span>
            <span className="text-yellow-500">
              In Review: {stats.inReviewAbstracts}
            </span>
          </div>
          <Link
            href="/admin/abstracts"
            className="block mt-4 text-purple-500 hover:underline"
          >
            View all abstracts →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg text-gray-500 font-medium">Recent Activity</h2>
          <p className="text-gray-600 mt-2">
            Last updated: {new Date().toLocaleString()}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/admin/registrations"
            className="px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md flex items-center justify-between"
          >
            <span>Manage Registrations</span>
            <span>→</span>
          </Link>
          <Link
            href="/admin/abstracts"
            className="px-4 py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-md flex items-center justify-between"
          >
            <span>Review Abstracts</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

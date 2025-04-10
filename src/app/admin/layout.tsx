"use client";
import { ReactNode, useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminLogin from "../../components/admin/AdminLogin";

// Admin layout component with sidebar and authentication
export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on component mount
  useEffect(() => {
    const authStatus = localStorage.getItem("adminAuth");
    setIsAuthenticated(authStatus === "true");
    setIsLoading(false);
  }, []);

  // Handle login success
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    setIsAuthenticated(false);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  // Show admin interface if authenticated
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar onLogout={handleLogout} />
      <div className="flex-1 transition-all duration-300">
        <main className="p-6 md:p-8 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
}

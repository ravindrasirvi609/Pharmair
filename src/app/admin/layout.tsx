import { ReactNode } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";

// Admin layout component with sidebar
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar />
      <div className="flex-1 transition-all duration-300">
        <main className="p-6 md:p-8 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
}

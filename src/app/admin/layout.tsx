import { ReactNode } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";

// Admin layout component with sidebar
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-8 bg-gray-50">
        {children}
      </div>
    </div>
  );
}
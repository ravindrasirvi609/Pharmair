"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminSidebar = () => {
  const pathname = usePathname();

  const sidebarLinks = [
    { name: "Dashboard", href: "/admin" },
    { name: "Registrations", href: "/admin/registrations" },
    { name: "Abstracts", href: "/admin/abstracts" },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Pharmair Admin</h2>
      </div>
      <nav className="space-y-1">
        {sidebarLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 py-2 rounded-md ${
              pathname === link.href
                ? "bg-indigo-600 text-white"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;

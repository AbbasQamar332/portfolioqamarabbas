"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: "fa-chart-pie" },
  { href: "/admin/profile", label: "Profile", icon: "fa-user" },
  { href: "/admin/skills", label: "Skills", icon: "fa-code" },
  { href: "/admin/projects", label: "Projects", icon: "fa-folder" },
  { href: "/admin/certificates", label: "Certificates", icon: "fa-certificate" },
  { href: "/admin/education", label: "Education", icon: "fa-graduation-cap" },
  { href: "/admin/experiences", label: "Experience", icon: "fa-briefcase" },
  { href: "/admin/gallery", label: "Gallery", icon: "fa-images" },
  { href: "/admin/testimonials", label: "Testimonials", icon: "fa-comment" },
  { href: "/admin/contacts", label: "Messages", icon: "fa-envelope" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.push("/admin/login");
  };

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-64"
      } bg-dark-900 text-white min-h-screen fixed left-0 top-0 z-40 transition-all duration-300 flex flex-col`}
    >
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {!collapsed && (
          <h2 className="font-bold text-lg">Admin Panel</h2>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white/60 hover:text-white transition-colors"
        >
          <i className={`fas ${collapsed ? "fa-chevron-right" : "fa-chevron-left"}`}></i>
        </button>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
                isActive
                  ? "bg-gradient-brand text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <i className={`fas ${item.icon} w-5 text-center`}></i>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-white/60 hover:text-red-400 transition-colors w-full"
        >
          <i className="fas fa-sign-out-alt w-5 text-center"></i>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

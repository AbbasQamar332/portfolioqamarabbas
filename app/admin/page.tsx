"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { DashboardStats } from "@/types";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await adminApi.getDashboard();
      setStats(res.data);
    } catch {
      console.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { label: "Total Projects", value: stats?.total_projects || 0, icon: "fa-folder", color: "from-blue-500 to-blue-600", href: "/admin/projects" },
    { label: "Total Skills", value: stats?.total_skills || 0, icon: "fa-code", color: "from-green-500 to-green-600", href: "/admin/skills" },
    { label: "Certificates", value: stats?.total_certificates || 0, icon: "fa-certificate", color: "from-purple-500 to-purple-600", href: "/admin/certificates" },
    { label: "Gallery Images", value: stats?.total_gallery || 0, icon: "fa-images", color: "from-pink-500 to-pink-600", href: "/admin/gallery" },
    { label: "Messages", value: stats?.total_contacts || 0, icon: "fa-envelope", color: "from-orange-500 to-orange-600", href: "/admin/contacts" },
    { label: "Testimonials", value: stats?.total_testimonials || 0, icon: "fa-comment", color: "from-teal-500 to-teal-600", href: "/admin/testimonials" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <i className="fas fa-spinner fa-spin text-4xl text-primary-500"></i>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Welcome to your portfolio admin panel
        </p>
        {stats?.last_updated && (
          <p className="text-sm text-gray-400 mt-2">
            Last profile update: {new Date(stats.last_updated).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-white dark:bg-dark-700 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white text-2xl`}
              >
                <i className={`fas ${card.icon}`}></i>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                  {card.value}
                </p>
                <p className="text-gray-500 dark:text-gray-400">{card.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 bg-white dark:bg-dark-700 rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/admin/profile" className="p-4 rounded-xl bg-gradient-brand text-white text-center hover:opacity-90 transition-opacity">
            <i className="fas fa-user-edit block text-2xl mb-2"></i>
            Edit Profile
          </Link>
          <Link href="/admin/projects" className="p-4 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white text-center hover:opacity-90 transition-opacity">
            <i className="fas fa-plus-circle block text-2xl mb-2"></i>
            Add Project
          </Link>
          <Link href="/admin/skills" className="p-4 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white text-center hover:opacity-90 transition-opacity">
            <i className="fas fa-plus-circle block text-2xl mb-2"></i>
            Add Skill
          </Link>
          <Link href="/admin/contacts" className="p-4 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white text-center hover:opacity-90 transition-opacity">
            <i className="fas fa-inbox block text-2xl mb-2"></i>
            View Messages
          </Link>
        </div>
      </div>
    </div>
  );
}

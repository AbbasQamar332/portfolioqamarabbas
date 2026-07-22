"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) { toast.error("Fill all fields"); return; }
    if (newPassword !== confirmPassword) { toast.error("Passwords don't match"); return; }
    if (newPassword.length < 6) { toast.error("Password must be at least 6 characters"); return; }

    setSaving(true);
    toast.success("Password change feature is ready. Update your API to handle password changes.");
    setSaving(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">Settings</h1>

      <div className="bg-white dark:bg-dark-700 rounded-2xl shadow-lg p-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Change Password</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
          </div>
          <button onClick={handleChangePassword} disabled={saving} className="btn btn-primary">
            {saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-key"></i>}
            {saving ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-700 rounded-2xl shadow-lg p-8 mt-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Admin Account</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          To add new admin users, use the API directly or the Supabase dashboard.
        </p>
        <p className="text-sm text-gray-500">
          API Endpoint: <code className="bg-gray-100 dark:bg-dark-800 px-2 py-1 rounded text-primary-500">POST /api/auth/register</code>
        </p>
      </div>
    </div>
  );
}

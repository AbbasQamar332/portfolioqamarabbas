"use client";

import { useEffect, useState, FormEvent } from "react";
import { adminApi } from "@/lib/admin-api";
import { Profile } from "@/types";
import toast from "react-hot-toast";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", title: "", about: "", short_bio: "", email: "", phone: "", location: "",
    social_linkedin: "", social_github: "", social_twitter: "", social_instagram: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await adminApi.getProfile();
      const p = res.data;
      setProfile(p);
      if (p) {
        setForm({
          name: p.name || "",
          title: p.title || "",
          about: p.about || "",
          short_bio: p.short_bio || "",
          email: p.email || "",
          phone: p.phone || "",
          location: p.location || "",
          social_linkedin: p.social_links?.linkedin || "",
          social_github: p.social_links?.github || "",
          social_twitter: p.social_links?.twitter || "",
          social_instagram: p.social_links?.instagram || "",
        });
      }
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.updateProfile({
        name: form.name,
        title: form.title,
        about: form.about,
        short_bio: form.short_bio,
        email: form.email,
        phone: form.phone,
        location: form.location,
        social_links: {
          linkedin: form.social_linkedin,
          github: form.social_github,
          twitter: form.social_twitter,
          instagram: form.social_instagram,
        },
      });
      toast.success("Profile saved successfully!");
      loadProfile();
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await adminApi.uploadProfileImage(file, field);
      toast.success("Image uploaded!");
      loadProfile();
    } catch {
      toast.error("Upload failed");
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><i className="fas fa-spinner fa-spin text-4xl text-primary-500"></i></div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">Profile Management</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-dark-700 rounded-2xl shadow-lg p-6 text-center">
          <p className="text-sm text-gray-500 mb-3">Profile Picture</p>
          {profile?.profile_picture ? (
            <img src={profile.profile_picture} alt="Profile" className="w-32 h-32 rounded-full object-cover mx-auto mb-3" />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-600 mx-auto mb-3 flex items-center justify-center text-gray-400 text-4xl">
              <i className="fas fa-user"></i>
            </div>
          )}
          <label className="btn btn-primary text-sm cursor-pointer inline-flex">
            <i className="fas fa-upload"></i> Upload
            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "profile_picture")} />
          </label>
        </div>

        <div className="bg-white dark:bg-dark-700 rounded-2xl shadow-lg p-6 text-center">
          <p className="text-sm text-gray-500 mb-3">Cover Image</p>
          {profile?.cover_image ? (
            <img src={profile.cover_image} alt="Cover" className="w-full h-24 object-cover rounded-xl mb-3" />
          ) : (
            <div className="w-full h-24 rounded-xl bg-gray-200 dark:bg-gray-600 mb-3 flex items-center justify-center text-gray-400 text-2xl">
              <i className="fas fa-image"></i>
            </div>
          )}
          <label className="btn btn-primary text-sm cursor-pointer inline-flex">
            <i className="fas fa-upload"></i> Upload
            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "cover_image")} />
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-700 rounded-2xl shadow-lg p-8 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
            <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
            <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Short Bio</label>
          <textarea value={form.short_bio} onChange={(e) => setForm({ ...form, short_bio: e.target.value })} rows={3} className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">About Me</label>
          <textarea value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} rows={5} className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Social Media Links</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1"><i className="fab fa-linkedin mr-1"></i> LinkedIn</label>
              <input type="url" value={form.social_linkedin} onChange={(e) => setForm({ ...form, social_linkedin: e.target.value })} className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1"><i className="fab fa-github mr-1"></i> GitHub</label>
              <input type="url" value={form.social_github} onChange={(e) => setForm({ ...form, social_github: e.target.value })} className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1"><i className="fab fa-twitter mr-1"></i> Twitter</label>
              <input type="url" value={form.social_twitter} onChange={(e) => setForm({ ...form, social_twitter: e.target.value })} className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1"><i className="fab fa-instagram mr-1"></i> Instagram</label>
              <input type="url" value={form.social_instagram} onChange={(e) => setForm({ ...form, social_instagram: e.target.value })} className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn btn-primary">
          {saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}

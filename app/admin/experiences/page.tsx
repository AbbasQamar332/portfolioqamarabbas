"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { Experience } from "@/types";
import toast from "react-hot-toast";

const defaultForm = { company: "", position: "", description: "", start_date: "", end_date: "", current: false };

export default function AdminExperiencesPage() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try { const res = await adminApi.getExperiences(); setItems(res.data || []); }
    catch { toast.error("Failed to load"); } finally { setLoading(false); }
  };

  const openAdd = () => { setEditing(null); setForm(defaultForm); setShowModal(true); };
  const openEdit = (item: Experience) => { setEditing(item); setForm({ company: item.company, position: item.position, description: item.description, start_date: item.start_date, end_date: item.end_date, current: item.current }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.company || !form.position) { toast.error("Company and position are required"); return; }
    setSaving(true);
    try {
      if (editing) { await adminApi.updateExperience(editing.id, form); toast.success("Updated!"); }
      else { await adminApi.createExperience(form); toast.success("Created!"); }
      setShowModal(false); load();
    } catch { toast.error("Failed to save"); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    try { await adminApi.deleteExperience(id); toast.success("Deleted!"); load(); }
    catch { toast.error("Failed to delete"); }
  };

  if (loading) return <div className="flex justify-center py-20"><i className="fas fa-spinner fa-spin text-4xl text-primary-500"></i></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Experience Management</h1>
        <button onClick={openAdd} className="btn btn-primary"><i className="fas fa-plus"></i> Add Experience</button>
      </div>

      <div className="grid gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white dark:bg-dark-700 rounded-2xl shadow-lg p-6 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{item.position}</h3>
                {item.current && <span className="text-xs bg-gradient-brand text-white px-3 py-1 rounded-full">Current</span>}
              </div>
              <p className="text-primary-500 font-medium">{item.company}</p>
              {(item.start_date || item.end_date) && <p className="text-sm text-gray-400 mt-1">{item.start_date} - {item.end_date || "Present"}</p>}
              {item.description && <p className="text-gray-600 dark:text-gray-300 mt-2">{item.description}</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(item)} className="text-primary-500 hover:text-primary-700"><i className="fas fa-edit"></i></button>
              <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700"><i className="fas fa-trash"></i></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="text-center py-12 text-gray-400">No experience entries yet.</div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-dark-700 rounded-2xl shadow-2xl p-8 w-full max-w-lg m-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">{editing ? "Edit Experience" : "Add Experience"}</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
                  <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Position</label>
                  <input type="text" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                  <input type="text" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} placeholder="e.g., 2023" className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                  <input type="text" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} placeholder="Leave empty if current" className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.current} onChange={(e) => setForm({ ...form, current: e.target.checked })} className="w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Currently working here</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn btn-primary">{saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>} {saving ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

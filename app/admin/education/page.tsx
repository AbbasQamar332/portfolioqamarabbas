"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { Education as EducationType } from "@/types";
import toast from "react-hot-toast";

const defaultForm = { degree: "", institution: "", field_of_study: "", start_date: "", end_date: "", description: "" };

export default function AdminEducationPage() {
  const [items, setItems] = useState<EducationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<EducationType | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try { const res = await adminApi.getEducation(); setItems(res.data || []); }
    catch { toast.error("Failed to load"); } finally { setLoading(false); }
  };

  const openAdd = () => { setEditing(null); setForm(defaultForm); setShowModal(true); };
  const openEdit = (item: EducationType) => { setEditing(item); setForm({ degree: item.degree, institution: item.institution, field_of_study: item.field_of_study, start_date: item.start_date, end_date: item.end_date, description: item.description }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.degree) { toast.error("Degree is required"); return; }
    setSaving(true);
    try {
      if (editing) { await adminApi.updateEducation(editing.id, form); toast.success("Updated!"); }
      else { await adminApi.createEducation(form); toast.success("Created!"); }
      setShowModal(false); load();
    } catch { toast.error("Failed to save"); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    try { await adminApi.deleteEducation(id); toast.success("Deleted!"); load(); }
    catch { toast.error("Failed to delete"); }
  };

  if (loading) return <div className="flex justify-center py-20"><i className="fas fa-spinner fa-spin text-4xl text-primary-500"></i></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Education Management</h1>
        <button onClick={openAdd} className="btn btn-primary"><i className="fas fa-plus"></i> Add Education</button>
      </div>

      <div className="grid gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white dark:bg-dark-700 rounded-2xl shadow-lg p-6 flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{item.degree}</h3>
              <p className="text-primary-500">{item.institution}</p>
              {(item.start_date || item.end_date) && <p className="text-sm text-gray-400 mt-1">{item.start_date} - {item.end_date}</p>}
              {item.description && <p className="text-gray-600 dark:text-gray-300 mt-2">{item.description}</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(item)} className="text-primary-500 hover:text-primary-700"><i className="fas fa-edit"></i></button>
              <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700"><i className="fas fa-trash"></i></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="text-center py-12 text-gray-400">No education entries yet.</div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-dark-700 rounded-2xl shadow-2xl p-8 w-full max-w-lg m-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">{editing ? "Edit Education" : "Add Education"}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Degree</label>
                <input type="text" value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Institution</label>
                <input type="text" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Field of Study</label>
                <input type="text" value={form.field_of_study} onChange={(e) => setForm({ ...form, field_of_study: e.target.value })} className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                  <input type="text" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} placeholder="e.g., 2021" className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                  <input type="text" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} placeholder="e.g., 2025" className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
              </div>
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

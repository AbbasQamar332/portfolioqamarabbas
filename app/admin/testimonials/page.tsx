"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { Testimonial } from "@/types";
import toast from "react-hot-toast";

const defaultForm = { name: "", position: "", company: "", content: "", avatar_url: "", rating: 5 };

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try { const res = await adminApi.getTestimonials(); setItems(res.data || []); }
    catch { toast.error("Failed to load"); } finally { setLoading(false); }
  };

  const openAdd = () => { setEditing(null); setForm(defaultForm); setShowModal(true); };
  const openEdit = (item: Testimonial) => { setEditing(item); setForm({ name: item.name, position: item.position, company: item.company, content: item.content, avatar_url: item.avatar_url, rating: item.rating }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.name || !form.content) { toast.error("Name and content are required"); return; }
    setSaving(true);
    try {
      if (editing) { await adminApi.updateTestimonial(editing.id, form); toast.success("Updated!"); }
      else { await adminApi.createTestimonial(form); toast.success("Created!"); }
      setShowModal(false); load();
    } catch { toast.error("Failed to save"); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    try { await adminApi.deleteTestimonial(id); toast.success("Deleted!"); load(); }
    catch { toast.error("Failed to delete"); }
  };

  if (loading) return <div className="flex justify-center py-20"><i className="fas fa-spinner fa-spin text-4xl text-primary-500"></i></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Testimonials Management</h1>
        <button onClick={openAdd} className="btn btn-primary"><i className="fas fa-plus"></i> Add Testimonial</button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white dark:bg-dark-700 rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              {item.avatar_url ? (
                <img src={item.avatar_url} alt={item.name} className="w-14 h-14 rounded-full object-cover" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-brand flex items-center justify-center text-white text-xl font-bold">
                  {item.name.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">{item.name}</h3>
                {(item.position || item.company) && (
                  <p className="text-sm text-gray-500">{item.position}{item.position && item.company ? ", " : ""}{item.company}</p>
                )}
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 italic mb-3">&ldquo;{item.content}&rdquo;</p>
            <div className="flex items-center justify-between">
              <div className="flex gap-1 text-yellow-400">
                {Array.from({ length: item.rating || 5 }).map((_, i) => (
                  <i key={i} className="fas fa-star"></i>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(item)} className="text-primary-500 hover:text-primary-700"><i className="fas fa-edit"></i></button>
                <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700"><i className="fas fa-trash"></i></button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="col-span-full text-center py-12 text-gray-400">No testimonials yet.</div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-dark-700 rounded-2xl shadow-2xl p-8 w-full max-w-lg m-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">{editing ? "Edit Testimonial" : "Add Testimonial"}</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Position</label>
                  <input type="text" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
                <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={4} className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Avatar URL</label>
                <input type="url" value={form.avatar_url} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rating (1-5)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setForm({ ...form, rating: star })} className={`text-2xl ${star <= form.rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}>
                      <i className="fas fa-star"></i>
                    </button>
                  ))}
                </div>
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

"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { Certificate } from "@/types";
import toast from "react-hot-toast";

const defaultForm = { title: "", issuer: "", image_url: "", date: "" };

export default function AdminCertificatesPage() {
  const [items, setItems] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Certificate | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try { const res = await adminApi.getCertificates(); setItems(res.data || []); }
    catch { toast.error("Failed to load"); } finally { setLoading(false); }
  };

  const openAdd = () => { setEditing(null); setForm(defaultForm); setShowModal(true); };

  const openEdit = (item: Certificate) => {
    setEditing(item);
    setForm({ title: item.title, issuer: item.issuer, image_url: item.image_url, date: item.date });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      if (editing) { await adminApi.updateCertificate(editing.id, form); toast.success("Updated!"); }
      else { await adminApi.createCertificate(form); toast.success("Created!"); }
      setShowModal(false); load();
    } catch { toast.error("Failed to save"); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    try { await adminApi.deleteCertificate(id); toast.success("Deleted!"); load(); }
    catch { toast.error("Failed to delete"); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try { const res = await adminApi.uploadFile(file, "certificates"); setForm({ ...form, image_url: res.data.url }); toast.success("Image uploaded!"); }
    catch { toast.error("Upload failed"); }
  };

  if (loading) return <div className="flex justify-center py-20"><i className="fas fa-spinner fa-spin text-4xl text-primary-500"></i></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Certificates Management</h1>
        <button onClick={openAdd} className="btn btn-primary"><i className="fas fa-plus"></i> Add Certificate</button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white dark:bg-dark-700 rounded-2xl shadow-lg overflow-hidden">
            {item.image_url && <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover" />}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{item.title}</h3>
              {item.issuer && <p className="text-primary-500 text-sm mt-1">{item.issuer}</p>}
              {item.date && <p className="text-gray-400 text-sm mt-1">{item.date}</p>}
              <div className="flex gap-2 mt-4">
                <button onClick={() => openEdit(item)} className="text-primary-500 hover:text-primary-700"><i className="fas fa-edit"></i></button>
                <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700"><i className="fas fa-trash"></i></button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="col-span-full text-center py-12 text-gray-400">No certificates yet.</div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-dark-700 rounded-2xl shadow-2xl p-8 w-full max-w-lg m-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">{editing ? "Edit Certificate" : "Add Certificate"}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Issuer</label>
                <input type="text" value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input type="text" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="e.g., 2024" className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Certificate Image</label>
                {form.image_url && <img src={form.image_url} alt="" className="w-full h-32 object-cover rounded-xl mb-2" />}
                <label className="btn bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 cursor-pointer inline-flex">
                  <i className="fas fa-upload"></i> Upload Image
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
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

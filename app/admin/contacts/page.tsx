"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { Contact } from "@/types";
import toast from "react-hot-toast";

export default function AdminContactsPage() {
  const [items, setItems] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contact | null>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try { const res = await adminApi.getContacts(); setItems(res.data || []); }
    catch { toast.error("Failed to load"); } finally { setLoading(false); }
  };

  const markAsRead = async (id: string) => {
    try { await adminApi.updateContact(id, { is_read: true }); load(); }
    catch { toast.error("Failed to update"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    try { await adminApi.deleteContact(id); toast.success("Deleted!"); load(); if (selected?.id === id) setSelected(null); }
    catch { toast.error("Failed to delete"); }
  };

  if (loading) return <div className="flex justify-center py-20"><i className="fas fa-spinner fa-spin text-4xl text-primary-500"></i></div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">Messages</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => { setSelected(item); if (!item.is_read) markAsRead(item.id); }}
              className={`bg-white dark:bg-dark-700 rounded-2xl shadow-lg p-5 cursor-pointer transition-all hover:shadow-xl ${
                !item.is_read ? "border-l-4 border-primary-500" : ""
              } ${selected?.id === item.id ? "ring-2 ring-primary-500" : ""}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{new Date(item.created_at).toLocaleDateString()}</p>
                  {!item.is_read && <span className="text-xs bg-primary-500 text-white px-2 py-0.5 rounded-full mt-1 inline-block">New</span>}
                </div>
              </div>
              {item.subject && <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Subject: {item.subject}</p>}
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{item.message}</p>
            </div>
          ))}
          {items.length === 0 && <div className="text-center py-12 text-gray-400">No messages yet.</div>}
        </div>

        <div className="bg-white dark:bg-dark-700 rounded-2xl shadow-lg p-8">
          {selected ? (
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{selected.name}</h2>
                  <p className="text-gray-500">{selected.email}</p>
                  {selected.subject && <p className="text-gray-600 dark:text-gray-300 mt-1 font-medium">Subject: {selected.subject}</p>}
                  <p className="text-sm text-gray-400 mt-1">{new Date(selected.created_at).toLocaleString()}</p>
                </div>
                <button onClick={() => handleDelete(selected.id)} className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-dark-800 rounded-lg">
                  <i className="fas fa-trash"></i>
                </button>
              </div>
              <div className="bg-gray-50 dark:bg-dark-800 rounded-xl p-6">
                <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{selected.message}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <a href={`mailto:${selected.email}`} className="btn btn-primary">
                  <i className="fas fa-reply"></i> Reply via Email
                </a>
                {!selected.is_read && (
                  <button onClick={() => markAsRead(selected.id)} className="btn bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
                    <i className="fas fa-check"></i> Mark as Read
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
              <i className="fas fa-envelope-open-text text-6xl mb-4"></i>
              <p>Select a message to view</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

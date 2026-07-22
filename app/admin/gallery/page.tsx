"use client";

import { useEffect, useState, useRef } from "react";
import { adminApi } from "@/lib/admin-api";
import { GalleryItem } from "@/types";
import toast from "react-hot-toast";

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try { const res = await adminApi.getGallery(); setItems(res.data || []); }
    catch { toast.error("Failed to load"); } finally { setLoading(false); }
  };

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("Only images allowed"); return; }
    setUploading(true);
    try {
      const res = await adminApi.uploadFile(file, "gallery");
      await adminApi.createGallery({ title: file.name.split(".")[0], image_url: res.data.url, category: "General" });
      toast.success("Image uploaded!");
      load();
    } catch { toast.error("Upload failed"); }
    finally { setUploading(false); }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    try { await adminApi.deleteGallery(id); toast.success("Deleted!"); load(); }
    catch { toast.error("Failed to delete"); }
  };

  const toggleFeatured = async (item: GalleryItem) => {
    try { await adminApi.updateGallery(item.id, { featured: !item.featured }); load(); }
    catch { toast.error("Failed to update"); }
  };

  if (loading) return <div className="flex justify-center py-20"><i className="fas fa-spinner fa-spin text-4xl text-primary-500"></i></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Gallery Management</h1>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }}
          />
          <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="btn btn-primary">
            {uploading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-upload"></i>}
            {uploading ? "Uploading..." : "Upload Images"}
          </button>
        </div>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        className={`border-2 border-dashed rounded-2xl p-12 text-center mb-8 transition-colors ${
          dragOver ? "border-primary-500 bg-primary-50 dark:bg-dark-700" : "border-gray-300 dark:border-gray-600"
        }`}
      >
        <i className="fas fa-cloud-upload-alt text-5xl text-gray-300 dark:text-gray-500 mb-4"></i>
        <p className="text-gray-500 dark:text-gray-400">Drag and drop images here, or click Upload Images button</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.id} className="group relative bg-white dark:bg-dark-700 rounded-2xl overflow-hidden shadow-lg">
            <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button onClick={() => toggleFeatured(item)} className={`p-2 rounded-full ${item.featured ? "bg-yellow-400 text-yellow-900" : "bg-white/80 text-gray-700"} hover:scale-110 transition-transform`}>
                <i className={`fas ${item.featured ? "fa-star" : "fa-star"}`}></i>
              </button>
              <button onClick={() => handleDelete(item.id)} className="p-2 rounded-full bg-red-500/80 text-white hover:scale-110 transition-transform">
                <i className="fas fa-trash"></i>
              </button>
            </div>
            {item.featured && (
              <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full">
                <i className="fas fa-star mr-1"></i> Featured
              </div>
            )}
            <div className="p-3">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{item.title}</p>
              <p className="text-xs text-gray-400">{item.category}</p>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-400">No images in gallery yet.</div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { Project } from "@/types";
import toast from "react-hot-toast";

const defaultForm = { title: "", description: "", technologies: [] as string[], github_link: "", live_link: "", featured: false, category: "General", status: "completed", images: [] as string[] };

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [techInput, setTechInput] = useState("");

  useEffect(() => { loadProjects(); }, []);

  const loadProjects = async () => {
    try { const res = await adminApi.getProjects(); setProjects(res.data || []); }
    catch { toast.error("Failed to load projects"); }
    finally { setLoading(false); }
  };

  const openAdd = () => { setEditing(null); setForm(defaultForm); setShowModal(true); };

  const openEdit = (project: Project) => {
    setEditing(project);
    setForm({
      title: project.title, description: project.description,
      technologies: project.technologies || [], github_link: project.github_link || "",
      live_link: project.live_link || "", featured: project.featured || false,
      category: project.category || "General", status: project.status || "completed",
      images: project.images?.map(i => i.image_url) || [],
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      if (editing) {
        await adminApi.updateProject(editing.id, form);
        toast.success("Project updated!");
      } else {
        await adminApi.createProject(form);
        toast.success("Project created!");
      }
      setShowModal(false);
      loadProjects();
    } catch { toast.error("Failed to save project"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try { await adminApi.deleteProject(id); toast.success("Deleted!"); loadProjects(); }
    catch { toast.error("Failed to delete"); }
  };

  const addTech = () => {
    if (techInput.trim() && !form.technologies.includes(techInput.trim())) {
      setForm({ ...form, technologies: [...form.technologies, techInput.trim()] });
      setTechInput("");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await adminApi.uploadFile(file, "projects");
      setForm({ ...form, images: [...form.images, res.data.url] });
      toast.success("Image uploaded!");
    } catch { toast.error("Upload failed"); }
  };

  if (loading) return <div className="flex justify-center py-20"><i className="fas fa-spinner fa-spin text-4xl text-primary-500"></i></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Projects Management</h1>
        <button onClick={openAdd} className="btn btn-primary"><i className="fas fa-plus"></i> Add Project</button>
      </div>

      <div className="grid gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white dark:bg-dark-700 rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{project.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">{project.category} {project.featured && <span className="ml-2 text-xs bg-gradient-brand text-white px-2 py-0.5 rounded-full">Featured</span>}</p>
                <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {(project.technologies || []).map((tech: string) => (
                    <span key={tech} className="px-3 py-1 bg-gray-100 dark:bg-dark-800 text-sm rounded-full text-gray-600 dark:text-gray-300">{tech}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(project)} className="p-2 text-primary-500 hover:bg-primary-50 dark:hover:bg-dark-800 rounded-lg"><i className="fas fa-edit"></i></button>
                <button onClick={() => handleDelete(project.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-dark-800 rounded-lg"><i className="fas fa-trash"></i></button>
              </div>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="text-center py-12 text-gray-400">No projects yet. Create your first project!</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-dark-700 rounded-2xl shadow-2xl p-8 w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">{editing ? "Edit Project" : "Add Project"}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none">
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="planned">Planned</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub Link</label>
                  <input type="url" value={form.github_link} onChange={(e) => setForm({ ...form, github_link: e.target.value })} className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Live Demo Link</label>
                  <input type="url" value={form.live_link} onChange={(e) => setForm({ ...form, live_link: e.target.value })} className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Technologies</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())} placeholder="Type and press Enter" className="flex-1 p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
                  <button onClick={addTech} type="button" className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-300">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.technologies.map((tech) => (
                    <span key={tech} className="px-3 py-1 bg-primary-50 dark:bg-dark-800 text-primary-600 dark:text-primary-300 rounded-full text-sm flex items-center gap-1">
                      {tech}
                      <button onClick={() => setForm({ ...form, technologies: form.technologies.filter(t => t !== tech) })} className="text-red-400 hover:text-red-600">&times;</button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Featured Project</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Images</label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {form.images.map((url, i) => (
                    <div key={i} className="relative">
                      <img src={url} alt="" className="w-24 h-24 object-cover rounded-xl" />
                      <button onClick={() => setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) })} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">&times;</button>
                    </div>
                  ))}
                </div>
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

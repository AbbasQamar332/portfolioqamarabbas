"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { Skill } from "@/types";
import toast from "react-hot-toast";

const defaultForm = { name: "", category: "General", percentage: 0, icon_url: "", order_index: 0 };

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadSkills(); }, []);

  const loadSkills = async () => {
    try {
      const res = await adminApi.getSkills();
      setSkills(res.data || []);
    } catch { toast.error("Failed to load skills"); }
    finally { setLoading(false); }
  };

  const openAdd = () => { setEditing(null); setForm(defaultForm); setShowModal(true); };

  const openEdit = (skill: Skill) => {
    setEditing(skill);
    setForm({ name: skill.name, category: skill.category, percentage: skill.percentage, icon_url: skill.icon_url, order_index: skill.order_index });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      if (editing) {
        await adminApi.updateSkill(editing.id, form);
        toast.success("Skill updated!");
      } else {
        await adminApi.createSkill(form);
        toast.success("Skill created!");
      }
      setShowModal(false);
      loadSkills();
    } catch { toast.error("Failed to save skill"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    try {
      await adminApi.deleteSkill(id);
      toast.success("Skill deleted!");
      loadSkills();
    } catch { toast.error("Failed to delete skill"); }
  };

  if (loading) return <div className="flex justify-center py-20"><i className="fas fa-spinner fa-spin text-4xl text-primary-500"></i></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Skills Management</h1>
        <button onClick={openAdd} className="btn btn-primary"><i className="fas fa-plus"></i> Add Skill</button>
      </div>

      <div className="bg-white dark:bg-dark-700 rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-dark-800">
            <tr>
              <th className="text-left p-4 text-gray-600 dark:text-gray-300 font-medium">Name</th>
              <th className="text-left p-4 text-gray-600 dark:text-gray-300 font-medium">Category</th>
              <th className="text-left p-4 text-gray-600 dark:text-gray-300 font-medium">Percentage</th>
              <th className="text-left p-4 text-gray-600 dark:text-gray-300 font-medium">Order</th>
              <th className="text-right p-4 text-gray-600 dark:text-gray-300 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill) => (
              <tr key={skill.id} className="border-t border-gray-100 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-dark-800">
                <td className="p-4 text-gray-800 dark:text-gray-200">{skill.name}</td>
                <td className="p-4"><span className="px-3 py-1 bg-primary-50 dark:bg-dark-700 text-primary-600 dark:text-primary-300 rounded-full text-sm">{skill.category}</span></td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div className="bg-gradient-brand h-2 rounded-full" style={{ width: `${skill.percentage}%` }}></div>
                    </div>
                    <span className="text-sm text-gray-500">{skill.percentage}%</span>
                  </div>
                </td>
                <td className="p-4 text-gray-500">{skill.order_index}</td>
                <td className="p-4 text-right">
                  <button onClick={() => openEdit(skill)} className="text-primary-500 hover:text-primary-700 mr-3"><i className="fas fa-edit"></i></button>
                  <button onClick={() => handleDelete(skill.id)} className="text-red-500 hover:text-red-700"><i className="fas fa-trash"></i></button>
                </td>
              </tr>
            ))}
            {skills.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-gray-400">No skills found. Add your first skill!</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-dark-700 rounded-2xl shadow-2xl p-8 w-full max-w-lg m-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">{editing ? "Edit Skill" : "Add Skill"}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Percentage (0-100)</label>
                <input type="number" min={0} max={100} value={form.percentage} onChange={(e) => setForm({ ...form, percentage: parseInt(e.target.value) || 0 })} className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Icon URL (optional)</label>
                <input type="url" value={form.icon_url} onChange={(e) => setForm({ ...form, icon_url: e.target.value })} className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Order Index</label>
                <input type="number" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: parseInt(e.target.value) || 0 })} className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 focus:border-primary-500 outline-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn btn-primary">{saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>} {saving ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

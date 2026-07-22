const API_BASE = "/api";

function getHeaders() {
  const token = localStorage.getItem("admin_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse(res: Response) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const adminApi = {
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getDashboard: async () => {
    const res = await fetch(`${API_BASE}/dashboard`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getProfile: async () => {
    const res = await fetch(`${API_BASE}/profile`);
    return handleResponse(res);
  },

  updateProfile: async (data: Record<string, unknown>) => {
    const res = await fetch(`${API_BASE}/profile`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  uploadProfileImage: async (file: File, field: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("field", field);
    const res = await fetch(`${API_BASE}/profile/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
      body: formData,
    });
    return handleResponse(res);
  },

  uploadFile: async (file: File, folder: string = "general") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
      body: formData,
    });
    return handleResponse(res);
  },

  getSkills: async () => {
    const res = await fetch(`${API_BASE}/skills`);
    return handleResponse(res);
  },

  createSkill: async (data: Record<string, unknown>) => {
    const res = await fetch(`${API_BASE}/skills`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  updateSkill: async (id: string, data: Record<string, unknown>) => {
    const res = await fetch(`${API_BASE}/skills/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  deleteSkill: async (id: string) => {
    const res = await fetch(`${API_BASE}/skills/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getProjects: async () => {
    const res = await fetch(`${API_BASE}/projects`);
    return handleResponse(res);
  },

  createProject: async (data: Record<string, unknown>) => {
    const res = await fetch(`${API_BASE}/projects`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  updateProject: async (id: string, data: Record<string, unknown>) => {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  deleteProject: async (id: string) => {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getCertificates: async () => {
    const res = await fetch(`${API_BASE}/certificates`);
    return handleResponse(res);
  },

  createCertificate: async (data: Record<string, unknown>) => {
    const res = await fetch(`${API_BASE}/certificates`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  updateCertificate: async (id: string, data: Record<string, unknown>) => {
    const res = await fetch(`${API_BASE}/certificates/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  deleteCertificate: async (id: string) => {
    const res = await fetch(`${API_BASE}/certificates/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getEducation: async () => {
    const res = await fetch(`${API_BASE}/education`);
    return handleResponse(res);
  },

  createEducation: async (data: Record<string, unknown>) => {
    const res = await fetch(`${API_BASE}/education`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  updateEducation: async (id: string, data: Record<string, unknown>) => {
    const res = await fetch(`${API_BASE}/education/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  deleteEducation: async (id: string) => {
    const res = await fetch(`${API_BASE}/education/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getExperiences: async () => {
    const res = await fetch(`${API_BASE}/experiences`);
    return handleResponse(res);
  },

  createExperience: async (data: Record<string, unknown>) => {
    const res = await fetch(`${API_BASE}/experiences`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  updateExperience: async (id: string, data: Record<string, unknown>) => {
    const res = await fetch(`${API_BASE}/experiences/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  deleteExperience: async (id: string) => {
    const res = await fetch(`${API_BASE}/experiences/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getGallery: async () => {
    const res = await fetch(`${API_BASE}/gallery`);
    return handleResponse(res);
  },

  createGallery: async (data: Record<string, unknown>) => {
    const res = await fetch(`${API_BASE}/gallery`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  updateGallery: async (id: string, data: Record<string, unknown>) => {
    const res = await fetch(`${API_BASE}/gallery/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  deleteGallery: async (id: string) => {
    const res = await fetch(`${API_BASE}/gallery/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getTestimonials: async () => {
    const res = await fetch(`${API_BASE}/testimonials`);
    return handleResponse(res);
  },

  createTestimonial: async (data: Record<string, unknown>) => {
    const res = await fetch(`${API_BASE}/testimonials`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  updateTestimonial: async (id: string, data: Record<string, unknown>) => {
    const res = await fetch(`${API_BASE}/testimonials/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  deleteTestimonial: async (id: string) => {
    const res = await fetch(`${API_BASE}/testimonials/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getContacts: async () => {
    const res = await fetch(`${API_BASE}/contacts`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  updateContact: async (id: string, data: Record<string, unknown>) => {
    const res = await fetch(`${API_BASE}/contacts/${id}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  deleteContact: async (id: string) => {
    const res = await fetch(`${API_BASE}/contacts/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};

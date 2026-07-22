"use client";

export default function FloatingAdminButton() {
  return (
    <a
      href="/admin"
      className="btn btn-primary manage-btn"
      title="Manage Portfolio"
    >
      <i className="fas fa-cog"></i>
    </a>
  );
}

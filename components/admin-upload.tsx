"use client";

import { FormEvent, useEffect, useState } from "react";
import type { ArchiveItem } from "@/lib/archive-data";
import { createArchiveItem, deleteArchiveItem, fetchArchiveItems, updateArchiveItem } from "@/lib/archive-api";

const AUTH_KEY = "yoonjin-shi-admin-auth";
const PASSWORD_KEY = "yoonjin-shi-admin-password";

function todayYYMMDD() {
  const now = new Date();
  const year = String(now.getFullYear()).slice(2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function notifyArchiveUpdated() {
  window.dispatchEvent(new Event("archive-items-updated"));
}

function tagsFromInput(tags: string) {
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function AdminUpload() {
  const [items, setItems] = useState<ArchiveItem[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [savedPassword, setSavedPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [projectId, setProjectId] = useState("P01");
  const [date, setDate] = useState(todayYYMMDD());
  const [tags, setTags] = useState("drawing, architecture");
  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(true);

  const refreshItems = async () => {
    const archiveItems = await fetchArchiveItems();
    setItems(archiveItems);
    notifyArchiveUpdated();
  };

  useEffect(() => {
    const storedPassword = window.sessionStorage.getItem(PASSWORD_KEY) ?? "";
    const storedAuth = window.sessionStorage.getItem(AUTH_KEY) === "true";

    setSavedPassword(storedPassword);
    setIsAuthenticated(storedAuth && Boolean(storedPassword));

    if (storedAuth && storedPassword) {
      refreshItems().catch(() => setStatus("Archive items could not be loaded."));
    }
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setSelectedFile(null);
    setImagePreview("");
    setProjectId("P01");
    setDate(todayYYMMDD());
    setTags("drawing, architecture");
    setCaption("");
    setDescription("");
    setFeatured(true);
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!password.trim()) {
      setAuthError("Password is required.");
      return;
    }

    window.sessionStorage.setItem(AUTH_KEY, "true");
    window.sessionStorage.setItem(PASSWORD_KEY, password);
    setSavedPassword(password);
    setIsAuthenticated(true);
    setAuthError("");
    setPassword("");

    try {
      await refreshItems();
    } catch {
      setStatus("Archive items could not be loaded yet.");
    }
  };

  const handleImageChange = (file?: File) => {
    if (!file) {
      return;
    }

    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("");

    if (!editingId && !selectedFile) {
      setStatus("Image file is required.");
      return;
    }

    const payload = {
      projectId: projectId.trim() || "P01",
      tags: tagsFromInput(tags),
      caption: caption.trim() || undefined,
      description: description.trim() || undefined,
      date: date.trim() || todayYYMMDD(),
      featured,
      alt: caption.trim() || "Archive image",
    };

    setIsSaving(true);

    try {
      if (editingId) {
        await updateArchiveItem(editingId, savedPassword, payload, selectedFile ?? undefined);
        setStatus("Archive item updated.");
      } else if (selectedFile) {
        await createArchiveItem(savedPassword, payload, selectedFile);
        setStatus("Archive item uploaded.");
      }

      await refreshItems();
      resetForm();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (item: ArchiveItem) => {
    setEditingId(item.id);
    setSelectedFile(null);
    setImagePreview(item.imageUrl);
    setProjectId(item.projectId);
    setDate(item.date);
    setTags(item.tags.join(", "));
    setCaption(item.caption ?? "");
    setDescription(item.description ?? "");
    setFeatured(item.featured);
    setStatus("");
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this archive item?")) {
      return;
    }

    setStatus("");
    setIsSaving(true);

    try {
      await deleteArchiveItem(id, savedPassword);
      await refreshItems();
      setStatus("Archive item deleted.");

      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Delete failed.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    window.sessionStorage.removeItem(AUTH_KEY);
    window.sessionStorage.removeItem(PASSWORD_KEY);
    setSavedPassword("");
    setIsAuthenticated(false);
    resetForm();
  };

  if (!isAuthenticated) {
    return (
      <section className="max-w-sm text-sm font-normal leading-snug">
        <h1 className="font-normal">Admin</h1>
        <form onSubmit={handleLogin} className="mt-8 grid gap-4">
          <label className="grid gap-2">
            <span className="text-neutral-500">Password</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="border border-neutral-300 p-3" />
          </label>
          {authError ? <p className="text-neutral-500">{authError}</p> : null}
          <button type="submit" className="w-fit underline underline-offset-4">
            Enter
          </button>
        </form>
      </section>
    );
  }

  return (
    <div className="grid gap-12 text-sm font-normal lg:grid-cols-[minmax(0,520px)_1fr]">
      <section>
        <div className="flex items-center justify-between gap-6">
          <h1 className="font-normal">Admin Upload</h1>
          <button type="button" onClick={handleLogout} className="text-neutral-500 underline-offset-4 hover:text-black hover:underline">
            Logout
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
          <label className="grid gap-2">
            <span className="text-neutral-500">Image</span>
            <input type="file" accept="image/*" onChange={(event) => handleImageChange(event.target.files?.[0])} className="border border-neutral-300 p-3" />
          </label>

          {imagePreview ? <img src={imagePreview} alt="Upload preview" className="aspect-[4/5] w-full max-w-xs object-cover" /> : null}

          <div className="grid grid-cols-2 gap-4">
            <label className="grid gap-2">
              <span className="text-neutral-500">Project ID</span>
              <input value={projectId} onChange={(event) => setProjectId(event.target.value)} className="border border-neutral-300 p-3" />
            </label>
            <label className="grid gap-2">
              <span className="text-neutral-500">Date</span>
              <input value={date} onChange={(event) => setDate(event.target.value)} className="border border-neutral-300 p-3" />
            </label>
          </div>

          <label className="grid gap-2">
            <span className="text-neutral-500">Tags</span>
            <input value={tags} onChange={(event) => setTags(event.target.value)} className="border border-neutral-300 p-3" />
          </label>

          <label className="grid gap-2">
            <span className="text-neutral-500">Caption</span>
            <input value={caption} onChange={(event) => setCaption(event.target.value)} className="border border-neutral-300 p-3" />
          </label>

          <label className="grid gap-2">
            <span className="text-neutral-500">Description</span>
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={5} className="resize-none border border-neutral-300 p-3" />
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} />
            <span>Show in Recent Additions</span>
          </label>

          {status ? <p className="text-neutral-500">{status}</p> : null}

          <div className="flex gap-4">
            <button type="submit" disabled={isSaving} className="underline underline-offset-4 disabled:text-neutral-400">
              {editingId ? "Save Changes" : "Add Image"}
            </button>
            {editingId ? (
              <button type="button" onClick={resetForm} className="text-neutral-500 underline-offset-4 hover:text-black hover:underline">
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section>
        <h2 className="font-normal">Archive Items</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
          {items.map((item) => (
            <article key={item.id} className="grid gap-2">
              <img src={item.imageUrl} alt={item.alt ?? item.id} className="aspect-[4/5] w-full object-cover" />
              <div className="flex items-center justify-between gap-3">
                <span>{item.projectId}</span>
                <div className="flex gap-3 text-neutral-500">
                  <button type="button" onClick={() => handleEdit(item)} className="underline-offset-4 hover:text-black hover:underline">
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDelete(item.id)} className="underline-offset-4 hover:text-black hover:underline">
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

"use client";

import type { ArchiveItem } from "@/lib/archive-data";

type ArchivePayload = {
  projectId: string;
  tags: string[];
  caption?: string;
  description?: string;
  date: string;
  featured: boolean;
  alt?: string;
};

async function parseResponse(response: Response) {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error ?? "Archive request failed.");
  }

  return data;
}

export async function fetchArchiveItems(): Promise<ArchiveItem[]> {
  const response = await fetch("/api/archive", { cache: "no-store" });
  const data = await parseResponse(response);
  return data.items;
}

export async function createArchiveItem(password: string, payload: ArchivePayload, file: File) {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("payload", JSON.stringify(payload));

  const response = await fetch("/api/archive", {
    method: "POST",
    headers: { "x-admin-password": password },
    body: formData,
  });

  return parseResponse(response);
}

export async function updateArchiveItem(id: string, password: string, payload: ArchivePayload, file?: File) {
  const formData = new FormData();
  formData.append("payload", JSON.stringify(payload));

  if (file) {
    formData.append("image", file);
  }

  const response = await fetch(`/api/archive/${id}`, {
    method: "PUT",
    headers: { "x-admin-password": password },
    body: formData,
  });

  return parseResponse(response);
}

export async function deleteArchiveItem(id: string, password: string) {
  const response = await fetch(`/api/archive/${id}`, {
    method: "DELETE",
    headers: { "x-admin-password": password },
  });

  return parseResponse(response);
}

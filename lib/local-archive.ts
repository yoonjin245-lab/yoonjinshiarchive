"use client";

import type { ArchiveItem } from "@/lib/archive-data";

const STORAGE_KEY = "yoonjin-shi-local-archive-items";

export function readLocalArchiveItems(): ArchiveItem[] {
  try {
    const rawItems = window.localStorage.getItem(STORAGE_KEY);
    return rawItems ? (JSON.parse(rawItems) as ArchiveItem[]) : [];
  } catch {
    return [];
  }
}

export function writeLocalArchiveItems(items: ArchiveItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function addLocalArchiveItem(item: ArchiveItem) {
  const items = readLocalArchiveItems();
  writeLocalArchiveItems([item, ...items]);
}

export function updateLocalArchiveItem(updatedItem: ArchiveItem) {
  const items = readLocalArchiveItems().map((item) => (item.id === updatedItem.id ? updatedItem : item));
  writeLocalArchiveItems(items);
}

export function deleteLocalArchiveItem(id: string) {
  const items = readLocalArchiveItems().filter((item) => item.id !== id);
  writeLocalArchiveItems(items);
}
"use client";

import { useEffect } from "react";
import type { ArchiveItem } from "@/lib/archive-data";

type ImageLightboxProps = {
  item: ArchiveItem | null;
  onClose: () => void;
};

export function ImageLightbox({ item, onClose }: ImageLightboxProps) {
  useEffect(() => {
    if (!item) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [item, onClose]);

  if (!item) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={item.caption ?? item.id}
      onClick={onClose}
    >
      <div
        className="grid max-h-[92vh] w-full max-w-6xl grid-rows-[minmax(0,1fr)_auto] overflow-hidden border border-black bg-white sm:grid-cols-[minmax(0,1fr)_320px] sm:grid-rows-1"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex min-h-[45vh] items-center justify-center bg-white p-5 sm:min-h-[72vh]">
          <img
            src={item.imageUrl}
            alt={item.alt ?? item.caption ?? item.id}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        <aside className="relative flex flex-col gap-7 border-t border-neutral-200 p-5 text-sm font-normal sm:border-l sm:border-t-0 sm:p-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-neutral-500">{item.projectId}</p>
              {item.caption ? <h2 className="mt-3 text-base font-normal leading-snug">{item.caption}</h2> : null}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-xl leading-none text-neutral-500 hover:text-black"
              aria-label="Close image popup"
            >
              X
            </button>
          </div>

          <div className="text-sm text-neutral-700">{item.tags.join(", ")}</div>

          {item.description ? (
            <p className="max-w-prose text-[15px] leading-relaxed text-neutral-700">{item.description}</p>
          ) : null}

          <dl className="mt-auto grid gap-2 pt-5 text-xs text-neutral-500">
            <div className="flex justify-between gap-6">
              <dt>Date</dt>
              <dd className="text-black">{item.date}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
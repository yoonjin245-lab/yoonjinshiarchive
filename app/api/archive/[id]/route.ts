import { NextRequest, NextResponse } from "next/server";
import type { ArchiveRow } from "@/lib/archive-mappers";
import { rowToArchiveItem } from "@/lib/archive-mappers";
import { createSupabaseAdminClient, SUPABASE_BUCKET } from "@/lib/supabase";

function isAuthorized(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  return Boolean(adminPassword && request.headers.get("x-admin-password") === adminPassword);
}

function forbidden() {
  return NextResponse.json({ error: "Admin password is incorrect." }, { status: 401 });
}

function missingConfig() {
  return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
}

function parsePayload(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    throw new Error("Missing archive payload.");
  }

  return JSON.parse(value) as {
    projectId: string;
    tags: string[];
    caption?: string;
    description?: string;
    date: string;
    featured: boolean;
    alt?: string;
  };
}

function rowPayload(payload: ReturnType<typeof parsePayload>, image?: { imageUrl: string; imagePath: string }) {
  return {
    ...(image
      ? {
          image_url: image.imageUrl,
          image_path: image.imagePath,
        }
      : {}),
    project_id: payload.projectId.trim() || "P01",
    tags: payload.tags,
    caption: payload.caption?.trim() || null,
    description: payload.description?.trim() || null,
    date: payload.date.trim(),
    featured: payload.featured,
    alt: payload.alt?.trim() || payload.caption?.trim() || "Archive image",
  };
}

async function uploadImage(file: File) {
  const admin = createSupabaseAdminClient();

  if (!admin) {
    throw new Error("Supabase admin client is not configured.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeName = file.name
    .replace(`.${extension}`, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-|-$/g, "");
  const imagePath = `${Date.now()}-${safeName || "archive-image"}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await admin.storage.from(SUPABASE_BUCKET).upload(imagePath, buffer, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });

  if (error) {
    throw error;
  }

  const { data } = admin.storage.from(SUPABASE_BUCKET).getPublicUrl(imagePath);

  return {
    imageUrl: data.publicUrl,
    imagePath,
  };
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthorized(request)) {
    return forbidden();
  }

  const admin = createSupabaseAdminClient();

  if (!admin) {
    return missingConfig();
  }

  try {
    const { id } = await params;
    const formData = await request.formData();
    const payload = parsePayload(formData.get("payload"));
    const file = formData.get("image");
    const image = file instanceof File ? await uploadImage(file) : undefined;

    const { data: previousItem } = await admin.from("archive_items").select("image_path").eq("id", id).single();
    const { data, error } = await admin.from("archive_items").update(rowPayload(payload, image)).eq("id", id).select("*").single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (image && previousItem?.image_path) {
      await admin.storage.from(SUPABASE_BUCKET).remove([previousItem.image_path]);
    }

    return NextResponse.json({ item: rowToArchiveItem(data as ArchiveRow) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Update failed." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthorized(request)) {
    return forbidden();
  }

  const admin = createSupabaseAdminClient();

  if (!admin) {
    return missingConfig();
  }

  try {
    const { id } = await params;
    const { data: previousItem } = await admin.from("archive_items").select("image_path").eq("id", id).single();
    const { error } = await admin.from("archive_items").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (previousItem?.image_path) {
      await admin.storage.from(SUPABASE_BUCKET).remove([previousItem.image_path]);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Delete failed." }, { status: 500 });
  }
}

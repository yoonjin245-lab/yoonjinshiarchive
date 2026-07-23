import { NextRequest, NextResponse } from "next/server";
import type { ArchiveRow } from "@/lib/archive-mappers";
import { rowToArchiveItem } from "@/lib/archive-mappers";
import { createSupabaseAdminClient, SUPABASE_BUCKET, supabase } from "@/lib/supabase";

function getAdminPassword(request: NextRequest) {
  return request.headers.get("x-admin-password") ?? "";
}

function isAuthorized(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  return Boolean(adminPassword && getAdminPassword(request) === adminPassword);
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

export async function GET() {
  const client = createSupabaseAdminClient() ?? supabase;

  if (!client) {
    return NextResponse.json({ items: [] });
  }

  const { data, error } = await client.from("archive_items").select("*").order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ items: (data as ArchiveRow[]).map(rowToArchiveItem) });
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return forbidden();
  }

  const admin = createSupabaseAdminClient();

  if (!admin) {
    return missingConfig();
  }

  try {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Image file is required." }, { status: 400 });
    }

    const payload = parsePayload(formData.get("payload"));
    const image = await uploadImage(file);
    const { data, error } = await admin.from("archive_items").insert(rowPayload(payload, image)).select("*").single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ item: rowToArchiveItem(data as ArchiveRow) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed." }, { status: 500 });
  }
}


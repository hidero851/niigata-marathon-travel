import { supabaseAdmin, STORAGE_BUCKET, STORAGE_PUBLIC_BASE } from './supabaseAdmin';

export type ImageRole = 'hero' | `highlight-${number}` | `product-${number}`;
export type ProductImageRole = 'main' | 'card' | `gallery-${number}`;

export async function uploadEventImage(
  eventId: string,
  role: ImageRole,
  file: File,
): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const path = `${eventId}/${role}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) throw new Error(`画像アップロード失敗: ${error.message}`);

  return `${STORAGE_PUBLIC_BASE}/${path}?t=${Date.now()}`;
}

export async function uploadProductImage(
  productId: string,
  role: ProductImageRole,
  file: File,
): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const path = `products/${productId}/${role}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) throw new Error(`画像アップロード失敗: ${error.message}`);

  return `${STORAGE_PUBLIC_BASE}/${path}?t=${Date.now()}`;
}

export async function deleteEventImage(eventId: string, role: ImageRole): Promise<void> {
  const files = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .list(eventId);
  const target = files.data?.find((f) => f.name.startsWith(role));
  if (target) {
    await supabaseAdmin.storage.from(STORAGE_BUCKET).remove([`${eventId}/${target.name}`]);
  }
}

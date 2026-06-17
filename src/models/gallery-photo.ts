export const GALLERY_THUMBNAIL_SIZE = 220;
export const GALLERY_PREVIEW_SIZE = 1600;
export const GALLERY_GRID_GAP = 16;

export type GalleryPhoto = {
  id: string;
  url: string;
  previewUrl: string;
};

export function toGalleryPhoto(publicId: string, secureUrl: string): GalleryPhoto {
  const thumbnailUrl = secureUrl.replace(
    '/upload/',
    `/upload/c_fill,g_auto,h_${GALLERY_THUMBNAIL_SIZE},w_${GALLERY_THUMBNAIL_SIZE}/f_auto/q_auto/`,
  );
  const previewUrl = secureUrl.replace(
    '/upload/',
    `/upload/c_limit,w_${GALLERY_PREVIEW_SIZE},h_${GALLERY_PREVIEW_SIZE}/f_auto/q_auto/`,
  );

  return {
    id: publicId,
    url: thumbnailUrl,
    previewUrl,
  };
}

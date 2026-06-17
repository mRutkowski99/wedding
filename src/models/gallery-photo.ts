export type GalleryPhoto = {
  id: string;
  url: string;
  previewUrl: string;
};

export function toGalleryPhoto(publicId: string, secureUrl: string): GalleryPhoto {
  const thumbnailUrl = secureUrl.replace(
    '/upload/',
    '/upload/c_fill,g_auto,h_220,w_220/f_auto/q_auto/',
  );
  const previewUrl = secureUrl.replace(
    '/upload/',
    '/upload/c_limit,w_1600,h_1600/f_auto/q_auto/',
  );

  return {
    id: publicId,
    url: thumbnailUrl,
    previewUrl,
  };
}

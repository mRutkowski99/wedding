import { VercelRequest, VercelResponse } from '@vercel/node';
import { v2 as cloudinary } from 'cloudinary';

const GALLERY_THUMBNAIL_SIZE = 220;
const GALLERY_PREVIEW_SIZE = 1600;

function toGalleryPhoto(publicId: string, secureUrl: string) {
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

cloudinary.config({
  cloud_name: process.env.CLAUDINARY_NAME,
  api_key: process.env.CLAUDINARY_API_KEY,
  api_secret: process.env.CLAUDINARY_API_SECRET,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const response = await cloudinary.search
      .expression('folder:wedding')
      .sort_by('created_at', 'desc')
      .execute();

    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=86400');

    const photos = response.resources.map((resource: { public_id: string; secure_url: string }) =>
      toGalleryPhoto(resource.public_id, resource.secure_url),
    );

    return res.status(200).json(photos);
  } catch (error) {
    console.error('Error getting photos:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

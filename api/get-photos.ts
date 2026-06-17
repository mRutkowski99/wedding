import { VercelRequest, VercelResponse } from '@vercel/node';
import { v2 as cloudinary } from 'cloudinary';

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

    const photos = response.resources.map((resource: any) => {
      // Create an optimized thumbnail URL
      // secure_url format: https://res.cloudinary.com/<cloud_name>/image/upload/v<version>/<public_id>.<ext>
      const url = resource.secure_url;
      const optimizedUrl = url.replace(
        '/upload/',
        '/upload/c_fill,g_auto,h_220,w_220/f_auto/q_auto/'
      );
      
      return {
        id: resource.public_id,
        url: optimizedUrl
      };
    });

    return res.status(200).json(photos);
  } catch (error) {
    console.error('Error getting photos:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

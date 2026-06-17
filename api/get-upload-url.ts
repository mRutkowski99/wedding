import type { VercelRequest, VercelResponse } from '@vercel/node';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLAUDINARY_NAME,
  api_key: process.env.CLAUDINARY_API_KEY,
  api_secret: process.env.CLAUDINARY_API_SECRET,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const paramsToSign = {
      timestamp,
      folder: 'wedding',
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLAUDINARY_API_SECRET!
    );

    return res.status(200).json({
      signature,
      timestamp,
      cloudName: process.env.CLAUDINARY_NAME,
      apiKey: process.env.CLAUDINARY_API_KEY,
      folder: 'wedding',
    });
  } catch (error) {
    console.error('Error creating upload signature:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

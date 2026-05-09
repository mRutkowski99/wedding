import { VercelRequest, VercelResponse } from '@vercel/node';
import { getAccessToken } from './_get-access-token.js';
import { google } from 'googleapis';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const token = await getAccessToken();

    const response = await google.drive('v3').files.list(
      {
        q: `'${process.env.GOOGLE_DRIVE_FOLDER_ID}' in parents and mimeType contains 'image/'`,
        fields: 'files(id)',
      },
      { params: { trashed: false }, headers: { Authorization: `Bearer ${token}` } },
    );

    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=86400');

    return res.status(200).json(response.data.files);
  } catch (error) {
    console.error('Error getting photos:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

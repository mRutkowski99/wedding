import { google } from 'googleapis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const tokenResponse = await oauth2Client.getAccessToken();
    const token = tokenResponse.token;

    if (!token) throw new Error('Could not generate access token');

    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    if (!folderId) {
      return res.status(500).json({ error: 'Missing Google Drive Folder ID' });
    }

    const filename = req.body?.filename || 'uploaded-file';

    const response = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Upload-Content-Type': 'image/jpeg',
        },
        body: JSON.stringify({
          name: filename,
          parents: [folderId],
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res
        .status(response.status)
        .json({ error: 'Failed to create upload session', details: errorText });
    }

    // Google returns a unique Session URI in the 'Location' header
    const uploadUrl = response.headers.get('location');
    if (!uploadUrl) {
      return res.status(500).json({ error: 'Missing location header in Google Drive response' });
    }

    return res.status(200).json({ uploadUrl });
  } catch (error) {
    console.error('Error creating upload URL:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

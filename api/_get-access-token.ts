import { google } from 'googleapis';

export async function getAccessToken(): Promise<string> {
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

  return token;
}

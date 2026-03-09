import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return new Response("Missing auth code", { status: 400 });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);

    // Return tokens — user pastes GOOGLE_REFRESH_TOKEN into Vercel env vars
    return new Response(
      `<html><body style="font-family:monospace;padding:40px;background:#0f0f0f;color:#e0e0e0">
        <h2 style="color:#EA7155">Gmail Connected!</h2>
        <p>Copy this value and add it to your Vercel environment variables as <strong>GOOGLE_REFRESH_TOKEN</strong>:</p>
        <textarea rows="4" style="width:100%;background:#1a1a1a;color:#EA7155;border:1px solid #333;padding:12px;font-size:13px;border-radius:8px">${tokens.refresh_token || "(no refresh token — re-authorize with prompt=consent)"}</textarea>
        <p style="margin-top:20px;color:#888">After adding the env var in Vercel, redeploy and Gmail will be live.</p>
      </body></html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  } catch (err) {
    return new Response(`Auth error: ${err.message}`, { status: 500 });
  }
}

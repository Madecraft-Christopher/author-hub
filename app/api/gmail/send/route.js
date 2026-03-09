import { google } from "googleapis";

function makeOAuth2Client() {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return client;
}

function encodeEmail({ to, subject, body, from }) {
  const message = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/plain; charset=utf-8`,
    ``,
    body,
  ].join("\n");

  return Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function POST(request) {
  if (!process.env.GOOGLE_REFRESH_TOKEN) {
    return Response.json({ error: "Gmail not connected" }, { status: 503 });
  }

  try {
    const { to, subject, body } = await request.json();
    if (!to || !body) {
      return Response.json({ error: "Missing to or body" }, { status: 400 });
    }

    const auth = makeOAuth2Client();
    const gmail = google.gmail({ version: "v1", auth });

    const from = process.env.GMAIL_SENDER || "christopher@onlymadecraft.com";

    const raw = encodeEmail({ to, subject: subject || "(no subject)", body, from });

    const result = await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw },
    });

    return Response.json({ success: true, messageId: result.data.id });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

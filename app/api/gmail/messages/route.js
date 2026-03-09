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

function decodeBase64(str) {
  return Buffer.from(str.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8");
}

function getBody(payload) {
  if (payload.body?.data) return decodeBase64(payload.body.data);
  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === "text/plain" && part.body?.data) {
        return decodeBase64(part.body.data);
      }
    }
    for (const part of payload.parts) {
      const nested = getBody(part);
      if (nested) return nested;
    }
  }
  return "";
}

export async function GET(request) {
  if (!process.env.GOOGLE_REFRESH_TOKEN) {
    return Response.json({ error: "Gmail not connected", messages: [] }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  if (!email) return Response.json({ error: "Missing email param" }, { status: 400 });

  try {
    const auth = makeOAuth2Client();
    const gmail = google.gmail({ version: "v1", auth });

    // Fetch threads involving this email address
    const listRes = await gmail.users.threads.list({
      userId: "me",
      q: email,
      maxResults: 30,
    });

    const threads = listRes.data.threads || [];
    const messages = [];

    for (const thread of threads.slice(0, 10)) {
      const threadRes = await gmail.users.threads.get({
        userId: "me",
        id: thread.id,
        format: "full",
      });

      for (const msg of threadRes.data.messages || []) {
        const headers = msg.payload?.headers || [];
        const subject = headers.find((h) => h.name === "Subject")?.value || "";
        const from    = headers.find((h) => h.name === "From")?.value || "";
        const date    = headers.find((h) => h.name === "Date")?.value || "";
        const body    = getBody(msg.payload);

        const isOutbound = from.toLowerCase().includes("onlymadecraft.com") ||
                           from.toLowerCase().includes(process.env.GMAIL_SENDER || "");

        messages.push({
          id: msg.id,
          threadId: msg.threadId,
          channel: "email",
          direction: isOutbound ? "outbound" : "inbound",
          subject,
          from,
          body: body.trim().slice(0, 2000),
          timestamp: new Date(date).toISOString(),
          status: isOutbound ? "sent" : "received",
        });
      }
    }

    messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    return Response.json({ messages });
  } catch (err) {
    return Response.json({ error: err.message, messages: [] }, { status: 500 });
  }
}

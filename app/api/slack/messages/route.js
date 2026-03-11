import { WebClient } from "@slack/web-api";

export async function GET(request) {
  if (!process.env.SLACK_BOT_TOKEN) {
    return Response.json({ error: "Slack not connected", messages: [] }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name")?.toLowerCase();
  const courseId = searchParams.get("courseId")?.toLowerCase();

  if (!name && !courseId) {
    return Response.json({ error: "Missing name or courseId", messages: [] }, { status: 400 });
  }

  const channelId = searchParams.get("channelId") || process.env.SLACK_REVIEW_CHANNEL || "C09KA41EN3C";

  try {
    const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

    const result = await slack.conversations.history({
      channel: channelId,
      limit: 200,
    });

    const filtered = (result.messages || []).filter((msg) => {
      const text = msg.text?.toLowerCase() || "";
      return (name && text.includes(name)) || (courseId && text.includes(courseId));
    });

    const messages = filtered.map((msg) => ({
      id: msg.ts,
      text: msg.text,
      timestamp: new Date(parseFloat(msg.ts) * 1000).toISOString(),
      channel: "slack",
      source: "#agc-rehearsal-review",
    }));

    return Response.json({ messages });
  } catch (err) {
    return Response.json({ error: err.message, messages: [] }, { status: 500 });
  }
}

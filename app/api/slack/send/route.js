import { WebClient } from "@slack/web-api";

export async function POST(request) {
  if (!process.env.SLACK_BOT_TOKEN) {
    return Response.json({ error: "Slack not connected" }, { status: 503 });
  }

  try {
    const { channel, text, authorName, courseTitle } = await request.json();
    if (!text) {
      return Response.json({ error: "Missing text" }, { status: 400 });
    }

    const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

    const targetChannel = channel || process.env.SLACK_DEFAULT_CHANNEL || "#general";

    const result = await slack.chat.postMessage({
      channel: targetChannel,
      text,
      blocks: [
        {
          type: "section",
          text: { type: "mrkdwn", text },
        },
        ...(authorName || courseTitle
          ? [{
              type: "context",
              elements: [
                {
                  type: "mrkdwn",
                  text: [
                    authorName && `*Author:* ${authorName}`,
                    courseTitle && `*Course:* ${courseTitle}`,
                  ].filter(Boolean).join("  ·  "),
                },
              ],
            }]
          : []),
      ],
    });

    return Response.json({ success: true, ts: result.ts });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

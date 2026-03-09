export async function GET() {
  return Response.json({
    gmail: !!process.env.GOOGLE_REFRESH_TOKEN,
    slack: !!process.env.SLACK_BOT_TOKEN,
    gmailSender: process.env.GMAIL_SENDER || null,
  });
}

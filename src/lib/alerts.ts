// WhatsApp alerts through Meta's WhatsApp Cloud API.
// Stays in test mode (logged, not sent) until WHATSAPP_ALERTS_LIVE=true and the secrets below are set:
//   WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_TEMPLATE_NAME (optional WHATSAPP_TEMPLATE_LANG, default "en").
// The template body takes 4 variables: {{1}} customer, {{2}} items, {{3}} total, {{4}} link to the order.

export type AlertParams = { customer: string; items: string; total: string; link: string };

export async function sendOrderAlert(to: string, p: AlertParams): Promise<"sent" | "test" | "failed"> {
  const live = process.env.WHATSAPP_ALERTS_LIVE === "true";
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const template = process.env.WHATSAPP_TEMPLATE_NAME;

  if (!live || !token || !phoneId || !template) {
    console.log(`[alert:test] would send to ${to}: ${p.customer} | ${p.items} | ${p.total} | ${p.link}`);
    return "test";
  }

  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: template,
          language: { code: process.env.WHATSAPP_TEMPLATE_LANG || "en" },
          components: [
            {
              type: "body",
              parameters: [p.customer, p.items, p.total, p.link].map((text) => ({ type: "text", text })),
            },
          ],
        },
      }),
    });
    if (!res.ok) console.error(`[alert] WhatsApp API ${res.status} for ${to}`);
    return res.ok ? "sent" : "failed";
  } catch {
    return "failed";
  }
}

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

export async function sendRaaSNotification(
  to: string,
  subject: string,
  html: string
) {
  try {
    await resend.emails.send({
      from: "Lumina RaaS <noreply@lumina.app>",
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error("[RaaS Notification Error]", error);
    return { success: false, error };
  }
}

export function outcomeDeliveredEmail(title: string, dashboardUrl: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #09090b; color: #fafafa; padding: 40px; border-radius: 16px;">
      <h1 style="color: #8B5CF6;">Your RaaS Outcome is Delivered ✅</h1>
      <p style="font-size: 18px;"><strong>${title}</strong> has been verified and is now live.</p>
      <p style="color: #a1a1aa;">You will be charged only upon confirmation. View your result in the dashboard.</p>
      <a href="${dashboardUrl}" style="display: inline-block; margin-top: 20px; padding: 12px 32px; background: #8B5CF6; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">View Outcome</a>
      <p style="margin-top: 40px; color: #71717a; font-size: 12px;">Lumina RaaS – Pay only for delivered results.</p>
    </div>
  `;
}

export function paymentConfirmedEmail(title: string, amountAud: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #09090b; color: #fafafa; padding: 40px; border-radius: 16px;">
      <h1 style="color: #10B981;">Payment Confirmed 💰</h1>
      <p style="font-size: 18px;">Thank you for confirming <strong>${title}</strong>.</p>
      <p style="color: #a1a1aa;">Amount: <strong>$${amountAud} AUD</strong></p>
      <p style="margin-top: 40px; color: #71717a; font-size: 12px;">Lumina RaaS – Results-as-a-Service.</p>
    </div>
  `;
}

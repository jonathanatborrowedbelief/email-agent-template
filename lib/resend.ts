import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY!);

// Helper: send an email with your business branding
export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  return resend.emails.send({
    from: `${process.env.BUSINESS_NAME} <hello@${process.env.DOMAIN}>`,
    to,
    subject,
    text,
  });
}

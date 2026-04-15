import { Resend } from "resend";

// Lazy-initialized so the build doesn't crash when env vars aren't set
let _resend: Resend | null = null;

function getResend() {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY!);
  }
  return _resend;
}

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
  return getResend().emails.send({
    from: `${process.env.BUSINESS_NAME} <hello@${process.env.DOMAIN}>`,
    to,
    subject,
    text,
  });
}

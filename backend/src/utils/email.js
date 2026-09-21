/**
 * Email utility — deliberately tolerant.
 *
 * - If SMTP_HOST/SMTP_USER are configured → sends via nodemailer (dynamic import;
 *   the dependency is optional so local dev works without it).
 * - Otherwise → logs the email to the console in non-production and reports
 *   `delivered: false` instead of throwing, so flows like forgot-password never
 *   fail because a mail server is missing.
 */

export const sendEmail = async ({ to, subject, text }) => {
  const configured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);

  if (!configured) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`📧 [mail suppressed — SMTP not configured]\nTo: ${to}\nSubject: ${subject}\n---\n${text}`);
    }
    return { delivered: false, reason: "SMTP not configured" };
  }

  try {
    // CJS/ESM interop: nodemailer v6 exports via module.exports — dynamic
    // import may wrap it under `.default` depending on the Node version.
    const mod = await import("nodemailer");
    const nodemailer = mod.default ?? mod;
    const port = Number(process.env.SMTP_PORT || 587);
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
    });
    return { delivered: true };
  } catch (error) {
    console.error("📧 Email send failed:", error.message);
    return { delivered: false, reason: error.message };
  }
};

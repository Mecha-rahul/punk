/**
 * Email utility — deliberately tolerant.
 *
 * - If SMTP_HOST/SMTP_USER are configured → sends via nodemailer (dynamic import;
 *   the dependency is optional so local dev works without it).
 * - Otherwise → logs the email to the console in non-production and reports
 *   `delivered: false` instead of throwing, so flows like forgot-password never
 *   fail because a mail server is missing.
 */

export const sendEmail = async ({ to, subject, text, html }) => {
  const configured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);

  if (!configured) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`📧 [mail suppressed — SMTP not configured]\nTo: ${to}\nSubject: ${subject}\n---\n${text}`);
    }
    return { delivered: false, reason: "SMTP not configured" };
  }

  try {
    // nodemailer is CJS — dynamic import yields { default: { createTransport } }.
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
      // Hard caps so a bad host/port/firewall can NEVER hang a request —
      // every phase of the SMTP conversation must answer within seconds.
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    });

    console.log(
      `📧 SMTP → ${process.env.SMTP_HOST}:${port} (secure=${port === 465}) as ${process.env.SMTP_USER}`
    );

    // verify() fails fast with a clear auth/connection error instead of a
    // timeout deep inside sendMail.
    await transporter.verify();

    // Send in the background with a cap — the HTTP response must never wait
    // on the mail server. Callers get `delivered: false, reason: 'sending'
    // continues in background' immediately; the send result lands in logs.
    const sendPromise = transporter
      .sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject,
        text,
        ...(html ? { html } : {}),
      })
      .then(() => {
        console.log(`📧 Email sent to ${to}`);
        return true;
      })
      .catch((err) => {
        console.error("📧 Email send failed:", err.message);
        return false;
      });

    // Race against a short cap so the endpoint answers quickly either way.
    const ok = await Promise.race([
      sendPromise,
      new Promise((resolve) => setTimeout(() => resolve("timeout"), 5000)),
    ]);

    if (ok === "timeout") {
      return { delivered: false, reason: "SMTP send still in progress (backgrounded)" };
    }
    return ok ? { delivered: true } : { delivered: false, reason: "send failed — see logs" };
  } catch (error) {
    console.error("📧 Email send failed:", error.message);
    return { delivered: false, reason: error.message };
  }
};

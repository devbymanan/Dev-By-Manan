import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    const errors: Record<string, string> = {};
    if (!name || !name.trim()) errors.name = "Name is required";
    if (!email || !email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email format";
    }
    if (!message || !message.trim()) errors.message = "Message is required";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: "Validation failed", fields: errors },
        { status: 400 }
      );
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanMessage = message.trim();

    let emailSent = false;
    const smtpUser = process.env.SMTP_USERNAME;
    const smtpPass = process.env.SMTP_PASSWORD;
    const toEmail = process.env.CONTACT_RECEIVING_EMAIL || smtpUser;

    if (smtpUser && smtpPass && toEmail) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        await transporter.sendMail({
          from: `"Portfolio Contact Form" <${smtpUser}>`,
          to: toEmail,
          replyTo: cleanEmail,
          subject: `New message from ${cleanName} (Dev by Manan)`,
          text: `Name: ${cleanName}\nEmail: ${cleanEmail}\n\nMessage:\n${cleanMessage}`,
        });
        emailSent = true;
      } catch (mailErr) {
        console.error("Error sending contact email:", mailErr);
      }
    }

    const sql = getDb();
    await sql`
      INSERT INTO contact_submissions (name, email, message, submitted_at, email_sent)
      VALUES (${cleanName}, ${cleanEmail}, ${cleanMessage}, NOW(), ${emailSent})
    `;

    return NextResponse.json(
      {
        message: "Thanks for reaching out — I'll get back to you soon.",
        email_sent: emailSent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Submit contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

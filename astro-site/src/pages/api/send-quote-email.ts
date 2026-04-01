import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { fullName, email, phone, licenses } = await request.json();

    // Get the Resend API key from environment variables
    const resendApiKey = import.meta.env.RESEND_API_KEY;

    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const resend = new Resend(resendApiKey);

    // Send the email
    const data = await resend.emails.send({
      from: 'Verso AI <onboarding@resend.dev>', // You'll need to update this with your verified domain
      to: 'adrienurlacher@gmail.com',
      subject: 'Quote request',
      text: `User ${fullName} at address ${email} is requesting a quote for ${licenses} licenses, contact is ${phone}`,
    });

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send email' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

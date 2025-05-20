console.log("Sending email with:", JSON.stringify(emailData, null, 2));
const fetch = require('node-fetch');

const resultText = await response.text();
console.log("EmailJS raw response:", resultText);

if (!response.ok) {
    throw new Error(`EmailJS error: ${resultText}`);
}

exports.handler = async (event, context) => {
    const { message, replyTo, recipientEmail, senderName } = JSON.parse(event.body);

    if (!recipientEmail || !message || !replyTo) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing fields' })
        };
    }

    const emailData = {
        service_id: 'service_8h83s6e',
        template_id: 'template_en7x1hn',
        user_id: 'OLt1o_HF11HpHz3bV',
        template_params: {
            message,
            replyTo,
            recipientEmail,
            senderName
        }
    };

    try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emailData)
        });

        if (!response.ok) throw new Error('Failed to send email');

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Message sent!' })
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};

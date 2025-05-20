const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    try {
        const { message, replyTo, recipientEmail, senderName } = JSON.parse(event.body);

        const emailData = {
            service_id: 'service_8h83s6e',
            template_id: 'template_en7x1hn',
            user_id: 'UDBflDbZy-LEUfAxT',
            template_params: {
                message,
                replyTo,
                recipientEmail,
                senderName
            }
        };

        console.log("Sending email with:", JSON.stringify(emailData, null, 2));

        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emailData)
        });

        const resultText = await response.text();
        console.log("EmailJS raw response:", resultText);

        if (!response.ok) {
            throw new Error(`EmailJS error: ${resultText}`);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Message sent!' })
        };
    } catch (err) {
        console.error("Function Error:", err.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};

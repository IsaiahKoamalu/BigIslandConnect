const fetch = require('node-fetch');

exports.handler = async (event) => {
    try {
        const { message, replyTo, recipientEmail, senderName } = JSON.parse(event.body);

        const emailPayload = {
            personalizations: [
                {
                    to: [{ email: recipientEmail }],
                    subject: `New message from ${senderName} via Skill Exchange`
                }
            ],
            from: {
                email: 'youremail@gmail.com', // ✅ must match your verified sender
                name: 'Skill Exchange Bot'
            },
            reply_to: {
                email: replyTo
            },
            content: [
                {
                    type: 'text/plain',
                    value: `You’ve received a new message:\n\n"${message}"\n\nReply to: ${replyTo}`
                }
            ]
        };

        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailPayload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("SendGrid error:", errorText);
            throw new Error(`SendGrid response not OK: ${response.status}`);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Email sent successfully!' })
        };
    } catch (err) {
        console.error("Function Error:", err.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};


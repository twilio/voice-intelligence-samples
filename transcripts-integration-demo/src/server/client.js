const fetch = require('node-fetch');

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioEncodedCreds = Buffer.from(`${twilioAccountSid}:${twilioAuthToken}`).toString('base64');

module.exports = {
    getTranscriptsToken: async (viewLink) => {
        const rsp = await fetch(
            'https://ai.twilio.com/v1/Tokens',
            {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${twilioEncodedCreds}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        grants: [{
                            product: 'intelligence-discovery',
                            metadata: {
                                viewLinks: {
                                    conversationViewLink: {
                                        target: "_top",
                                        href: viewLink
                                    }
                                }
                            }
                        }]
                    }
                )
            }
        );

        if (rsp.ok) {
            const { token } = await rsp.json();
            return token;
        } else {
            throw new Error('failed to generate token');
        }
    },
    getTranscriptViewerToken: async (serviceSid, transcriptSid) => {
        const rsp = await fetch(
            'https://ai.twilio.com/v1/Tokens',
            {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${twilioEncodedCreds}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        grants: [{
                            product: 'annotator',
                            service_sid: serviceSid,
                            transcript_sid: transcriptSid,
                            metadata: {}
                        }]
                    }
                )
            }
        );

        if (rsp.ok) {
            const { token } = await rsp.json();
            return token;
        } else {
            throw new Error('failed to generate token');
        }
    }
};

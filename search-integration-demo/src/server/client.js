const fetch = require('node-fetch');

const eipServiceSid = process.env.TWILIO_EIP_SERVICE_SID;
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioEncodedCreds = Buffer.from(`${twilioAccountSid}:${twilioAuthToken}`).toString('base64');

module.exports = {
    getSearchToken: async (userId, serviceSid) => {
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
                            product: 'search',
                            service_sid: serviceSid || eipServiceSid,
                            metadata: {
                                userId
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
    getAnnotatorToken: async (userId, transcriptSid) => {
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
                            service_sid: eipServiceSid,
                            transcript_sid: transcriptSid,
                            metadata: {
                                userId
                            },
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
    getServices: async () => {
        const rsp = await fetch(
            'https://ai.twilio.com/v1/Services',
            {
                method: 'GET',
                headers: {
                    Authorization: `Basic ${twilioEncodedCreds}`,
                    'Content-Type': 'application/json'
                },
            }
        )
        if (rsp.ok) {
            const {services} = await rsp.json();
            return services;
        } else {
            throw new Error('failed to retrieve services');
        }
    }
};
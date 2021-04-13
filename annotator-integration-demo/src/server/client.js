const fetch = require('node-fetch');

const eipServiceSid = process.env.TWILIO_EIP_SERVICE_SID;
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioEncodedCreds = Buffer.from(`${twilioAccountSid}:${twilioAuthToken}`).toString('base64');

module.exports = {
    getToken: async (transcriptSid, userId, isDownloadButtonVisible) => {
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
                                userId,
                                isDownloadButtonVisible
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

    getRecordings: async () => {
        const rsp = await fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Recordings.json`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Basic ${twilioEncodedCreds}`,
                },
            }
        )

        if (rsp.ok) {
            const { recordings } = await rsp.json();
            return recordings;
        } else {
            throw new Error('failed to fetch recordings');
        } 
    },

    getTranscriptForCallSid: async callSid => {
        const rsp = await fetch(
            `https://ai.twilio.com/v1/Services/${eipServiceSid}/Transcripts?CallSid=${callSid}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Basic ${twilioEncodedCreds}`,
                },
            }
        )

        if (rsp.ok) {
            const { transcripts } = await rsp.json();
            return transcripts.find(t => t.call_sid === callSid);
        } else {
            throw new Error('failed to fetch transcripts');
        } 
    },
};
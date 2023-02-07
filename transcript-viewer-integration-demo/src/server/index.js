require('dotenv').config();

const express = require('express');
const client = require('./client');

const app = express();

const transcriptViewerAssetUrl = process.env.TRANSCRIPT_VIEWER_ASSET_URL;

app.set('view engine', 'ejs');
app.use(express.static('public'));

/**
 * Renders a list of recordings. When a
 * call sid is passed via a `view` query param it
 * will rerender the page with the transcript viewer embedded
 * via iframe with the transcript passed.
 */
app.get('/transcript-viewer/embedded', async (req, res) => {
    const recordings = await client.getRecordings();

    let templateVars = { recordings };

    if (req.query.view) {
        const callSid = req.query.view;
        const transcript = await client.getTranscriptForCallSid(callSid);

        if (transcript.status === 'completed') {
            const token = await client.getToken(transcript.sid, true);
            const iframeUrl = `${transcriptViewerAssetUrl}?token=${token}`;

            templateVars.iframeUrl = iframeUrl;
            templateVars.activeTranscript = transcript.sid;
        } else {
            templateVars.errorMessage = 'That transcription isn\'t ready yet. Try again later';
            return res.render('transcript-viewer-embedded', templateVars);
        }
    }

    // See `/views/transcript-viewer-embedded.ejs` for template
    res.render('transcript-viewer-embedded', templateVars);
});

/**
 * Renders a list of recordings. When a
 * recording's call sid is passed via a `view` query param it
 * will redirect to the standalone version of the transcript viewer
 * with the transcript.
 */
app.get('/transcript-viewer/standalone', async (req, res) => {
    const recordings = await client.getRecordings();

    let templateVars = { recordings };

    if (req.query.view) {
        const callSid = req.query.view;
        const transcript = await client.getTranscriptForCallSid(callSid);

        if (transcript.status === 'completed') {
            const token = await client.getToken(transcript.sid, true);
            const url = `${transcriptViewerAssetUrl}?token=${token}`;
            return res.redirect(url);
        } else {
            templateVars.errorMessage = 'That transcription isn\'t ready yet. Try again later';
            return res.render('transcript-viewer-standalone', templateVars);
        }
    }

    // See `/views/transcript-viewer-standalone.ejs` for template
    res.render('transcript-viewer-standalone', templateVars);
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));

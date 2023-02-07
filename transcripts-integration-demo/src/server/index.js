require('dotenv').config();

const express = require('express');
const client = require('./client');

const app = express();

const transcriptViewerAssetUrl = process.env.TRANSCRIPT_VIEWER_ASSET_URL;
const transcriptViewerEmbeddedUrl = process.env.TRANSCRIPT_VIEWER_EMBEDDED_URL;
const transcriptsAssetUrl = process.env.TRANSCRIPTS_ASSET_URL;

app.set('view engine', 'ejs');
app.use(express.static('public'));

/**
 * Renders the transcripts embedded via iframe.
 */
app.get('/transcripts/embedded', async (req, res) => {
    const viewLink = encodeURIComponent(`${transcriptViewerEmbeddedUrl}?serviceSid=:serviceSid&transcriptSid=:transcriptSid`);
    const token = await client.getTranscriptsToken(viewLink);
    let iframeUrl = `${transcriptsAssetUrl}?token=${token}`;

    const templateVars= { iframeUrl };
    // See `/views/transcripts-embedded.ejs` for template
    res.render('transcripts-embedded', templateVars);
});

/**
 * Redirecting to the standalone version of transcripts.
 */
app.get('/transcripts/standalone', async (req, res) => {
    const viewLink = encodeURIComponent(`${transcriptViewerEmbeddedUrl}?serviceSid=:serviceSid&transcriptSid=:transcriptSid`);
    const token = await client.getTranscriptsToken(viewLink);
    let url = `${transcriptsAssetUrl}?token=${token}`;
    return res.redirect(url);
});

/**
 * Redirecting to the standalone version of transcript viewer
 */
app.get('/transcript-viewer/standalone', async (req, res) => {
    const serviceSid = req.query.serviceSid;
    const transcriptSid = req.query.transcriptSid;
    if (serviceSid && transcriptSid) {
        const token = await client.getTranscriptViewerToken(serviceSid, transcriptSid);
        const url = `${transcriptViewerAssetUrl}?token=${token}`;
        return res.redirect(url);
    }

    // See `/views/transcript-viewer-error.ejs` for template
    res.render('transcript-viewer-error');
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));

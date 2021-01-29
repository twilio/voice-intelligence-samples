require('dotenv').config();

const express = require('express');
const auth = require('./auth');
const client = require('./client');
const db = require('./db');

const app = express();

const annotatorAssetUrl = process.env.ANNOTATOR_ASSET_URL;

app.set('view engine', 'ejs');
app.use(express.static('public'));

/**
 * Renders a list of recordings to be annotated. When a
 * call sid is passed via a `view` query param it 
 * will rerender the page with the annotator embedded
 * via iframe with the transcript passed.
 */
app.get('/annotator/embedded', async (req, res) => {
    const { userId } = await auth.authenticate(req);
    const allRecordings = await client.getRecordings();
    const recordings = allRecordings.filter(r => !db.isInProgress(r.call_sid));

    let templateVars = { recordings };

    if (req.query.view) {
        const callSid = req.query.view;
        const transcript = await client.getTranscriptForCallSid(callSid);

        if (transcript.status === 'completed') {
            db.markInProgress(transcript.call_sid);

            const token = await client.getToken(transcript.sid, userId);
            const iframeUrl = `${annotatorAssetUrl}?token=${token}`;

            templateVars.iframeUrl = iframeUrl;
            templateVars.activeTranscript = transcript.sid;
        } else {
            templateVars.errorMessage = 'That transcription isn\'t ready yet. Try again later';
            return res.render('annotator-embedded', templateVars);
        }
    }

    // See `/views/annotator-embedded.ejs` for template
    res.render('annotator-embedded', templateVars);
});

/**
 * Renders a list of recordings to be annotated. When a
 * recording's call sid is passed via a `view` query param it 
 * will redirect to the standalone version of the annotator
 * with the transcript for annoation.
 */
app.get('/annotator/standalone', async (req, res) => {
    const { userId } = await auth.authenticate(req);
    const allRecordings = await client.getRecordings();
    const recordings = allRecordings.filter(r => !db.isInProgress(r.call_sid));

    let templateVars = { recordings };

    if (req.query.view) {
        const callSid = req.query.view;
        const transcript = await client.getTranscriptForCallSid(callSid);

        if (transcript.status === 'completed') {
            db.markInProgress(callSid);

            const token = await client.getToken(transcript.sid, userId);
            const url = `${annotatorAssetUrl}?token=${token}`;
            return res.redirect(url);
        } else {
            templateVars.errorMessage = 'That transcription isn\'t ready yet. Try again later';
            return res.render('annotator-standalone', templateVars);
        }
    }

    // See `/views/annotator-standalone.ejs` for template
    res.render('annotator-standalone', templateVars);
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));

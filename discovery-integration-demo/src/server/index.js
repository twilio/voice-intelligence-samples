require('dotenv').config();

const express = require('express');
const auth = require('./auth');
const client = require('./client');

const app = express();

const annotatorAssetUrl = process.env.ANNOTATOR_ASSET_URL;
const annotatorEmbbededUrl = process.env.ANNOTATOR_EMBBEDED_URL;
const discoveryAssetUrl = process.env.DISCOVERY_ASSET_URL;

app.set('view engine', 'ejs');
app.use(express.static('public'));

/**
 * Renders the discovery embedded via iframe.
 */
app.get('/discovery/embedded', async (req, res) => {
    await auth.authenticate(req);

    const viewLink = encodeURIComponent(`${annotatorEmbbededUrl}?serviceSid=:serviceSid&transcriptSid=:transcriptSid`);
    const token = await client.getDiscoveryToken(viewLink);
    let iframeUrl = `${discoveryAssetUrl}?token=${token}`;

    const templateVars= { iframeUrl };
    // See `/views/discovery-embedded.ejs` for template
    res.render('discovery-embedded', templateVars);
});

/**
 * Redirecting to the standalone version of discovery.
 */
app.get('/discovery/standalone', async (req, res) => {
    await auth.authenticate(req);

    const viewLink = encodeURIComponent(`${annotatorEmbbededUrl}?serviceSid=:serviceSid&transcriptSid=:transcriptSid`);
    const token = await client.getDiscoveryToken(viewLink);
    let url = `${discoveryAssetUrl}?token=${token}`;
    return res.redirect(url);
});

/**
 * Redirecting to the standalone version of annotator
 */
app.get('/annotator/standalone', async (req, res) => {
    const { userId } = await auth.authenticate(req);
    const serviceSid = req.query.serviceSid;
    const transcriptSid = req.query.transcriptSid;
    if (serviceSid && transcriptSid) {
        const token = await client.getAnnotatorToken(userId, serviceSid, transcriptSid);
        const url = `${annotatorAssetUrl}?token=${token}`;
        return res.redirect(url);
    }

    // See `/views/annotator-error.ejs` for template
    res.render('annotator-error');
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));

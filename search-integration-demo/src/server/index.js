require('dotenv').config();

const express = require('express');
const auth = require('./auth');
const client = require('./client');

const app = express();

const annotatorAssetUrl = process.env.ANNOTATOR_ASSET_URL;
const searchAssetUrl = process.env.SEARCH_ASSET_URL;
const annotatorEmbbededUrl = process.env.ANNOTATOR_EMBBEDED_URL;

app.set('view engine', 'ejs');
app.use(express.static('public'));

/**
 * Renders list of EIP services associated with that account.
 */
app.get('/services/standalone', async(_, res) => {
    const services = await client.getServices();
    // See `/views/services.ejs` for template
    return res.render('services.ejs', {services, type: 'standalone'});
});
app.get('/services/embedded', async(_, res) => {
    const services = await client.getServices();
    // See `/views/services.ejs` for template
    return res.render('services.ejs', {services, type: 'embedded'});
});

/**
 * Renders the search embedded via iframe.
 */
app.get('/search/embedded', async (req, res) => {
    const { userId } = await auth.authenticate(req);
    /** 
     * Retreive servicesSid from the url in case that it has been set, 
     * otherwise will fallback on the TWILIO_EIP_SERVICE_SID env variable
    */ 
    const serviceSid = req.query.serviceSid;
    const token = await client.getSearchToken(userId, serviceSid);
    const viewLink = encodeURIComponent(`${annotatorEmbbededUrl}?transcriptSid=:transcriptSid`);
    let iframeUrl = `${searchAssetUrl}?token=${token}&viewLink=${viewLink}`;

    if (req.query.search) {
        // Reflecting search query from URL
        iframeUrl += '&search='+encodeURIComponent(req.query.search);
    }

    const templateVars= { iframeUrl };
    // See `/views/search-embedded.ejs` for template
    res.render('search-embedded', templateVars);
});

/**
 * Redirecting to the standalone version of search.
 */
app.get('/search/standalone', async (req, res) => {
    const { userId } = await auth.authenticate(req);
    /** 
     * Retreive servicesSid from the url in case that it has been set, 
     * otherwise will fallback on the TWILIO_EIP_SERVICE_SID env variable
    */
    const serviceSid = req.query.serviceSid;
    const token = await client.getSearchToken(userId, serviceSid);
    const viewLink = encodeURIComponent(`${annotatorEmbbededUrl}?transcriptSid=:transcriptSid`);
    let url = `${searchAssetUrl}?token=${token}&viewLink=${viewLink}`;
    return res.redirect(url);
});

/**
 * Redirecting to the standalone version of annotator
 */
app.get('/annotator/standalone', async (req, res) => {
    const { userId } = await auth.authenticate(req);
    const transcriptSid = req.query.transcriptSid;
    if (transcriptSid) {
        const token = await client.getAnnotatorToken(userId, transcriptSid);
        const url = `${annotatorAssetUrl}?token=${token}`;
        return res.redirect(url);
    }

    // See `/views/annotator-error.ejs` for template
    res.render('annotator-error');
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));

// shortid : generates a random fixed length id of strings having random characters 
// so inspite of that domain urls, we can use nanoid's and maintain a mapping 

const shortid = require('shortid');
const URL = require('../models/url');

async function handleGenerateNewShortUrl(req, res) {
    const { url } = req.body;
    // console.log(req);
    if(!url) {
        return res.status(400).json({ error: 'url is required !' });
    }
    const shortId = shortid();
    await URL.create({
        shortid: shortId, 
        redirectURL: url,
        visitHistory: [],
        createdBy: req.user._id,
    })
    res.redirect('/');  
}

async function handleGetAnalytics(req, res){
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });
    return res.json({ totalClicks : result.visitHistory.length, analytics: result.visitHistory });
}

module.exports = {
    handleGenerateNewShortUrl, 
    handleGetAnalytics,
}
const express = require('express');
const axios = require('axios');

const app = express();
const port = 8008;

async function fetchNumbers(url) {
    try {
        const response = await axios.get(url, { timeout: 500 });
        return response.data.numbers || [];
    } catch (error) {
        return [];
    }
}

async function processUrls(urls) {
    const promises = urls.map(fetchNumbers);
    const results = await Promise.all(promises);
    const sortedUniqueNumbers = Array.from(new Set(results.flat())).sort((a, b) => a - b);
    return sortedUniqueNumbers;
}

app.get('/numbers', async(req, res) => {
    const urls = req.query.url;
    if (!urls || !Array.isArray(urls)) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    const numbers = await processUrls(urls);
    res.json({ numbers });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
const path = require('path');
const crypto = require('crypto');

const randomstring = require("randomstring");
const base64url = require("base64url");

const express = require('express');
const cons = require('consolidate');

const app = express();

app.use('/', express.static(path.join(__dirname, 'public')));

app.engine('html', cons.mustache);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());

app.get('/code_challenge', (_req, res) => {
    const code_verifier = randomstring.generate(128);
    const digest = crypto.createHash('sha256').update(code_verifier).digest('base64');
    res.json({ code_challenge: base64url.fromBase64(digest) });
});

app.get('/token', async (req, res) => {
    if (req.query.state !== 'sus') {
        res.end();
    } else {
        const code = req.query.code;
        res.render('token_tpl', {
            code: code
        });
    }
});

app.listen(3000, () => console.log('MAL app listening on port 3000!'));

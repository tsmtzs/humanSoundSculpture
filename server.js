const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello')
});

app.get('/conductor', (req, res) => {
    res.send('Conductor')
});

app.listen(3000, () => console.log('Server listening on port 3000'));

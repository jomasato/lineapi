const { Client } = require('@line/bot-sdk');
const client = new Client({
    channelAccessToken: '/ECp0fkZ8msmAJo19mbkMU2Lqo8o2TQ2BgjDnJa36o93vmWp9eDkHILywbL4NaFGULqCuuZtrCaaYpWaY1yTI/xyzY2X3A1YHNvLog/EYTH7epC1/c5uCJCr8tVKlfe4Kqdpx9dz0uJBYHAp6tH8CgdB04t89/1O/w1cDnyilFU=',
    channelSecret: '01887f7dd028d6d7d65bc418a44fcfd5'
});
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/webhook', (req, res) => {
    Promise.all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
});
const openai = require('openai');

// Set up the OpenAI API client
openai.apiKey = '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';

function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }

    // Get the user's message
    const userMessage = event.message.text;

    // Generate a response using the ChatGPT API
    return openai.Completion.create({
        engine: 'davinci',
        prompt: userMessage,
        maxTokens: 1024
    })
    .then((response) => {
        // Get the generated response text
        const responseText = response.choices[0].text.trim();

        // Send the response back to the user
        return client.replyMessage(event.replyToken, {
            type: 'text',
            text: responseText
        });
    })
    .catch((err) => {
        console.error(err);
        return Promise.resolve(null);
    });
}
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

const { Client,LocalAuth  } = require('whatsapp-web.js');
const { Configuration, OpenAIApi } =require( 'openai');;

const qrcode = require('qrcode-terminal');
// Load the session data if it has been previously saved
const fs = require('fs');
// Path where the session data will be stored
// const SESSION_FILE_PATH = './session.json';
// let sessionData;
// if(fs.existsSync(SESSION_FILE_PATH)) {
//     sessionData = require(SESSION_FILE_PATH);
// }
// const client = new Client({
    
//     puppeteer: {
// 		args: ['--no-sandbox'],
// 	},
//     authStrategy: new LegacySessionAuth({
//         session: sessionData,

//     })
    
// });
// const { Client, LocalAuth } = require("whatsapp-web.js");

console.log("Connection to Whatsapp Web Client");

const client = new Client({
  puppeteer: {
    executablePath: '/usr/bin/brave-browser-stable',
  },
  authStrategy: new LocalAuth({
    clientId: "client-one"
  }),
  puppeteer: {
    headless: false,
    args: ['--no-sandbox'],
  }

});

// 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




// const client = new Client();
client.on('qr', (qr) => {
    // console.log('QR RECEIVED', qr);
    qrcode.generate(qr, {small: true});
});

// //obtaining messages
// client.on('message', async message => {
//     console.log(message.body);
// 	if(message.body === 'hi') {
// 		message.reply('yes man');
// 	}
// });

client.on('ready', () => {
    console.log('Client is ready!');
});
client.initialize();
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

client.on('message', async (message) => {
    
try {
const response = await openai.createCompletion({
  model: "text-davinci-003",
  prompt: `${message.body}`,
  max_tokens: 2048,
  temperature: 0,
  "n": 1,
});

//const data = await response.json();
//response = response.json();
const d = response.data.choices[0].text;

client.sendMessage(message.from, d.trim() );

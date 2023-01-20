const { Client,LocalAuth  } = require('whatsapp-web.js');
const { Configuration, OpenAIApi } =require( 'openai');
const dotenv =require('dotenv')
const qrcode = require('qrcode-terminal');
dotenv.config(); 
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
  model: "text-davinci-002",
  prompt: `${message.body}`,
  max_tokens: 2048,
  temperature: 0.5,
  "n": 1,
});


const d = response.data.choices[0].text;

client.sendMessage(message.from, d.trim() );
}
catch(error){
  console.error(`error: ${error}`);
};
});

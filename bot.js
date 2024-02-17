//Librerías necesarias
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = '6519624868:AAG706F1__E1TKIUl7JEYztC8WOBki-YyMQ';
const bot = new TelegramBot(token, {polling: true});

//Mensaje que se activa al iniciar

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '¡Hola! Soy Chewie, tu bot de Star Wars. ¿Cómo puedo ayudarte hoy?');
});


//Solicitud HTTP a la API
function buscarEnSwapi(busqueda) {
    return axios.get(`https://www.swapi.tech/api/${busqueda}`)
        .then(response => response.data)
        .catch(error => console.log(error));
}

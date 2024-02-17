//Librerías necesarias
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = '6519624868:AAG706F1__E1TKIUl7JEYztC8WOBki-YyMQ';
const bot = new TelegramBot(token, {polling: true});

//Solicitud HTTP a la API
function buscarEnSwapi(categoria) {
    return axios.get(`https://www.swapi.tech/api/${categoria}`)
        .then(response => response.data)
        .catch(error => console.log(error));
}

//Logica para los eventos.
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const mensajeUsuario = msg.text.toLowerCase();

    // Si el mensaje del usuario es una categoría válida, buscar en esa categoría en SWAPI
    if (['people', 'films', 'starships', 'vehicles', 'species', 'planets'].includes(mensajeUsuario)) {
        buscarEnSwapi(mensajeUsuario)
            .then(data => {
                const resultados = data.results.map(resultado => resultado.name).join(', ');
                bot.sendMessage(chatId, `Resultados de ${mensajeUsuario}: ${resultados}`);
            });
    } else {
        bot.sendMessage(chatId, '¡Hola! Soy Chewie, tu bot de Star Wars. ¿Cómo puedo ayudarte hoy?');
    }
});

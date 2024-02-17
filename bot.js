const TelegramBot = require('node-telegram-bot-api');
const token = '6608384684:AAHPKeB3QTJMJ7bVfLwaHLxhKZs5Ku6FVUEI';
const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, '¡Hola! Soy NookBot, tu asistente de Animal Crossing.');
});

//Empieza la conexion con API

const axios = require('axios');

bot.onText(/\/bug (.+)/, async (msg, match) => { //bichos
    const bugName = match[1];
    try {
        const response = await axios.get(`https://acnhapi.com/v1/bugs/${bugName}`);
        const bugData = response.data;
        bot.sendMessage(msg.chat.id, `Nombre: ${bugData.name['name-USen']}\nPrecio: ${bugData.price}\nLugar: ${bugData.availability.location}`);
    } catch (error) {
        bot.sendMessage(msg.chat.id, 'Lo siento, no pude encontrar ese bicho.');
    }
});

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const token = '6608384684:AAHPKeB3QTJMJ7bVfLwaHLxhKZs5Ku6FVUEI';
const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, '¡Hola! Soy NookBot, tu asistente de Animal Crossing.');
});

//Empieza la conexion con API

const axios = require('axios');

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

bot.onText(/\/bug (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const bugName = match[1]; // Extrae el nombre del bicho del mensaje del usuario

    try {
    const response = await axios.get(`https://acnhapi.com/v1/bugs/${bugName}`);
    const bugData = response.data;

    if (bugData.success) {
        const bugInfo = bugData.bug;
        const reply = `Nombre: ${bugInfo.name['name-USen']}
                    Precio: ${bugInfo.price}
                    Lugar: ${bugInfo.availability.location}
                    Horario: ${bugInfo.availability.time}`;

        bot.sendMessage(chatId, reply);
    } else {
        bot.sendMessage(chatId, 'Lo siento, no pude encontrar ese bicho.');
    }
    } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, 'Lo siento, hubo un error al buscar ese bicho.');
    }
});

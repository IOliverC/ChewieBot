// Librerías necesarias
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = '6519624868:AAG706F1__E1TKIUl7JEYztC8WOBki-YyMQ';
const bot = new TelegramBot(token, {polling: true});

// Mapeo de categorías del español al inglés
const categorias = {
    'personajes': 'people',
    'películas': 'films',
    'naves': 'starships',
    'vehículos': 'vehicles',
    'especies': 'species',
    'planetas': 'planets'
};

// Definir enlaces a imágenes de los personajes
const imagenes = {
    'Luke Skywalker': 'https://elcomercio.pe/resizer/pEg2PglZZ0yUrNTN3u4pyLhwO1Y=/1200x1200/smart/filters:format(jpeg):quality(75)/cloudfront-us-east-1.images.arcpublishing.com/elcomercio/4T4B2F5QJJDXPPVRBZ7JEH24FE.jfif',
    'C-3PO': 'https://static.wikia.nocookie.net/starwars/images/a/a2/C-3PO-TROSTGG.png/revision/latest?cb=20230706042830',
    'R2-D2': 'https://toystnt.com/pictures/59136838be6209b32b3bce9c50d96557.jpg',
    'Darth Vader': 'https://nutrideon.es/5257-large_default/ilustracion-darth-vader-star-wars-impresion-digital.jpg',
    'Owen Lars': 'https://static.wikia.nocookie.net/esstarwars/images/8/81/Owen-OP.jpg/revision/latest?cb=20200719210622',
    'Beru Whitesun lars': 'https://lumiere-a.akamaihd.net/v1/images/beru-lars-main_fa680a4c.png?region=531%2C0%2C676%2C507',
    'R5-D4': 'https://static.wikia.nocookie.net/esstarwars/images/3/3f/R5D4-AG.png/revision/latest?cb=20240210190020',
    'Biggs Darklighter': 'https://lumiere-a.akamaihd.net/v1/images/image_606ff7f7.jpeg?region=0%2C0%2C1560%2C878',
    'Obi-Wan Kenobi': 'https://ca-times.brightspotcdn.com/dims4/default/10beaaa/2147483647/strip/true/crop/1263x720+0+0/resize/1200x684!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F57%2F32%2F9f488c2d4bc288bcfce63e749811%2Fobi-wan.JPG',
};

// Solicitud HTTP a la API
function buscarEnSwapi(categoria) {
    return axios.get(`https://www.swapi.tech/api/${categoria}`)
        .then(response => response.data)
        .catch(error => console.log(error));
}

// Logica para los eventos.
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const mensajeUsuario = msg.text.toLowerCase();

    // Añadir una condición especial para el comando "/start"
    if (mensajeUsuario === '/start') {
        bot.sendMessage(chatId, '¡Hola! Soy Chewie, tu bot de Star Wars. ¿Cómo puedo ayudarte hoy?🚀🪐 ', {
            reply_markup: {
                keyboard: [['Personajes👨‍👨‍👧‍👧', 'Películas📽'], ['Naves🚀', 'Vehículos🚠'], ['Especies🐻', 'Planetas🪐']]
            }
        });
    } else {
        // Verificar si el mensaje del usuario coincide con alguna categoría
        const categoriaSeleccionada = Object.keys(categorias).find(categoria => mensajeUsuario.includes(categoria));

        if (categoriaSeleccionada) {
            if (categoriaSeleccionada === 'personajes') {
                // Si el usuario selecciona la categoría de personajes, obtener la lista de personajes y construir el teclado
                buscarEnSwapi(categorias[categoriaSeleccionada])
                    .then(data => {
                        const listaDePersonajes = data.results.map(resultado => resultado.name);
                        const teclado = listaDePersonajes.reduce((resultArray, item, index) => { 
                            const chunkIndex = Math.floor(index / 2);
                            if (!resultArray[chunkIndex]) {
                                resultArray[chunkIndex] = [];
                            }
                            resultArray[chunkIndex].push(item);
                            return resultArray;
                        }, []);
                        teclado.push(['Volver al menú principal']);
                        bot.sendMessage(chatId, 'Selecciona un personaje🖖🏼:', {
                            reply_markup: {
                                keyboard: teclado
                            }
                        });
                    });
            } else {
                // Si el mensaje del usuario coincide con una categoría que no es personajes, buscar en esa categoría en SWAPI
                buscarEnSwapi(categorias[categoriaSeleccionada])
                    .then(data => {
                        const resultados = data.results.map(resultado => resultado.name).join('\n- ');
                        const respuesta = `Resultados de ${categoriaSeleccionada}:\n- ${resultados}`;
                        bot.sendMessage(chatId, respuesta, { parse_mode: 'Markdown' });
                    });
            }
        } else {
            // Manejar la selección de personaje
            const personaje = mensajeUsuario;

            // Convertir las claves del objeto 'imagenes' a minúsculas
            const imagenesMinusculas = Object.keys(imagenes).reduce((result, key) => {
                result[key.toLowerCase()] = imagenes[key];
                return result;
            }, {});

            // Verificar si el personaje seleccionado tiene una imagen asociada
            if (imagenesMinusculas[personaje]) {
                bot.sendPhoto(chatId, imagenesMinusculas[personaje]);
            } else {
                bot.sendMessage(chatId, 'Lo siento, no tengo una imagen para ese personaje.');
            }
        }
    }
});

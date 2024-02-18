// Librerías necesarias
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = '6519624868:AAG706F1__E1TKIUl7JEYztC8WOBki-YyMQ';
const bot = new TelegramBot(token, { polling: true });

//modulo MYSQL 
const mysql = require('mysql');

var conexion = mysql.createConnection({
    host: 'localhost',
    database: 'usuario_db',
    user: 'root',
    password: ''
});

conexion.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos MySQL:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos MySQL');
});

// Mapeo de categorías del español al inglés
const categorias = {
    'personajes': 'people',
    'películas': 'films',
    'planetas': 'planets',
    'trabajando en  más categorías': 'working on more categories'
};

// Definir enlaces a imágenes de las categorías
const imagenes = {
    'Luke Skywalker': 'https://elcomercio.pe/resizer/pEg2PglZZ0yUrNTN3u4pyLhwO1Y=/1200x1200/smart/filters:format(jpeg):quality(75)/cloudfront-us-east-1.images.arcpublishing.com/elcomercio/4T4B2F5QJJDXPPVRBZ7JEH24FE.jfif',
    'C-3PO': 'https://static.wikia.nocookie.net/starwars/images/a/a2/C-3PO-TROSTGG.png/revision/latest?cb=20230706042830',
    'R2-D2': 'https://toystnt.com/pictures/59136838be6209b32b3bce9c50d96557.jpg',
    'Darth Vader': 'https://nutrideon.es/5257-large_default/ilustracion-darth-vader-star-wars-impresion-digital.jpg',
    'Owen Lars': 'https://static.wikia.nocookie.net/esstarwars/images/8/81/Owen-OP.jpg/revision/latest?cb=20200719210622',
    'Leia Organa': 'https://static.wikia.nocookie.net/esstarwars/images/9/9b/Princessleiaheadwithgun.jpg/revision/latest?cb=20150117214124',
    'Beru Whitesun lars': 'https://lumiere-a.akamaihd.net/v1/images/beru-lars-main_fa680a4c.png?region=531%2C0%2C676%2C507',
    'R5-D4': 'https://static.wikia.nocookie.net/esstarwars/images/3/3f/R5D4-AG.png/revision/latest?cb=20240210190020',
    'Biggs Darklighter': 'https://lumiere-a.akamaihd.net/v1/images/image_606ff7f7.jpeg?region=0%2C0%2C1560%2C878',
    'Obi-Wan Kenobi': 'https://ca-times.brightspotcdn.com/dims4/default/10beaaa/2147483647/strip/true/crop/1263x720+0+0/resize/1200x684!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F57%2F32%2F9f488c2d4bc288bcfce63e749811%2Fobi-wan.JPG',
};

const imagenesPeliculas = {
    'A New Hope': 'https://m.media-amazon.com/images/I/612h-jwI+EL._AC_UF1000,1000_QL80_.jpg',
    'The Empire Strikes Back': 'https://musicart.xboxlive.com/7/7b325100-0000-0000-0000-000000000002/504/image.jpg?w=1920&h=1080',
    'Return of the Jedi': 'https://m.media-amazon.com/images/I/617CD+sLC-L._AC_UF1000,1000_QL80_.jpg',
    'The Phantom Menace': 'https://sm.ign.com/ign_latam/image/s/star-wars-/star-wars-the-phantom-menace-to-return-to-theaters-this-may_ztwv.jpg',
    'Attack of the Clones': 'https://musicart.xboxlive.com/7/5e325100-0000-0000-0000-000000000002/504/image.jpg?w=1920&h=1080',
    'Revenge of the Sith': 'https://m.media-amazon.com/images/M/MV5BNTc4MTc3NTQ5OF5BMl5BanBnXkFtZTcwOTg0NjI4NA@@._V1_.jpg'
};

const imagenesPlanetas = {
    'Tatooine': 'https://static.wikia.nocookie.net/esstarwars/images/b/b0/Tatooine_TPM.png/revision/latest?cb=20131214162357',
    'Alderaan': 'https://static.wikia.nocookie.net/esstarwars/images/4/4a/Alderaan.jpg/revision/latest?cb=20100723184830',
    'Yavin IV': 'https://static.wikia.nocookie.net/esstarwars/images/a/a0/Eaw_Yavin4.jpg/revision/latest?cb=20080127231835',
    'Hoth': 'https://static.wikia.nocookie.net/esstarwars/images/1/1d/Hoth_SWCT.png/revision/latest?cb=20170802030704',
    'Dagobah': 'https://static.wikia.nocookie.net/esstarwars/images/1/1c/Dagobah.jpg/revision/latest?cb=20061117132132',
    'Bespin': 'https://static.wikia.nocookie.net/esstarwars/images/2/2c/Bespin_EotECR.png/revision/latest?cb=20170527220537',
    'Endor': 'https://static.wikia.nocookie.net/esstarwars/images/5/50/Endor_FFGRebellion.png/revision/latest?cb=20170629163352',
    'Naboo': 'https://static.wikia.nocookie.net/esstarwars/images/f/f0/Naboo_planet.png/revision/latest?cb=20190928214307',
    'Coruscant': 'https://static.wikia.nocookie.net/esstarwars/images/1/16/Coruscant-EotE.jpg/revision/latest?cb=20221030195452',
    'Kamino': 'https://static.wikia.nocookie.net/esstarwars/images/a/a9/Eaw_Kamino.jpg/revision/latest?cb=20210616005549'
};

// Solicitud HTTP a la API
function buscarEnSwapi(categoria) {
    return axios.get(`https://www.swapi.tech/api/${categoria}`)
        .then(response => response.data)
        .catch(error => {
            console.log('Error en la solicitud HTTP:', error);
            throw error;
        });
}

// Lógica para los eventos
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const mensajeUsuario = msg.text.toLowerCase();

    // Añadir una condición especial para el comando "/start" y "Volver al menú principal"
    if (mensajeUsuario === '/start' || mensajeUsuario === 'volver al menú principal') {
        bot.sendMessage(chatId, '¡Hola! Soy Chewie, tu bot de Star Wars. ¿Cómo puedo ayudarte hoy?🚀⭐ ', {
            reply_markup: {
                keyboard: [['Personajes👨‍👨‍👧‍👧', 'Películas📽', 'Planetas🪐'], ['Trabajando en más categorías🔋🔧']]
            }
        });
    } else {
        // Verificar si el mensaje del usuario coincide con alguna categoría
        const categoriaSeleccionada = Object.keys(categorias).find(categoria => mensajeUsuario.includes(categoria));

        if (categoriaSeleccionada) {
            if (categoriaSeleccionada === 'películas') {
                // Si el usuario selecciona la categoría de películas, mostrar las películas disponibles
                const lista = Object.keys(imagenesPeliculas);
                const teclado = lista.reduce((resultArray, item, index) => {
                    const chunkIndex = Math.floor(index / 2);
                    if (!resultArray[chunkIndex]) {
                        resultArray[chunkIndex] = [];
                    }
                    resultArray[chunkIndex].push(item);
                    return resultArray;
                }, []);
                teclado.push(['Volver al menú principal']);
                bot.sendMessage(chatId, `Selecciona una película🎬:`, {
                    reply_markup: {
                        keyboard: teclado
                    }
                });
            } else if (categoriaSeleccionada === 'personajes' || categoriaSeleccionada === 'planetas') {
                // Si el usuario selecciona la categoría de personajes o planetas, obtener la lista y construir el teclado
                buscarEnSwapi(categorias[categoriaSeleccionada])
                    .then(data => {
                        if (data.results && data.results.length > 0) {
                            const lista = data.results.map(resultado => resultado.name);
                            const teclado = lista.reduce((resultArray, item, index) => {
                                const chunkIndex = Math.floor(index / 2);
                                if (!resultArray[chunkIndex]) {
                                    resultArray[chunkIndex] = [];
                                }
                                resultArray[chunkIndex].push(item);
                                return resultArray;
                            }, []);
                            teclado.push(['Volver al menú principal']);
                            bot.sendMessage(chatId, `Selecciona un ${categoriaSeleccionada.slice(0, -1)}🖖🏼:`, {
                                reply_markup: {
                                    keyboard: teclado
                                }
                            });
                        } else {
                            bot.sendMessage(chatId, 'No se encontraron resultados para esta categoría.');
                        }
                    })
                    .catch(error => {
                        console.error('Error al buscar en la API:', error);
                        bot.sendMessage(chatId, 'Ocurrió un error al buscar en la API. Por favor, inténtalo de nuevo más tarde.');
                    });
            } else {
                bot.sendMessage(chatId, 'No se encontraron resultados para esta categoría.');
            }
        } else {
            // Manejar la selección de película, personaje o planeta
            const seleccion = mensajeUsuario;

            // Convertir las claves del objeto 'imagenes', 'imagenesPeliculas' y 'imagenesPlanetas' a minúsculas
            const imagenesMinusculas = Object.keys(imagenes).reduce((result, key) => {
                result[key.toLowerCase()] = imagenes[key];
                return result;
            }, {});

            const imagenesPeliculasMinusculas = Object.keys(imagenesPeliculas).reduce((result, key) => {
                result[key.toLowerCase()] = imagenesPeliculas[key];
                return result;
            }, {});

            const imagenesPlanetasMinusculas = Object.keys(imagenesPlanetas).reduce((result, key) => {
                result[key.toLowerCase()] = imagenesPlanetas[key];
                return result;
            }, {});

            // Verificar si la selección tiene una imagen asociada
            if (imagenesMinusculas[seleccion]) {
                bot.sendPhoto(chatId, imagenesMinusculas[seleccion]);
            } else if (imagenesPeliculasMinusculas[seleccion]) {
                bot.sendPhoto(chatId, imagenesPeliculasMinusculas[seleccion]);
            } else if (imagenesPlanetasMinusculas[seleccion]) {
                bot.sendPhoto(chatId, imagenesPlanetasMinusculas[seleccion]);
            } else {
                bot.sendMessage(chatId, `Mantenimiento en progreso. Por favor, selecciona otra opción 🔄.`);
            }
        }
    }
});
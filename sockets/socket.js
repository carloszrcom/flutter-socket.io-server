const {io} = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand(new Band('Queen'));
bands.addBand(new Band('Bon Jovi'));
bands.addBand(new Band('Héroes del Silencio'));
bands.addBand(new Band('Metallica'));

// Mensajes de Sockets
io.on('connection', client => {
    // client.on('event', data => { /* … */ });
    console.log('Cliente conectado.');
    client.emit('active-bands', bands.getBands()); // Sólo recibe las bandas elcliente conectado

    client.on('disconnect', () => {
        console.log('Cliente desconectado.');
    });

    client.on('mensaje', (payload) => {
        console.log('Mensaje!!!', payload);

        // Emite mensaje a todos los clientes conectados
        io.emit('mensaje', {admin: 'Nuevo mensaje'});
    });

    client.on('emitir-mensaje', (payload) => {
        // console.log(payload);
        // io.emit('nuevo-mensaje', payload); // Emite a todos
        client.broadcast.emit('nuevo-mensaje', payload); // Emite a todos menos a quien lo emitió
    });

    client.on('vote-band', (payload) => {
        console.log(payload);
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands()); // Manda el mensaje a todos
    });

    // Escuchar add-band
    client.on('add-band', (payload) => {
        const newBand = new Band(payload.name);
        bands.addBand(newBand);
        io.emit('active-bands', bands.getBands()); // Manda el mensaje a todos
    });
    
    // Escuchar delete-band
    client.on('delete-band', (payload) => {
        console.log(payload);
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands()); // Manda el mensaje a todos
    });
});
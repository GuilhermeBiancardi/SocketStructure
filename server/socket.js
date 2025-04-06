import io from './server.js';

io.on('connection', (socket) => {

    console.log(`Client connected: ${socket.id}`);

    socket.on('switch_room', (identify) => {
        
        console.log(`Room: ${identify}`);

        // Sai de todas as salas em que o cliente está atualmente
        for (const room of socket.rooms) {
            // Evita que o cliente saia de sua própria sala (socket.id)
            if (room !== socket.id) {
                socket.leave(room);
            }
        }

        socket.join(identify);
        console.log(`Client ${socket.id} joined room: ${identify}`);
        
    });

    socket.on('input_message', (data) => {

        console.log(data);

        // Send to all clients including the sender
        // socket.emit('input_message_client', data.message);

        // Send to all clients except the sender
        // socket.broadcast.emit('input_message_client', data.message);

        // Envia a mensagem apenas para a sala
        io.to(data.room).emit('input_message_client', data);

    });

});
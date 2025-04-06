// Import io server setup
import io from './server.js';
// On connection event listener
io.on('connection', (socket) => {

    console.log(`Client connected: ${socket.id}`);
    // Switch room event listener
    socket.on('switch_room', (identify) => {
        console.log(`Room: ${identify}`);
        // Sai de todas as salas em que o cliente está atualmente
        for (const room of socket.rooms) {
            // Evita que o cliente saia de sua própria sala (socket.id)
            if (room !== socket.id) {
                socket.leave(room);
            }
        }
        // Entra na nova sala
        socket.join(identify);
    });

    // Message event listener
    socket.on('input_message', (data) => {
        console.log(data);

        // Send to all clients including the sender
        // socket.emit('input_message_client', data.message);

        // Send to all clients except the sender
        // socket.broadcast.emit('input_message_client', data.message);

        // Envia a mensagem apenas para a sala informada
        io.to(data.room).emit('input_message_client', data);
    });
    
});
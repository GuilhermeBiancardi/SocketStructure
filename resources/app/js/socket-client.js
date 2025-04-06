const socket = io();

let connect = (callback) => {
    socket.on("connect", () => {
        console.log("Socket connected");
        if (callback) callback();
    });
};

let reconnect = (callback) => {
    socket.on("reconnect", () => {
        console.log("Socket reconnected");
        if (callback) callback();
    });
};

let disconnect = (callback) => {
    socket.on("disconnect", () => {
        console.log("Socket disconnected");
        if (callback) callback();
    });
};

let emit = (event, data) => {
    socket.emit(event, data);
}

let on = (event, callback) => {
    socket.on(event, (data) => {
        if (callback) callback(data);
    });
}

let connection = (connectCallback, reconnectCallback, disconnectCallback) => {
    connect(connectCallback);
    reconnect(reconnectCallback);
    disconnect(disconnectCallback);
}

export { connection, on, emit };
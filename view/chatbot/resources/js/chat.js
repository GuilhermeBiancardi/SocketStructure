import { connection, on, emit } from "../../../../resources/app/js/socket-client.js";

const messages = document.getElementById("messages");
const switchRoom = document.getElementById("switchRoom");
const sendButton = document.getElementById("sendButton");
const inputMessage = document.getElementById("input_message");

connection(() => {
    emit("switch_room", "room_1");
}, () => {
    // Reconnect logic can be added here if needed
}, () => {
    // Disconnect logic can be added here if needed
});

sendButton.addEventListener("click", (_event) => {
    emit("input_message", {
        "message": inputMessage.value,
        "room": switchRoom.value
    });
});

switchRoom.addEventListener("change", (_event) => {
    emit("switch_room", switchRoom.value);
});

function addMessage(element, container, data) {
    element.value = "";
    container.innerHTML += `<div>${data.room} - ${data.message}</div>`;
};

on("input_message_client", (data) => {
    addMessage(inputMessage, messages, data);
});
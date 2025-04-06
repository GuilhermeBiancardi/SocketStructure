// Importa o módulo `Server` do pacote `socket.io`.
// Este módulo é usado para criar um servidor WebSocket que permite comunicação em tempo real entre cliente e servidor.
import { Server } from 'socket.io';

// Importa o framework `routes` para criar e gerenciar rotas HTTP.
import routes from './routes.js';

// Importa o módulo `http` do Node.js para criar um servidor HTTP.
import http from 'http';

// Define a porta em que o servidor irá escutar.
const PORT = 3000;

// Define o endereço do servidor. `127.0.0.1` significa que o servidor estará acessível apenas localmente.
const SERVER = '127.0.0.1';

// Cria um servidor HTTP usando o módulo `http` e o aplicativo `express`.
// O servidor HTTP será usado tanto para servir rotas HTTP quanto para integrar o Socket.IO.
const serverHttp = http.createServer(routes);

// Configura o servidor HTTP para escutar na porta e endereço definidos.
// Quando o servidor iniciar, ele exibirá uma mensagem no console indicando que está escutando.
serverHttp.listen(PORT, SERVER, () => {
    console.log(`Listening on ${SERVER}:${PORT}`);
});

// Cria uma instância do servidor Socket.IO, vinculando-o ao servidor HTTP.
// Isso permite que o servidor HTTP também suporte conexões WebSocket para comunicação em tempo real.
const io = new Server(serverHttp);

// Exporta a instância do Socket.IO para que outros módulos possam utilizá-la.
// Isso é útil para configurar eventos e lógica de comunicação em tempo real em outros arquivos.
export default io;

// Comentário indicando que o servidor pode ser iniciado com o comando `npm run dev`.
// Este comando deve estar configurado no arquivo `package.json` para usar ferramentas como `nodemon` para reiniciar automaticamente o servidor durante o desenvolvimento.
// Importa o módulo `express-ejs-layouts` para usar layouts EJS em views.
import expressLayouts from 'express-ejs-layouts';

// Importa o framework `express` para criar e gerenciar rotas HTTP.
import express from 'express';

// Cria uma instância do `express` para gerenciar rotas e middlewares.
const routes = express();

// Importa o módulo `path` do Node.js para manipular caminhos de arquivos e diretórios.
import path from 'path';

// Importa o módulo `url` do Node.js para trabalhar com URLs, como obter o caminho do arquivo atual.
import url from 'url';

// Importa o módulo `fs` do Node.js para trabalhar com o sistema de arquivos, como ler diretórios e arquivos.
import fs from 'fs';

// Obtém o caminho absoluto do arquivo atual (`server.js`) usando `import.meta.url`.
// `import.meta.url` retorna a URL do arquivo atual, e `url.fileURLToPath` converte essa URL em um caminho de arquivo.
const defaultPath = url.fileURLToPath(import.meta.url);

// Define o caminho para a pasta `view`, que está localizada dois níveis acima do arquivo atual.
// `path.join` é usado para construir o caminho de forma segura, independente do sistema operacional.
const viewPath = path.join(defaultPath, '../..', 'view');

// Define o caminho para a pasta `resources`, que está localizada fora da pasta `view`.
const resourcesPath = path.join(defaultPath, '../..', 'resources');

// Configura o diretório de views e o mecanismo de visualização como EJS.
// Define a pasta 'view' como diretório de templates
routes.set('views', viewPath);

// Define o EJS como template engine
routes.set('view engine', 'ejs');

// Configura o `express` para usar layouts EJS, permitindo que as views herdem de um layout comum.
routes.use(expressLayouts);

// Define o layout padrão
routes.set('layout', 'layouts/pages');

// Configura o `express` para servir arquivos estáticos da pasta `resources`.
routes.use('/resources', express.static(resourcesPath));

// Define os diretórios que devem ser ignorados na automação
const ignoredDirectories = ['layouts'];

// Função para criar rotas automaticamente com base nos diretórios
function createRoutesFromDirectories(basePath) {
    // Lê os diretórios dentro do caminho base (`view`)
    // `withFileTypes: true` permite que o `fs` retorne objetos `Dirent`, que contêm informações sobre os arquivos e diretórios.
    const directories = fs.readdirSync(basePath, { withFileTypes: true });
    // Percorre os diretórios e verifica se são realmente diretórios e não estão na lista de ignorados
    directories.forEach((dir) => {
        // Verifica se o item é um diretório e não está na lista de ignorados
        // `dir.isDirectory()` verifica se o item é um diretório, e `ignoredDirectories.includes(dir.name)` verifica se o nome do diretório está na lista de ignorados.
        if (dir.isDirectory() && !ignoredDirectories.includes(dir.name)) {
            // Define o caminho para o arquivo de configuração JSON dentro do diretório
            // `path.join` é usado para construir o caminho de forma segura, independente do sistema operacional.
            const configPath = path.join(basePath, dir.name, 'config', `${dir.name}.json`);
            // Inicializa um objeto de configuração vazio
            let config = {};
            // Define a rota padrão baseada no nome do diretório
            let routePath = `/${dir.name}`; // Rota padrão baseada no nome da pasta
            // Verifica se o arquivo de configuração existe
            if (fs.existsSync(configPath)) {
                // Se o arquivo de configuração existir, tenta lê-lo e parseá-lo
                // `fs.existsSync` verifica se o arquivo existe antes de tentar lê-lo
                try {
                    // Lê e parseia o arquivo de configuração
                    const configContent = fs.readFileSync(configPath, 'utf-8');
                    // `JSON.parse` converte o conteúdo JSON em um objeto JavaScript
                    config = JSON.parse(configContent);
                    // Usa o parâmetro `url` do arquivo de configuração, se existir
                    if (config.url) {
                        // Se o parâmetro `url` existir, usa ele como a rota
                        routePath = config.url;
                        // Substitui ${url} pelo valor da propriedade "url"
                        for (const key in config) {
                            // Verifica se a propriedade é uma string e contém ${url}
                            if (typeof config[key] === 'string') {
                                // Substitui ${url} pelo valor da propriedade "url"
                                config[key] = config[key].replace('${url}', config.url);
                            }
                        }
                    }
                } catch (error) {
                    console.error(`Erro ao ler o arquivo de configuração para ${dir.name}:`, error);
                }
            }
            // Define o caminho do template baseado no nome do diretório
            const templatePath = `${dir.name}/${dir.name}`;
            // Configura a rota automaticamente
            routes.get(routePath, (_req, res) => {
                // Renderiza a view usando o EJS, passando o caminho do template e as variáveis de configuração
                res.render(templatePath, {
                    title: config.title || dir.name.charAt(0).toUpperCase() + dir.name.slice(1), // Usa o título do config ou capitaliza o nome do diretório
                    customCSS: config.customCSS || null, // Usa o CSS do config ou null
                    customJS: config.customJS || null,  // Usa o JS do config ou null
                });
            });

            // Configura arquivos estáticos para o diretório
            routes.use(routePath, express.static(path.join(basePath, dir.name)));
        }
    });
}

// Cria as rotas automaticamente com base nos diretórios dentro de `view`
createRoutesFromDirectories(viewPath);

export default routes;
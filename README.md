# Instalação

Abra o terminal na pasta do porjeto e digite:

```bash
npm i
```

Isso instalará as dependências do projeto, caso queira atualizar o bootstrap, basta remover sua instância em `dependences` no `package.json` e instala-lo novamente via `npm`:

```bash
npm install bootstrap
```

Por questões de segurança, não é recomendado expor a pasta `node_modules` diretamente no servidor. Em vez disso, copie os arquivos necessários do Bootstrap para uma pasta pública (resources) e sirva-os a partir daí.

## Passo a passo:
Crie as pastas `resources/bootstrap/css` e `resources/bootstrap/js` (se ainda não existirem).<br><br>
Copie os arquivos necessários:<br>
CSS: `node_modules/bootstrap/dist/css/bootstrap.min.css` → `resources/bootstrap/css/bootstrap.min.css`<br>
JS: `node_modules/bootstrap/dist/js/bootstrap.bundle.min.js` → `resources/bootstrap/js/bootstrap.bundle.min.js`
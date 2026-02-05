# Como rodar o projeto com Docker

Este projeto foi configurado para rodar localmente usando Docker e Docker Compose. Isso garante que todos os desenvolvedores tenham o mesmo ambiente, sem precisar instalar Node.js diretamente na máquina.

## Pré-requisitos

- Docker Desktop instalado e rodando.

## Como rodar

1. **Construir e iniciar o container:**

   Abra o terminal na raiz do projeto e execute:

   ```bash
   docker-compose up
   ```

   Se quiser rodar em segundo plano (detached mode):

   ```bash
   docker-compose up -d
   ```

2. **Reconstruir (Rebuild) a imagem:**

   Se você instalou novas dependências ou alterou o Dockerfile, é necessário reconstruir a imagem:

   ```bash
   docker-compose up --build
   ```

   Ou para reconstruir sem iniciar:

   ```bash
   docker-compose build
   ```

3. **Acessar a aplicação:**

   Abra seu navegador em: [http://localhost:5173](http://localhost:5173)

4. **Parar a execução:**

   Pressione `Ctrl+C` no terminal (se não estiver em modo detached) ou execute:

   ```bash
   docker-compose down
   ```

## Desenvolvimento

O ambiente está configurado com volumes, o que significa que qualquer alteração que você fizer nos arquivos locais (na pasta `src`, por exemplo) será refletida automaticamente no container (Hot Reload), igual a rodar `npm run dev` localmente.

## Vercel

Estes arquivos Docker **não afetam** o deploy na Vercel. A Vercel detecta automaticamente que é um projeto Vite/React e usa os scripts do `package.json` (`npm install` e `npm run build`) para fazer o deploy, ignorando a configuração do Docker.

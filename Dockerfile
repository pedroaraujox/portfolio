# Usar uma imagem base leve do Node.js
FROM node:20-alpine

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Copiar os arquivos de dependência primeiro para aproveitar o cache do Docker
COPY package.json package-lock.json ./

# Instalar as dependências
RUN npm ci

# Copiar o restante do código do projeto
COPY . .

# Expor a porta padrão do Vite
EXPOSE 5173

# Comando para iniciar o servidor de desenvolvimento
# O --host é necessário para expor o servidor fora do container
CMD ["npm", "run", "dev", "--", "--host"]

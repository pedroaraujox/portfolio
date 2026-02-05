# Portfolio React + TypeScript + Vite

Este é um projeto de portfólio desenvolvido com React, TypeScript, Vite e Tailwind CSS, integrado com Supabase para gerenciamento de conteúdo.

## 🚀 Começando

Para rodar o projeto, você tem duas opções principais:

1. **Docker (Recomendado):** Ambiente isolado e pronto para uso.
2. **Localmente:** Requer Node.js instalado.

### 🐳 Rodando com Docker

Para instruções detalhadas sobre como construir, rodar, rebuildar e parar os containers, consulte:
👉 **[README_DOCKER.md](./README_DOCKER.md)**

Resumo rápido:
```bash
docker-compose up
```

### 💻 Rodando Localmente

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Rode o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## 🔐 Painel Administrativo

O projeto conta com um CMS completo para gerenciar projetos, serviços e textos.

Para saber como configurar o banco de dados, criar usuários administradores e acessar o painel, consulte:
👉 **[README_ADMIN.md](./README_ADMIN.md)**

## 🛠️ Tecnologias

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [Docker](https://www.docker.com/)

## 📂 Estrutura do Projeto

- `src/`: Código fonte da aplicação
- `supabase/`: Migrações e scripts SQL
- `scripts/`: Scripts utilitários (ex: criar admin)
- `docker-compose.yml`: Configuração do Docker

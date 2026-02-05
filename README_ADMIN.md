# Painel Administrativo do Portfólio

Este projeto inclui um painel administrativo completo para gerenciamento de conteúdo.

## Acesso
O painel administrativo está acessível em:
http://localhost:5173/admin-acesso-privado

## Criar Usuário Administrador

Para acessar o painel, você precisará de um usuário cadastrado. O projeto inclui um script para criar um usuário administrador inicial.

1. Certifique-se de que você tem Node.js instalado (ou execute dentro do container Docker).
2. Na raiz do projeto, execute:

```bash
node scripts/create_admin.js
```

Isso criará um usuário com as seguintes credenciais (definidas no script):
- **Email:** `admin@portfolio.com`
- **Senha:** `#web56st#`

> **Nota:** Recomenda-se alterar a senha ou a lógica de criação de usuário para produção.

## Configuração do Banco de Dados (Supabase)

Para que o painel funcione corretamente, é necessário configurar as tabelas no Supabase.

1. Acesse o painel do seu projeto no Supabase.
2. Vá para o **SQL Editor**.
3. Copie o conteúdo do arquivo `supabase_schema.sql` localizado na raiz deste projeto.
4. Cole no editor e execute (Run).

Isso criará as seguintes tabelas e políticas de segurança:
- `projects`: Gerenciamento de projetos.
- `services`: Gerenciamento de serviços.
- `site_content`: Conteúdo dinâmico das páginas Sobre e Contato.
- `contact_messages`: Mensagens recebidas pelo formulário de contato.
- `audit_logs`: Histórico de auditoria (preparado para uso futuro).

## Funcionalidades
- **Autenticação**: Login seguro via Supabase Auth.
- **Projetos**: CRUD completo com ordenação e ativação/desativação.
- **Serviços**: CRUD completo com seleção de ícones.
- **Sobre Mim**: Edição de textos e linha do tempo.
- **Contato**: Edição de informações de contato e visualização de mensagens recebidas.
- **Real-time**: Todas as alterações são refletidas instantaneamente no site público.

## Segurança
- O acesso às tabelas é protegido por RLS (Row Level Security).
- Apenas usuários autenticados podem modificar dados.
- O painel administrativo é protegido por rota privada.

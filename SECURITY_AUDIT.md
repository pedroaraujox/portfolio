# Relatório de Auditoria de Segurança

**Data:** 05/02/2026
**Auditor:** Trae AI Security Specialist
**Alvo:** Repositório Atual

## Resumo Executivo
A auditoria identificou **3 vulnerabilidades críticas** que comprometem totalmente a segurança da aplicação, permitindo que qualquer atacante obtenha acesso administrativo, exfiltre dados do banco de dados e execute código arbitrário no ambiente de servidor (via Docker).

## 1. Credenciais Administrativas Hardcoded (CRÍTICO 🔴)

**Localização:** `scripts/create_admin.js` (Linhas 3-4, 8-9)

**Descrição:**
O script contém a URL do Supabase, a Chave Anônima (que é aceitável ser pública), mas também define um usuário e senha administrativa hardcoded. Pior ainda, se este script for versionado, as credenciais de acesso inicial são expostas.

**Exploração:**
Um atacante com acesso ao repositório (ou se o arquivo for servido publicamente por engano) pode ler as credenciais `admin@portfolio.com` / `#web56st#` e fazer login no painel administrativo.

**Impacto:**
Acesso total ao painel administrativo, permitindo modificação de conteúdo, exclusão de projetos e upload de arquivos maliciosos.

**Correção:**
Utilizar variáveis de ambiente.

## 2. Scripts de Migração Inseguros (CRÍTICO 🔴)

**Localização:**
- `supabase/migrations/enable_public_access.sql`
- `supabase/migrations/force_public_access_v2.sql`

**Descrição:**
Estes scripts desabilitam explicitamente o Row Level Security (RLS) ou criam políticas que permitem `ALL` para o role `anon`.

**Exploração:**
Se aplicados, qualquer usuário (mesmo sem autenticação) pode enviar requisições diretas ao Supabase para `DELETE FROM projects` ou `UPDATE services`.

**Impacto:**
Perda total de integridade dos dados. O banco de dados torna-se publicamente gravável.

**Correção:**
Remover estes arquivos imediatamente e garantir que as políticas em `20240203000000_initial_schema.sql` sejam as únicas aplicadas.

## 3. Configuração Docker Insegura (ALTA 🟠)

**Localização:** `Dockerfile` e `docker-compose.yml`

**Descrição:**
O container roda como usuário `root` (padrão). O `docker-compose.yml` monta o diretório raiz (`.:/app`), o que pode sobrescrever arquivos do host se o container for comprometido.

**Exploração:**
Se um atacante conseguir Execução Remota de Código (RCE) na aplicação Node.js, ele terá privilégios de root dentro do container e poderá modificar arquivos no host através do volume montado.

**Correção:**
Criar um usuário não-privilegiado no Dockerfile e rodar a aplicação com ele.

## 4. Vazamento de Informações em Erros (MÉDIA 🟡)

**Localização:** `src/pages/admin/Login.tsx` (Linha 37)

**Descrição:**
O código exibe `err.message` diretamente vindo do Supabase. Isso pode revelar se um usuário existe ou não ("Invalid login credentials" vs "User not found"), permitindo enumeração de usuários.

**Correção:**
Usar mensagens genéricas como "Email ou senha inválidos".

## 5. Controle de Acesso Baseado Apenas em Autenticação (ALTA 🟠)

**Localização:** Políticas RLS em `supabase/migrations/*.sql`

**Descrição:**
As políticas verificam `auth.role() = 'authenticated'`. Se o projeto permitir cadastro público (self-registration) no Supabase, qualquer pessoa que criar uma conta será considerada "autenticada" e terá permissões de admin.

**Correção:**
Restringir o acesso a um email específico ou criar uma tabela de `roles`.

---

## Ações Realizadas
Os arquivos corrigidos foram gerados e os scripts inseguros foram neutralizados.

# Instruções de Correção de Segurança (CRÍTICO)

Detectamos vulnerabilidades críticas de controle de acesso. Como não possuímos a chave de serviço (`SERVICE_ROLE_KEY`) configurada no ambiente local, **você deve aplicar as correções manualmente no painel do Supabase**.

## Passo 1: Aplicar a Migração SQL

1. Acesse o painel do seu projeto no [Supabase](https://supabase.com/dashboard).
2. Vá para **SQL Editor**.
3. Clique em **New Query**.
4. Copie TODO o conteúdo do arquivo:
   `supabase/migrations/20260205_security_hardening.sql`
5. **IMPORTANTE:** Antes de rodar, procure a linha:
   ```sql
   VALUES ('admin@example.com')
   ```
   e substitua `admin@example.com` pelo email que você usa para fazer login na aplicação (admin).
6. Clique em **Run**.

## Passo 2: Verificar a Correção

Após rodar o script:

1. Tente fazer login na aplicação.
2. Se você configurou seu email corretamente na whitelist, tudo funcionará normalmente.
3. Se um usuário NÃO autorizado tentar fazer login (ou criar conta via Postman), ele **não terá permissão** para criar/editar/deletar nada, pois a função `is_admin()` retornará falso.

## Passo 3: Limpeza de Segredos

Os arquivos `scripts/seed_database.js` e `scripts/test_connection.js` continham chaves de API expostas (Hardcoded Secrets).
Eles foram corrigidos automaticamente para usar o arquivo `.env`.

Certifique-se de que seu arquivo `.env` local contenha:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
# Opcional, apenas para scripts de administração:
SUPABASE_SERVICE_ROLE_KEY=...
```

## Passo 4: Docker (Recomendação)

Para produção, altere seu `Dockerfile` para não rodar `npm run dev`. Use um build de produção.

```dockerfile
# Exemplo simplificado para produção
RUN npm run build
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "5173"]
```

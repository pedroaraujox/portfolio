# Documentação da API de Upload e Imagens

## Visão Geral
O sistema utiliza o Supabase Storage para armazenamento de arquivos e o Supabase Database (PostgreSQL) para referência das imagens.

## Estrutura de Dados
As imagens são armazenadas na coluna `gallery` da tabela `projects` como um array JSONB.

```json
[
  {
    "url": "https://your-project.supabase.co/storage/v1/object/public/portfolio/filename.jpg",
    "caption": "Descrição opcional da imagem"
  }
]
```

## Componentes

### ImageUploader
Componente responsável pelo upload, validação e gerenciamento da lista de imagens no formulário.

- **Validações**:
  - Tipos: JPEG, PNG, GIF, WebP
  - Tamanho Máximo: 5MB
  - Quantidade Máxima: 10 imagens
- **Funcionalidades**:
  - Compressão automática no frontend (Client-side)
  - Barra de progresso
  - Pré-visualização

### ImageCarousel
Componente para exibição das imagens.

- **Funcionalidades**:
  - Navegação (Setas e Swipe)
  - Zoom (Lightbox)
  - Lazy Loading
  - Responsivo

## Endpoints (Supabase)

### Upload de Imagem
Utiliza a SDK do Supabase Client.

**Bucket**: `portfolio`
**Acesso**: Público para leitura, Autenticado para escrita.

```typescript
// Exemplo de Upload
const { data, error } = await supabase.storage
  .from('portfolio')
  .upload('filename.jpg', fileObject);
```

### Recuperação de Imagem
As URLs são públicas e geradas após o upload.

```typescript
// Exemplo de Recuperação de URL
const { data } = supabase.storage
  .from('portfolio')
  .getPublicUrl('filename.jpg');
```

## Testes
Os testes foram implementados utilizando Vitest e React Testing Library.

Para rodar os testes:
```bash
npm install -D vitest jsdom @testing-library/react @testing-library/user-event @testing-library/dom
npm run test
```
(Certifique-se de adicionar o script `"test": "vitest"` no `package.json`)

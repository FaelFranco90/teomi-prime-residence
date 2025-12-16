# ⚙️ GUIA DE CONFIGURAÇÃO - SEO Teomi Prime

## Passo 1: Atualizar Configurações Globais

Abra o arquivo `src/config/seo.ts` e atualize com seus dados reais:

```typescript
export const SEO_CONFIG = {
  siteName: "Teomi Prime",
  siteUrl: "https://teomiprime.com.br", // ✅ Seu domínio real
  description: "Teomi Prime - Imóveis de Altíssimo Padrão...",
  keywords: "...",
  author: "Teomi Prime",
  language: "pt-BR",
  
  social: {
    twitter: "@teomiprime",      // ✅ Seu handle do Twitter
    instagram: "@teomiprime",    // ✅ Seu Instagram
    facebook: "teomiprime",      // ✅ Sua página do Facebook
  },

  contact: {
    phone: "+55 (11) XXXX-XXXX",           // ✅ Seu telefone
    email: "contato@teomiprime.com.br",   // ✅ Seu email
    address: "São Paulo, SP, Brasil",
  },

  ogImage: {
    url: "https://teomiprime.com.br/og-image.jpg", // ✅ Sua imagem
    width: 1200,
    height: 630,
    type: "image/jpeg",
  },
};
```

---

## Passo 2: Criar Imagem OG (Open Graph)

A imagem OG é aquela que aparece quando você compartilha o link em redes sociais.

### Especificações:
- **Dimensões**: 1200x630 pixels (exato!)
- **Formato**: JPG ou PNG
- **Tamanho**: Menos de 5MB
- **Conteúdo**: Logo + imagem luxuosa
- **Salvar como**: `public/og-image.jpg`

### Ferramentas para criar:
- **Canva**: canva.com (templates prontos)
- **Figma**: figma.com (design profissional)
- **Adobe XD**: adobe.com
- **Online**: openai.com/dall-e (gerar com IA)

---

## Passo 3: Adicionar Meta Verificação (Google)

### Para Google Search Console:

1. Ir para [search.google.com/search-console](https://search.google.com/search-console)
2. Clique em "Adicionar Propriedade"
3. Cole a URL: `https://teomiprime.com.br`
4. Escolha "HTML tag" como método de verificação
5. Copie a meta tag fornecida

Exemplo:
```html
<meta name="google-site-verification" content="abc123xyz..." />
```

6. Cole em `index.html` dentro da tag `<head>`:

```html
<head>
  <meta charset="UTF-8" />
  <!-- Adicione aqui -->
  <meta name="google-site-verification" content="abc123xyz..." />
  <!-- resto das metas -->
</head>
```

### Para Bing Webmaster Tools:

1. Ir para [bing.com/webmaster/tools](https://bing.com/webmaster/tools)
2. Adicionar site
3. Verificar com meta tag
4. Copiar e adicionar em index.html

```html
<meta name="msvalidate.01" content="xyz123..." />
```

---

## Passo 4: Deploy em Produção

```bash
# Fazer build
npm run build

# Ou com Bun (se estiver usando Bun)
bun run build

# Após build, fazer deploy em seu servidor/hosting
# (Vercel, Netlify, seu servidor próprio, etc)
```

---

## Passo 5: Verificação no Google Search Console

Após fazer deploy:

1. Voltar ao Google Search Console
2. Clicar em "Verificar" (na página de verificação)
3. Aguardar confirmação (pode levar alguns minutos)
4. Após confirmado, ir para Dashboard
5. Submeter Sitemap:
   - Ir para "Sitemaps"
   - Clicar em "Adicionar/Testar Sitemap"
   - Cole: `https://teomiprime.com.br/sitemap.xml`
   - Clique em "Enviar"

---

## Passo 6: Configurar Google Analytics 4

### Instalar Google Analytics:

1. Ir para [analytics.google.com](https://analytics.google.com)
2. Criar Nova Propriedade
3. Nome: "Teomi Prime"
4. Timezone: "America/Sao_Paulo"
5. Moeda: "BRL"
6. Criar
7. Escolher "Web"
8. Site URL: `https://teomiprime.com.br`
9. Nome do stream: "Teomi Prime Website"
10. Criar stream
11. Copiar o `MEASUREMENT_ID`

### Adicionar ao seu projeto:

Instale a package do Firebase Analytics:

```bash
npm install firebase
# ou
bun add firebase
```

Crie um arquivo `src/lib/analytics.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  measurementId: 'G-XXXXXXXXXX', // ✅ Seu ID aqui
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { analytics };
```

Ou use a tag global (mais simples):

Em `index.html`, adicione antes de `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## Passo 7: Testar Tudo

### Teste 1: Meta Tags
```bash
1. Abra a URL em produção
2. F12 → Elements
3. Procure no <head> pelas meta tags
4. Confirme que aparecem corretamente
```

### Teste 2: Open Graph
1. Ir para [opengraph.xyz](https://opengraph.xyz)
2. Cole a URL
3. Verifique se a imagem apareceu
4. Teste também no Facebook Share Dialog

### Teste 3: JSON-LD
1. Ir para [schema.org/validator](https://schema.org/validator)
2. Cole a URL
3. Verifique se não há erros
4. Confirme que Organization e/ou LocalBusiness aparecem

### Teste 4: Performance
1. Ir para [pagespeed.web.dev](https://pagespeed.web.dev)
2. Cole a URL
3. Verifique Desktop e Mobile
4. Anote scores para comparação futura

### Teste 5: Mobile
1. Abra em dispositivo móvel ou emulador
2. Verifique responsividade
3. Teste em 4G (DevTools → Throttle)

---

## Passo 8: Monitoramento Contínuo

### Adicione ao seu calendário:

**Semanal**:
- Verificar Google Search Console → Cobertura
- Ver se há novos erros de rastreamento
- Monitorar impressões (Search Analytics)

**Mensal**:
- Revisar tráfego orgânico no Analytics
- Verificar posicionamento de palavras-chave (SEMrush, Ahrefs)
- Analisar bounce rate e tempo na página
- Revisar relatórios de performance

**Trimestral**:
- Auditoria completa de SEO (Screaming Frog)
- Análise de backlinks
- Revisão de estrutura de links internos
- Identificar oportunidades de conteúdo

---

## Passo 9: Otimizações Adicionais (Opcional mas Recomendado)

### Adicionar Estrutura de Breadcrumb

Em cada página de detalhe (ex: PropertyDetail.tsx):

```tsx
import { getBreadcrumbSchema } from "@/components/StructuredData";

const breadcrumbs = [
  { name: "Home", url: getFullUrl("/") },
  { name: "Imóveis", url: getFullUrl("/imoveis") },
  { name: property.title, url: getFullUrl(`/imovel/${property.code}`) },
];

return (
  <>
    <StructuredData schema={getBreadcrumbSchema(breadcrumbs)} />
    {/* seu conteúdo */}
  </>
);
```

### Adicionar FAQ Schema

Se tiver página de FAQ:

```tsx
import { getFAQSchema } from "@/components/StructuredData";

const faqs = [
  {
    question: "Como comprar um imóvel com Teomi Prime?",
    answer: "Entre em contato com nossos especialistas..."
  },
  // mais FAQs
];

return (
  <>
    <StructuredData schema={getFAQSchema(faqs)} />
    {/* suas FAQs */}
  </>
);
```

### Lazy Loading de Imagens

```tsx
// ❌ Antes
<img src={image} alt={alt} />

// ✅ Depois
<img src={image} alt={alt} loading="lazy" />
```

---

## Passo 10: Checklist Final

Antes de considerar "pronto":

- [ ] SEO_CONFIG atualizado com dados reais
- [ ] og-image.jpg criado e salvo em /public
- [ ] Meta tag Google Search Console adicionada e verificada
- [ ] Sitemap.xml submetido ao Google
- [ ] Google Analytics configurado
- [ ] Bing Webmaster Tools verificado
- [ ] Testes em opengraph.xyz OK
- [ ] Testes em schema.org/validator OK
- [ ] PageSpeed Insights score aceitável (70+)
- [ ] Mobile-friendly test OK
- [ ] Sem 404s ou erros de rastreamento
- [ ] Canonical URLs corretas em todas as páginas
- [ ] Alt text em todas as imagens importantes
- [ ] Meta descriptions únicas para cada página
- [ ] Breadcrumbs schema adicionado (opcional)

---

## Troubleshooting

### "Google não está indexando meu site"
- ✅ Verificar em Search Console → Cobertura
- ✅ Verificar se não há erro de rastreamento
- ✅ Submeter XML Sitemap
- ✅ Verificar robots.txt
- ✅ Esperar 1-2 semanas (é normal para sites novos)

### "Meta tags não aparecem"
- ✅ Fazer hard refresh (Ctrl+Shift+R)
- ✅ Verificar DevTools → Elements, procurar em <head>
- ✅ Usar site: no Google para ver cache

### "Open Graph image não carrega"
- ✅ Verificar que og-image.jpg existe em /public
- ✅ Verificar dimensões (1200x630)
- ✅ Verificar em opengraph.xyz
- ✅ Limpar cache do Facebook em dev.facebook.com/tools

### "JSON-LD com erros"
- ✅ Validar em schema.org/validator
- ✅ Verificar se JSON está bem formatado
- ✅ Conferir se todos os campos necessários existem

---

## 📚 Recursos Úteis

- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org)
- [Open Graph Protocol](https://ogp.me)
- [Moz SEO Guide](https://moz.com/beginners-guide-to-seo)
- [Search Console Help](https://support.google.com/webmasters)

---

## 🆘 Precisa de Ajuda?

Se tiver dúvidas sobre a implementação:

1. Revisar **SEO_IMPROVEMENTS.md** - Documentação completa
2. Revisar **SEO_USAGE_GUIDE.ts** - Exemplos práticos
3. Consultar documentação oficial (links acima)
4. Fazer testes nas ferramentas online

---

**Atualizado em**: 16 de dezembro de 2025
**Versão**: 1.0
**Status**: ✅ Pronto para Implementação

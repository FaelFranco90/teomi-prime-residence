# 📖 Guia de Uso - Sistema de SEO Teomi Prime

## 1. Usar Meta Tags em Uma Página

```typescript
import { useMetaTags } from "@/components/MetaTags";
import { PAGE_METADATA, SEO_CONFIG } from "@/config/seo";

export default function MinhaPage() {
  // Simples - usar metadados predefinidos
  useMetaTags({
    title: PAGE_METADATA.properties.title,
    description: PAGE_METADATA.properties.description,
    keywords: PAGE_METADATA.properties.keywords,
  });

  // Ou customizado - quando precisa de valores dinâmicos
  useMetaTags({
    title: `${dynamicTitle} - Teomi Prime`,
    description: dynamicDescription,
    keywords: "imóvel de luxo, São Paulo, apartamento premium",
    image: customImage,
    url: `https://prime.teomiimoveis.com.br/pagina-dinamica/${id}`,
    canonical: `https://prime.teomiimoveis.com.br/pagina-dinamica/${id}`,
  });

  return <div>{/* seu conteúdo */}</div>;
}
```

## 2. Adicionar Structured Data (JSON-LD)

```typescript
import { StructuredData, getOrganizationSchema, getPropertySchema } from "@/components/StructuredData";

export default function PropertyPage({ property }) {
  return (
    <div>
      <StructuredData schema={getPropertySchema(property)} />
      {/* seu conteúdo */}
    </div>
  );
}
```

## 3. Usar Configurações Globais de SEO

```typescript
import { SEO_CONFIG, PAGE_METADATA, getFullUrl } from "@/config/seo";

// Pegar URL completa
const url = getFullUrl("/imoveis"); // https://prime.teomiimoveis.com.br/imoveis

// Pegar informações da empresa
const siteName = SEO_CONFIG.siteName; // "Teomi Prime"
const phone = SEO_CONFIG.contact.phone;
const email = SEO_CONFIG.contact.email;

// Pegar metadados de uma página específica
const homeTitle = PAGE_METADATA.home.title;
const homeDescription = PAGE_METADATA.home.description;
```

## 4. Exemplos Práticos

### Página About
```typescript
import { useMetaTags } from "@/components/MetaTags";
import { PAGE_METADATA, SEO_CONFIG } from "@/config/seo";
import { StructuredData, getOrganizationSchema } from "@/components/StructuredData";

export default function About() {
  useMetaTags({
    title: PAGE_METADATA.about.title,
    description: PAGE_METADATA.about.description,
    keywords: PAGE_METADATA.about.keywords,
    url: "https://prime.teomiimoveis.com.br/sobre",
    canonical: "https://prime.teomiimoveis.com.br/sobre",
    schema: getOrganizationSchema(),
  });

  return (
    <div>
      <StructuredData schema={getOrganizationSchema()} />
      <h1>Sobre Teomi Prime</h1>
      {/* conteúdo */}
    </div>
  );
}
```

### Página de Contact
```typescript
export default function Contact() {
  useMetaTags({
    title: PAGE_METADATA.contact.title,
    description: PAGE_METADATA.contact.description,
    keywords: PAGE_METADATA.contact.keywords,
  });

  return (
    <div>
      <h1>Contato</h1>
      {/* form de contato */}
    </div>
  );
}
```

### Propriedade Individual
```typescript
import { useMetaTags } from "@/components/MetaTags";
import { StructuredData, getPropertySchema, getBreadcrumbSchema } from "@/components/StructuredData";
import { getFullUrl, SEO_CONFIG } from "@/config/seo";

export default function PropertyDetail({ property }) {
  const breadcrumbs = [
    { name: "Home", url: getFullUrl("/") },
    { name: "Imóveis", url: getFullUrl("/imoveis") },
    { name: property.title, url: getFullUrl(`/imovel/${property.code}`) },
  ];

  useMetaTags({
    title: `${property.title} - Teomi Prime`,
    description: property.description,
    keywords: `${property.title}, ${property.propertyType}, ${property.city}, imóvel de luxo`,
    image: property.galleryImages?.[0],
    url: getFullUrl(`/imovel/${property.code}`),
    canonical: getFullUrl(`/imovel/${property.code}`),
    ogType: "product",
    schema: getPropertySchema(property),
  });

  return (
    <div>
      <StructuredData schema={getPropertySchema(property)} />
      <StructuredData schema={getBreadcrumbSchema(breadcrumbs)} />
      {/* detalhes da propriedade */}
    </div>
  );
}
```

## 5. Adicionar Imagens com SEO Otimizado

### ❌ Ruim - sem alt text
```jsx
<img src="/image.jpg" />
```

### ✅ Bom - com alt text descritivo
```jsx
<img 
  src="/image.jpg"
  alt="Sala de estar luxuosa com piso de mármore e janelas panorâmicas"
  loading="lazy"
/>
```

### ✅ Melhor - com responsividade
```jsx
<img 
  srcSet="image-small.jpg 480w, image-large.jpg 1200w"
  sizes="(max-width: 600px) 480px, 1200px"
  alt="Sala de estar luxuosa com piso de mármore e janelas panorâmicas"
  loading="lazy"
/>
```

## 6. Adicionar Headings Semânticos

### ✅ Bom - estrutura hierárquica correta
```jsx
<main>
  <h1>Imóveis de Luxo São Paulo</h1>
  
  <section>
    <h2>Casas Exclusivas</h2>
    <article>
      <h3>Casa no Morumbi</h3>
      <p>Descrição...</p>
    </article>
  </section>

  <section>
    <h2>Apartamentos Premium</h2>
  </section>
</main>
```

## 7. Adicionar Canonical URL

```typescript
// Já é feito automaticamente no useMetaTags(),
// mas você pode passar manualmente se precisar:

useMetaTags({
  title: "...",
  description: "...",
  canonical: "https://prime.teomiimoveis.com.br/imovel/123",
});
```

## 8. Adicionar Breadcrumb Schema

```typescript
import { getBreadcrumbSchema } from "@/components/StructuredData";

const breadcrumbs = [
  { name: "Home", url: "https://prime.teomiimoveis.com.br/" },
  { name: "Imóveis", url: "https://prime.teomiimoveis.com.br/imoveis" },
  { name: "Apartamentos", url: "https://prime.teomiimoveis.com.br/imoveis?tipo=apartamento" },
  { name: "Cobertura Morumbi", url: "https://prime.teomiimoveis.com.br/imovel/123" },
];

<StructuredData schema={getBreadcrumbSchema(breadcrumbs)} />
```

## 9. Adicionar FAQ Schema

```typescript
import { getFAQSchema } from "@/components/StructuredData";

const faqItems = [
  {
    question: "Como faço para comprar um imóvel com a Teomi Prime?",
    answer: "Entre em contato com nossos especialistas...",
  },
  {
    question: "Vocês trabalham com financiamento?",
    answer: "Sim, temos parcerias com os principais bancos...",
  },
];

<StructuredData schema={getFAQSchema(faqItems)} />
```

## 10. Atualizar Configurações Globais

Arquivo: `src/config/seo.ts`

```typescript
export const SEO_CONFIG = {
  siteName: "Teomi Prime",
  siteUrl: "https://prime.teomiimoveis.com.br", // ✅ URL real
  description: "Teomi Prime - Imóveis de Altíssimo Padrão...",
  keywords: "...",
  author: "Teomi Prime",
  language: "pt-BR",
  
  social: {
    twitter: "@teomiprime", // ✅ Atualizar
    instagram: "@teomiprime", // ✅ Atualizar
    facebook: "teomiprime", // ✅ Atualizar
  },

  contact: {
    phone: "+55 (11) XXXX-XXXX", // ✅ Atualizar
    email: "contato@teomiimoveis.com.br", // ✅ Atualizar
    address: "São Paulo, SP, Brasil",
  },

  ogImage: {
    url: "https://prime.teomiimoveis.com.br/og-image.jpg", // ✅ Arquivo salvo em /public
    width: 1200,
    height: 630,
    type: "image/jpeg",
  },
};
```

## 11. Adicionar Atributos ARIA

### ❌ Ruim - sem acessibilidade
```jsx
<button>
  <MenuIcon />
  Menu
</button>
```

### ✅ Bom - com aria-hidden
```jsx
<button>
  <MenuIcon aria-hidden="true" />
  Menu
</button>
```

### ✅ Bom - com aria-label
```jsx
<div aria-label="Navegação principal">
  <nav>{/* conteúdo */}</nav>
</div>
```

### ✅ Bom - com role
```jsx
<div role="region" aria-label="Imóveis em destaque">
  {/* lista de imóveis */}
</div>
```

## 12. Testar Meta Tags

No navegador (após implementar):

1. Abra F12 (DevTools)
2. Vá para aba Elements
3. Procure no `<head>`:
   - `<title>Seu Título - Teomi Prime</title>`
   - `<meta name="description" content="...">`
   - `<meta property="og:title" content="...">`
   - `<meta name="twitter:card" content="summary_large_image">`
   - `<link rel="canonical" href="...">`
   - `<script type="application/ld+json">{...}</script>`

4. Ou use ferramentas online:
   - [opengraph.xyz](https://opengraph.xyz) - Visualizar em redes sociais
   - [schema.org/validator](https://schema.org/validator) - Validar JSON-LD
   - [Google Mobile-Friendly](https://search.google.com/test/mobile-friendly) - Testar mobile

## 13. Integrar com Google Search Console

1. Acessar: https://search.google.com/search-console
2. Selecionar "Adicionar propriedade"
3. Colar URL: https://prime.teomiimoveis.com.br
4. Selecionar "Verificar"
5. Copiar meta tag: `<meta name="google-site-verification" content="..." />`
6. Colar em `index.html` dentro de `<head>`
7. Após verificado, submeter `sitemap.xml`
8. Monitorar cobertura e performance

## 14. Performance & Optimization

### ✅ Lazy loading de componentes (já implementado)
```typescript
const Properties = lazy(() => import("./pages/Properties"));
```

### ✅ Lazy loading de imagens
```jsx
<img loading="lazy" src={image} alt={description} />
```

### ✅ Code splitting automático com Vite (já configurado)

### ✅ Minificação (Vite faz automaticamente no build)

## 15. Checklist Final

- [ ] Todas as páginas têm `useMetaTags()` implementado
- [ ] Todas as imagens têm alt text descritivo
- [ ] StructuredData adicionado (Organization, Properties, etc)
- [ ] og-image.jpg criada (1200x630px)
- [ ] SEO_CONFIG.siteUrl atualizado com URL real
- [ ] SEO_CONFIG.contact atualizado com dados reais
- [ ] SEO_CONFIG.social atualizado com redes sociais
- [ ] Google Search Console verificado
- [ ] Sitemap.xml gerado e submetido
- [ ] Robots.txt revisado
- [ ] Meta verificação do Google adicionada
- [ ] Testes em mobile (Chrome DevTools)
- [ ] Performance testada (PageSpeed Insights)
- [ ] Canonical URLs verificadas
- [ ] Sem erros de console

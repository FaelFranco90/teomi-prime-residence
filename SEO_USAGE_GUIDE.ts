// ========================================
// GUIA DE USO: Sistema de SEO Teomi Prime
// ========================================

/**
 * Este arquivo documenta como usar os novos componentes e configurações de SEO
 * implementados para otimizar o site da Teomi Prime.
 */

// ========================================
// 1. USAR META TAGS EM UMA PÁGINA
// ========================================

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
    url: `https://teomiprime.com.br/pagina-dinamica/${id}`,
    canonical: `https://teomiprime.com.br/pagina-dinamica/${id}`,
  });

  return <div>{/* seu conteúdo */}</div>;
}

// ========================================
// 2. ADICIONAR STRUCTURED DATA (JSON-LD)
// ========================================

import { StructuredData, getOrganizationSchema, getPropertySchema } from "@/components/StructuredData";

export default function PropertyPage({ property }) {
  return (
    <div>
      <StructuredData schema={getPropertySchema(property)} />
      {/* seu conteúdo */}
    </div>
  );
}

// ========================================
// 3. USAR CONFIGURAÇÕES GLOBAIS DE SEO
// ========================================

import { SEO_CONFIG, PAGE_METADATA, getFullUrl } from "@/config/seo";

// Pegar URL completa
const url = getFullUrl("/imoveis"); // https://teomiprime.com.br/imoveis

// Pegar informações da empresa
const siteName = SEO_CONFIG.siteName; // "Teomi Prime"
const phone = SEO_CONFIG.contact.phone;
const email = SEO_CONFIG.contact.email;

// Pegar metadados de uma página específica
const homeTitle = PAGE_METADATA.home.title;
const homeDescription = PAGE_METADATA.home.description;

// ========================================
// 4. EXEMPLOS PRÁTICOS
// ========================================

// ---- EXEMPLO 1: Página About ----
import { useMetaTags } from "@/components/MetaTags";
import { PAGE_METADATA, SEO_CONFIG } from "@/config/seo";
import { StructuredData, getOrganizationSchema } from "@/components/StructuredData";

export default function About() {
  useMetaTags({
    title: PAGE_METADATA.about.title,
    description: PAGE_METADATA.about.description,
    keywords: PAGE_METADATA.about.keywords,
    url: "https://teomiprime.com.br/sobre",
    canonical: "https://teomiprime.com.br/sobre",
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

// ---- EXEMPLO 2: Página de Contact ----
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

// ---- EXEMPLO 3: Propriedade Individual com Schema Dinâmico ----
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

// ========================================
// 5. ADICIONAR IMAGENS COM SEO OTIMIZADO
// ========================================

// ❌ Ruim - sem alt text
<img src="/image.jpg" />

// ✅ Bom - com alt text descritivo
<img 
  src="/image.jpg"
  alt="Sala de estar luxuosa com piso de mármore e janelas panorâmicas"
  loading="lazy"
/>

// ✅ Melhor - com responsividade
<img 
  srcSet="image-small.jpg 480w, image-large.jpg 1200w"
  sizes="(max-width: 600px) 480px, 1200px"
  alt="Sala de estar luxuosa com piso de mármore e janelas panorâmicas"
  loading="lazy"
/>

// ========================================
// 6. ADICIONAR HEADINGS SEMÂNTICOS
// ========================================

// ✅ Bom - estrutura hierárquica correta
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

// ========================================
// 7. ADICIONAR CANONICAL URL
// ========================================

// Já é feito automaticamente no useMetaTags(),
// mas você pode passar manualmente se precisar:

useMetaTags({
  title: "...",
  description: "...",
  canonical: "https://teomiprime.com.br/imovel/123", // customizar
});

// ========================================
// 8. ADICIONAR BREADCRUMB SCHEMA
// ========================================

import { getBreadcrumbSchema } from "@/components/StructuredData";

const breadcrumbs = [
  { name: "Home", url: "https://teomiprime.com.br/" },
  { name: "Imóveis", url: "https://teomiprime.com.br/imoveis" },
  { name: "Apartamentos", url: "https://teomiprime.com.br/imoveis?tipo=apartamento" },
  { name: "Cobertura Morumbi", url: "https://teomiprime.com.br/imovel/123" },
];

<StructuredData schema={getBreadcrumbSchema(breadcrumbs)} />

// ========================================
// 9. ADICIONAR FAQ SCHEMA (para FAQ page)
// ========================================

import { getFAQSchema } from "@/components/StructuredData";

const faqItems = [
  {
    question: "Como faço para comprar um imóvel com a Teomi Prime?",
    answer: "Entre em contato conosco para agendar uma consulta com um de nossos especialistas...",
  },
  {
    question: "Vocês trabalham com financiamento?",
    answer: "Sim, temos parcerias com os principais bancos para facilitar sua compra...",
  },
];

<StructuredData schema={getFAQSchema(faqItems)} />

// ========================================
// 10. ATUALIZAR CONFIGURAÇÕES GLOBAIS
// ========================================

// Arquivo: src/config/seo.ts

export const SEO_CONFIG = {
  siteName: "Teomi Prime",
  siteUrl: "https://teomiprime.com.br", // ✅ Atualizar com URL real
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
    email: "contato@teomiprime.com.br", // ✅ Atualizar
    address: "São Paulo, SP, Brasil",
  },

  ogImage: {
    url: "https://teomiprime.com.br/og-image.jpg", // ✅ Criar arquivo og-image.jpg
    width: 1200,
    height: 630,
    type: "image/jpeg",
  },
};

// ========================================
// 11. ADICIONAR ATRIBUTOS ARIA
// ========================================

// ❌ Ruim - sem acessibilidade
<button>
  <MenuIcon />
  Menu
</button>

// ✅ Bom - com aria-hidden
<button>
  <MenuIcon aria-hidden="true" />
  Menu
</button>

// ✅ Bom - com aria-label
<div aria-label="Navegação principal">
  <nav>{/* conteúdo */}</nav>
</div>

// ✅ Bom - com role
<div role="region" aria-label="Imóveis em destaque">
  {/* lista de imóveis */}
</div>

// ========================================
// 12. TESTAR META TAGS
// ========================================

/*
No navegador (após implementar):

1. Abra F12 (DevTools)
2. Vá para aba Elements
3. Procure no <head>:
   - <title>Seu Título - Teomi Prime</title>
   - <meta name="description" content="...">
   - <meta property="og:title" content="...">
   - <meta name="twitter:card" content="summary_large_image">
   - <link rel="canonical" href="...">
   - <script type="application/ld+json">{ organização/propriedade }</script>

4. Ou use ferramentas online:
   - opengraph.xyz (visualizar em redes sociais)
   - schema.org/validator (validar JSON-LD)
   - search.google.com/test/mobile-friendly (mobile)

*/

// ========================================
// 13. INTEGRAR COM GOOGLE SEARCH CONSOLE
// ========================================

/*
1. Acessar: https://search.google.com/search-console
2. Selecionar "Adicionar propriedade"
3. Colar URL: https://teomiprime.com.br
4. Selecionar "Verificar"
5. Copiar meta tag: <meta name="google-site-verification" content="..." />
6. Colar em index.html dentro de <head>
7. Após verificado, submeter sitemap.xml
8. Monitorar cobertura e performance
*/

// ========================================
// 14. PERFORMANCE & OPTIMIZATION
// ========================================

// ✅ Lazy loading de componentes (já implementado)
const Properties = lazy(() => import("./pages/Properties"));

// ✅ Lazy loading de imagens
<img loading="lazy" src={image} alt={description} />

// ✅ Code splitting automático com Vite (já configurado)

// ✅ Minificação (Vite faz automaticamente no build)

// ========================================
// 15. CHECKLIST FINAL
// ========================================

/*
- [ ] Todas as páginas têm useMetaTags() implementado
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
*/

// ========================================
// FIM DO GUIA
// ========================================

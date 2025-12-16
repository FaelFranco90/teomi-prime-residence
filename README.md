# Teomi Prime - Imóveis de Luxo e Exclusividade

## 📍 Projeto

**URL**: https://prime.teomiimoveis.com.br

Especialista em imóveis de altíssimo padrão com exclusividade e discrição.

## 🚀 Como Começar

### Requisitos
- Node.js 16+ e npm (ou Bun)

### Instalação
```sh
# Clonar repositório
git clone <GIT_URL>

# Navegar até a pasta
cd teomi-prime-residence

# Instalar dependências
npm install
# ou
bun install
```

### Desenvolvimento
```sh
# Iniciar servidor de desenvolvimento
npm run dev
# ou
bun run dev
```

### Build para Produção
```sh
# Fazer build
npm run build
# ou
bun run build

# Preview do build
npm run preview
```

## 🛠️ Tecnologias Utilizadas

- **Vite** - Build tool rápido
- **TypeScript** - Tipagem estática
- **React 18** - Framework UI
- **Tailwind CSS** - Estilização
- **shadcn-ui** - Componentes
- **Supabase** - Backend/Database
- **React Query** - State management
- **React Router** - Routing

## 🔍 SEO & Otimizações

Este projeto inclui implementação completa de SEO:
- ✅ Meta tags dinâmicas por página
- ✅ Open Graph para redes sociais  
- ✅ JSON-LD Structured Data
- ✅ Sitemap XML e Robots.txt
- ✅ Canonical URLs
- ✅ Acessibilidade (WCAG)
- ✅ Performance otimizada
- ✅ Mobile responsive

**Documentação SEO:**
- [README_SEO.md](./README_SEO.md) - Visão geral
- [SEO_SUMMARY.md](./SEO_SUMMARY.md) - Resumo executivo
- [SETUP_SEO.md](./SETUP_SEO.md) - Configuração passo a passo
- [CHECKLIST_SEO.md](./CHECKLIST_SEO.md) - Checklist completo

## 📁 Estrutura do Projeto

```
src/
├── pages/              # Páginas (Home, Properties, etc)
├── components/         # Componentes reutilizáveis
│   ├── MetaTags.tsx    # Hook de meta tags SEO
│   └── StructuredData.tsx # JSON-LD schemas
├── config/
│   └── seo.ts          # Configuração centralizada SEO
├── hooks/              # Hooks customizados
├── lib/                # Funções utilitárias
└── integrations/       # Integrações (Supabase)
```

## 🌐 Deployment

### Para Vercel
```bash
vercel deploy
```

### Para Netlify
```bash
netlify deploy
```

### Para servidor próprio
```bash
npm run build
# Fazer upload da pasta 'dist' para seu servidor
```

## 📚 Documentação Adicional

- [SEO_IMPROVEMENTS.md](./SEO_IMPROVEMENTS.md) - Detalhes técnicos
- [SEO_USAGE_GUIDE.md](./SEO_USAGE_GUIDE.md) - Exemplos de código

## 📞 Contato & Informações

- **Email**: contato@teomiimoveis.com.br
- **Website**: https://prime.teomiimoveis.com.br
- **Localização**: São Paulo, SP - Brasil

---

**Desenvolvido com ❤️ por Teomi Prime**


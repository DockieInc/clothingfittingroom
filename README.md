# Clothing Fitting Room - Provador Virtual

Uma aplicacao web moderna de provador virtual de roupas construida com **Next.js 15**, **TypeScript** e **Tailwind CSS v4**.

## Funcionalidades

- **Pagina Inicial** - Hero section com destaques e catalogo resumido
- **Catalogo Completo** - Busca e filtros por categoria em tempo real
- **Provador Virtual** - Visualize pecas com zoom, rotacao e selecao de tamanho
- **Design Responsivo** - Funciona perfeitamente em mobile, tablet e desktop
- **Dark Mode** - Suporte automatico ao tema escuro do sistema

## Tecnologias

- [Next.js 15](https://nextjs.org/) - Framework React com App Router
- [TypeScript](https://www.typescriptlang.org/) - Tipagem estatica
- [Tailwind CSS v4](https://tailwindcss.com/) - Estilizacao utility-first
- [Lucide React](https://lucide.dev/) - Icones modernos

## Como rodar

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para producao
npm run build

# Iniciar em producao
npm start
```

O servidor de desenvolvimento roda em [http://localhost:3000](http://localhost:3000).

## Estrutura do Projeto

```
src/
  app/
    page.tsx            # Pagina inicial
    layout.tsx          # Layout principal
    globals.css         # Estilos globais + Tailwind
    catalog/
      page.tsx          # Catalogo de roupas
    fitting-room/
      page.tsx          # Provador virtual
  components/
    Navbar.tsx          # Barra de navegacao
    Footer.tsx          # Rodape
    ClothingCard.tsx    # Card de produto
  lib/
    data.ts             # Dados dos produtos
```

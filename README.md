## Rodando o projeto

### Primeira vez

1. **Instale as dependências:**
```bash
npm install
```

2. **Configure as variáveis de ambiente (opcional):**
   - Se houver um arquivo `.example.env`, renomeie para `.env` e preencha as variáveis de ambiente
   - Para este projeto, o banco SQLite será criado automaticamente

3. **Banco de dados:**
   - O banco de dados SQLite (`sqlite.db`) é criado automaticamente na primeira execução
   - As tabelas são criadas automaticamente quando o servidor inicia
   
   **Opcional - Usando Drizzle Kit (para migrations):**
   ```bash
   # Gerar migrations baseadas no schema
   npm run db:generate
   
   # Aplicar migrations ao banco
   npm run db:push
   ```

4. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

O projeto estará disponível em [http://localhost:3000](http://localhost:3000)

### Scripts disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter
- `npm run db:generate` - Gera migrations do Drizzle
- `npm run db:push` - Aplica mudanças do schema ao banco

## Sobre o projeto

Este é um projeto de gerenciamento de tarefas dinamico, criado com Next.js, Shadcn, Tailwind CSS, Drizzle ORM e Better Auth.

## Tecnologias usadas

- Next.js: Framework para construção de aplicações web modernas e performáticas.
- Shadcn: Biblioteca de componentes UI para React.(com uma maturidade muito alta)
- Tailwind CSS: Framework de CSS utilitário para estilização rápida e consistente.
- Drizzle ORM: Biblioteca para ORM para SQLite.(Tive de estudar muito para entender como funciona e como usar.)
- Better Auth: Biblioteca para autenticação e autorização.(Foi a primeira vez que uso uma biblioteca de autenticação e autorização e foi muito facil de usar.)

## Decisões Arquiteturais:
  Este projeto foi desenvolvido com base em várias decisões arquiteturais, aqui estão algumas das principais:

  ### **Autenticação:**
  
  Inicialmente, o projeto foi planejado para usar **Better Auth** como biblioteca principal de autenticação. Durante o desenvolvimento, aprendi muito sobre o Better Auth através de:
  - Documentação oficial
  - Vídeos tutoriais
  - Exemplos de código da comunidade
  
  No entanto, após experimentar com o Better Auth, decidimos implementar uma solução customizada de autenticação que melhor se adequava às necessidades do projeto:
  
  **Solução implementada:**
  - **JWT (JSON Web Tokens)** usando a biblioteca `jose` para criação e verificação de tokens
  - **Sessões no banco de dados** (tabela `sessions`) para rastreamento e controle de sessões ativas
  - **Cookies HTTP-only** para armazenamento seguro do token no cliente
  - **tRPC** para gerenciar as rotas de autenticação (signIn, signUp, signOut, getCurrentUser)
  
  **Por que essa decisão?**
  - Maior controle sobre o fluxo de autenticação
  - Integração mais simples com o Drizzle ORM já utilizado no projeto
  - Flexibilidade para customizar comportamentos específicos
  - Melhor alinhamento com a arquitetura tRPC escolhida
  
  **Aprendizados:**
  - Gerenciamento de sessões com expiração
  - Uso de cookies HTTP-only para segurança
  - Proteção de rotas com middleware customizado
  - Integração de autenticação com tRPC e Next.js App Router
  
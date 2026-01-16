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

Este é um projeto de gerenciamento de tarefas dinamico, criado com Next.js, Shadcn, Tailwind CSS, Drizzle ORM, tRPC e Better Auth.

## Tecnologias usadas

- Next.js: Framework para construção de aplicações web modernas e performáticas.
- Shadcn: Biblioteca de componentes UI para React.(com uma maturidade muito alta)
- Tailwind CSS: Framework de CSS utilitário para estilização rápida e consistente.
- Drizzle ORM: Biblioteca para ORM para SQLite.(Tive de estudar muito para entender como funciona e como usar.)
- tRPC: Biblioteca para gerenciar as rotas de autenticação e as rotas de tarefas.(Foi a primeira vez que uso uma biblioteca de gerenciamento de rotas e foi muito facil de usar.)
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
  
  ### **Persistência de Dados e Database:**

  Assim como com a autenticação, não tinha conhecimento prévio sobre ORMs e persistência de dados. O aprendizado foi feito através de:
  - Documentação oficial do Drizzle ORM
  - Vídeos tutoriais sobre ORMs e SQLite
  - Exemplos de código e projetos da comunidade
  - Experimentação prática durante o desenvolvimento

  **Solução implementada:**
  - **SQLite** como banco de dados relacional
    - Banco de dados embutido, sem necessidade de servidor separado
    - Arquivo único (`sqlite.db`) fácil de gerenciar e fazer backup
    - Ideal para projetos de pequeno a médio porte
  - **Drizzle ORM** para gerenciamento de dados
    - Type-safe queries com TypeScript
    - Schema definido em código TypeScript (`src/lib/db/schema.ts`)
    - Migrations automáticas ou manuais via Drizzle Kit
    - Integração nativa com TypeScript para type inference

  **Estrutura do banco:**
  - **Tabela `users`**: Armazena informações dos usuários (id, email, name, password)
  - **Tabela `sessions`**: Gerencia sessões de autenticação com tokens JWT
  - **Tabela `tasks`**: Armazena as tarefas dos usuários com relacionamento (foreign key)

  **Inicialização automática:**
  - As tabelas são criadas automaticamente na primeira execução através de SQL direto
  - Isso simplifica o setup inicial, sem necessidade de rodar migrations manualmente
  - O arquivo `src/lib/db/index.ts` contém a lógica de inicialização

  **Por que essa decisão?**
  - **Simplicidade**: SQLite não requer configuração de servidor de banco de dados
  - **Type Safety**: Drizzle ORM oferece type safety completo com TypeScript
  - **Integração**: Funciona perfeitamente com tRPC e Next.js
  - **Performance**: SQLite é rápido para operações locais e desenvolvimento
  - **Portabilidade**: O banco é um único arquivo, fácil de versionar e fazer backup
  - **Aprendizado**: Permitiu entender conceitos de ORM, migrations e relacionamentos

  **Aprendizados:**
  - Como definir schemas de banco de dados usando Drizzle ORM
  - Criação de relacionamentos entre tabelas (foreign keys)
  - Uso de migrations para versionamento do schema
  - Type inference automático do TypeScript a partir do schema
  - Queries type-safe com Drizzle (select, insert, update, delete)
  - Gerenciamento de timestamps e tipos de dados
  - Inicialização automática de banco de dados em aplicações Node.js
  
  ### **tRPC (Type-Safe API):**

  Assim como com autenticação e persistência de dados, não tinha conhecimento prévio sobre tRPC. O aprendizado foi feito através de:
  - Documentação oficial do tRPC
  - Vídeos tutoriais sobre tRPC e APIs type-safe
  - Exemplos de código e projetos da comunidade
  - Experimentação prática durante o desenvolvimento

  **Solução implementada:**
  - **tRPC** como camada de API type-safe
    - APIs totalmente type-safe do servidor ao cliente
    - Type inference automático do TypeScript
    - Integração nativa com React Query para cache e sincronização
    - Validação de dados com Zod integrada

  **Estrutura do tRPC no projeto:**
  - **Context** (`src/lib/trpc/context.ts`): Define o contexto compartilhado entre todas as rotas (banco de dados, sessão, cookies)
  - **Init** (`src/lib/trpc/init.ts`): Inicializa o tRPC e define procedures (públicas e protegidas)
  - **Routers** (`src/lib/trpc/routers/`):
    - `auth.ts`: Rotas de autenticação (signUp, signIn, signOut, getCurrentUser)
    - `tasks.ts`: Rotas de gerenciamento de tasks (create, list, update, delete)
  - **Root Router** (`src/lib/trpc/root.ts`): Combina todos os routers em um único router principal
  - **Client** (`src/lib/trpc/client.ts`): Cliente React para uso no frontend
  - **Provider** (`src/lib/trpc/provider.tsx`): Provider React Query integrado com tRPC

  **Procedures:**
  - **`publicProcedure`**: Rotas públicas, acessíveis sem autenticação (ex: signUp, signIn)
  - **`protectedProcedure`**: Rotas protegidas, requerem autenticação (ex: getCurrentUser, tasks CRUD)
    - Middleware customizado que verifica a sessão antes de executar a rota
    - Retorna erro `UNAUTHORIZED` se o usuário não estiver autenticado

  **Integração com Next.js:**
  - Rota API em `src/app/api/trpc/[trpc]/route.ts` usando Next.js App Router
  - Handler que processa requisições GET e POST do tRPC
  - Context assíncrono para acessar cookies e sessão do Next.js

  **Por que essa decisão?**
  - **Type Safety End-to-End**: TypeScript garante tipos corretos do servidor ao cliente
  - **DX (Developer Experience)**: Autocomplete e type checking em tempo de desenvolvimento
  - **Validação Integrada**: Zod valida automaticamente os dados de entrada
  - **Sem Geração de Código**: Não precisa gerar tipos manualmente, tudo é inferido
  - **Integração com React Query**: Cache automático, refetch, e sincronização de estado
  - **Menos Boilerplate**: Menos código comparado a REST APIs tradicionais
  - **Aprendizado**: Permitiu entender conceitos de APIs type-safe e RPC

  **Aprendizados:**
  - Como criar APIs type-safe do servidor ao cliente
  - Estruturação de routers e procedures no tRPC
  - Criação de context compartilhado para rotas
  - Implementação de middleware para proteção de rotas
  - Integração do tRPC com Next.js App Router
  - Uso de React Query com tRPC para gerenciamento de estado
  - Validação de dados com Zod integrada ao tRPC
  - Type inference automático e como aproveitar ao máximo
  - Tratamento de erros customizado com TRPCError
  - Diferença entre queries (leitura) e mutations (escrita) no tRPC
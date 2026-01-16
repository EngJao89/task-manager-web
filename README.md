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

# TMDB — Busca e Descoberta de Filmes

Aplicação web fullstack para descobrir e buscar filmes usando a API do The Movie Database (TMDB). Inclui backend HTTP em Express, banco MongoDB, cache em Redis e autenticação por JWT.

## Disciplina
- Universidade Tecnológica Federal do Paraná — Campus Cornélio Procópio
- ES47B-ES71 — Programação Web Fullstack
- Prof. Dr. Willian Massami Watanabe

## Funcionalidades
- Login com usuário e senha.
- Busca de filmes com filtros e paginação, integrada à API do TMDB.
- Watchlist pessoal: salvar, buscar, marcar como assistido, editar observação e remover filmes.
- Cache de respostas do TMDB no Redis.

## Stack
- **Front-end:** React 19, Vite 8, MaterialUI 9, React Compiler.
- **Back-end:** Node.js, Express, Mongoose, ioredis, JWT, bcrypt, helmet, compression, express-validator, pino.
- **Infraestrutura local:** MongoDB 7 e Redis 7 via Docker Compose.

## Estrutura
```
frontend/              # SPA React
backend/               # API Express
  src/
    config/            # env, db, redis, logger
    models/            # Mongoose schemas
    routes/            # rotas + controladores inline
docker-compose.yml     # Mongo + Redis
```

## Como rodar
1. Subir a infraestrutura:
   ```bash
   docker compose up -d
   ```
2. Instalar dependências (instala os dois workspaces):
   ```bash
   npm install
   ```
3. Configurar o backend:
   ```bash
   cp backend/.env.example backend/.env
   ```
   Preencha `JWT_SECRET` (gerar com `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) e `TMDB_API_KEY` (obter em https://www.themoviedb.org/settings/api).
4. Criar o usuário inicial:
   ```bash
   npm run seed
   ```
   Credenciais padrão: `admin` / `admin123` (configuráveis em `backend/.env`).
5. Subir a aplicação:
   ```bash
   npm run dev
   ```
   Frontend: http://localhost:5173 · Backend: http://localhost:3000/api

## Critérios atendidos
- Estrutura de pastas conforme `doc_entrega1.pdf` e `doc_entrega2.pdf`.
- Login, busca e inserção implementados.
- Validação de campos no servidor com `express-validator`.
- API no padrão REST.
- Segurança: bcrypt, JWT com `jti` e blacklist no Redis, rate-limit no login, `helmet`, sanitização contra injeção e XSS, logs de auditoria com `pino`.
- Compressão: `compression` no backend e gzip nos arquivos estáticos via Nginx no deploy.
- Cache de respostas do TMDB no Redis com invalidação na inserção.
- Pool de conexões do MongoDB configurado explicitamente.

## Vídeo de apresentação
Roteiro de até 3 minutos disponível ao final do projeto.

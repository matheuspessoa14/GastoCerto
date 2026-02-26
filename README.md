# 💸 GastoCerto

**GastoCerto** é uma aplicação web **full stack** para controle financeiro pessoal, desenvolvida com foco em simplicidade, clareza e visual moderno.

O objetivo do projeto é ajudar o usuário a registrar seus gastos, visualizar resumos por período e identificar padrões de consumo de forma prática e intuitiva.

Este projeto foi desenvolvido como parte do meu **portfólio para vagas de estágio/júnior em tecnologia**, demonstrando domínio de backend, frontend e integração via API.

---

## 🧠 Visão de problema → solução

### Problema
Muitas pessoas não têm um controle claro de onde gastam seu dinheiro mensalmente, o que dificulta o planejamento financeiro.

### Solução
O **GastoCerto** permite registrar gastos de forma rápida e oferece um dashboard com resumos e insights, facilitando a análise e a tomada de decisão financeira.

---

## 🚀 Funcionalidades

### 🔐 Autenticação
- Cadastro de usuário
- Login e logout com sessão
- Proteção de rotas no backend

### 💰 Gastos
- Criar gasto (valor, categoria e descrição)
- Editar gastos existentes
- Excluir gastos
- Listagem de gastos por **mês e ano**
- Confirmação antes da exclusão

### 📊 Dashboard
- Total gasto no período
- Resumo por categoria
- Top 3 categorias com maior gasto
- Insight automático da categoria mais impactante
- Filtro por mês e ano

### 🎨 Interface
- Design moderno (fintech / tech)
- Tema escuro
- Layout em cards
- UX simples e objetiva

---

## 🛠️ Tecnologias utilizadas

### Backend
- Python
- Flask
- Flask-Login
- Flask-CORS
- SQLAlchemy
- SQLite
- Arquitetura Application Factory
- Blueprints

### Frontend
- React (Vite)
- JavaScript (ES6+)
- Axios
- CSS customizado
- Google Fonts (Inter)

---

## 📡 Principais endpoints da API

### 🔐 Autenticação
- POST /api/auth/register → Criar usuário
- POST /api/auth/login → Login
- POST /api/auth/logout → Logout
- GET /api/auth/me → Sessão atual

### 💰 Gastos
- GET /api/gastos → Listar gastos (com filtro por mês/ano)
- POST /api/gastos → Criar gasto
- PUT /api/gastos/<id> → Editar gasto
- DELETE /api/gastos/<id> → Remover gasto
- GET /api/gastos/summary → Resumo mensal (dashboard)

---

## ▶️ Como rodar o projeto localmente

### 🔹 Back-end

- cd backend
- python -m venv venv
- pip install flask flask-login flask-sqlalchemy flask-cors flask-migrate python-dotenv
- pip install -r requirements.txt
- python run.py

### 🔹 Front-end

- cd frontend
- npm install
- npm run dev

### 🔹 LocalHost:

- Back-End = http://localhost:5000
- Front-End = http://localhost:5173

---

## 👨‍💻 Autor

- Matheus Pessoa Telles
- Estudante de Análise e Desenvolvimento de Sistemas - 4 período

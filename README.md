<div align="center">
  <img src='https://fumechub.vercel.app/logo.png' width="250px" />

  <h2>Plataforma de comunicação acadêmica para estudantes da Universidade FUMEC.</h2>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/PostgreSQL-17-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Sequelize-6-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white" alt="Sequelize">
</p>

API responsável pelo back-end do **Fumec Hub**, uma plataforma de comunicação acadêmica desenvolvida para estudantes da Universidade FUMEC.

O sistema fornece autenticação, gerenciamento de usuários e amizades, chats, mensagens em tempo real e comunicação através de WebSockets.

---

## 📇 Índice

* [🧠 Sobre o projeto](#-sobre-o-projeto)
* [⚙️ Tecnologias utilizadas](#tecnologias-utilizadas)
* [🏗️ Arquitetura](#arquitetura)
* [🔐 Autenticação](#autenticação)
* [💬 Comunicação em tempo real](#comunicação-em-tempo-real)
* [📚 Documentação da API](#documentação-da-api)
* [🚀 Deploy](#deploy)
* [🚀 Como rodar o projeto](#como-rodar-o-projeto)
* [🌱 Fluxo de desenvolvimento](#fluxo-de-desenvolvimento)

---

## 🧠 Sobre o projeto

O **Fumec Hub Back-End** é responsável por fornecer a API e toda a lógica de negócio utilizada pelo Front-End da aplicação.

Entre suas principais funcionalidades estão:

* Cadastro e autenticação de usuários;
* Controle de sessão através de JWT;
* Proteção de rotas;
* Gerenciamento de amizades;
* Criação e gerenciamento de chats;
* Envio e persistência de mensagens;
* Comunicação em tempo real através de WebSockets;
* Notificações de novas mensagens;
* Integração com banco de dados PostgreSQL.

O projeto foi desenvolvido utilizando uma arquitetura organizada em **rotas, controllers, services, models e middlewares**, buscando manter as responsabilidades separadas e facilitar a manutenção da aplicação.

---

## ⚙️ Tecnologias utilizadas

### Back-End

* **Node.js**
* **Express**
* **JavaScript**
* **Sequelize**

### Banco de dados

* **PostgreSQL**
* **Supabase**

### Autenticação e segurança

* **JSON Web Token (JWT)**
* **HTTP Cookies**
* **bcrypt**
* **express-rate-limit**
* **CORS**

### Comunicação

* **REST API**
* **WebSocket**

### Documentação

* **Swagger / OpenAPI**

### Deploy e ferramentas

* **Render**
* **Git**
* **GitHub**
* **Visual Studio Code**

---

## 🏗️ Arquitetura

O projeto utiliza uma estrutura organizada por responsabilidades:

```text
Fumec-Hub-BackEnd/
│
├── Config/
│   └── database.js
│
├── Controllers/
│   ├── authController.js
│   ├── chatController.js
│   ├── friendshipController.js
│   ├── messageController.js
│   └── userController.js
│
├── Middlewares/
│   ├── authMiddleware.js
│   └── errorHandler.js
│
├── Models/
│   ├── Chat.js
│   ├── Friendship.js
│   ├── Message.js
│   └── User.js
│
├── Routes/
│   ├── auth.routes.js
│   ├── chat.routes.js
│   ├── friendship.routes.js
│   ├── message.routes.js
│   └── user.routes.js
│
├── Services/
│   ├── authService.js
│   ├── chatService.js
│   ├── friendshipService.js
│   ├── messageService.js
│   └── userService.js
│
├── Sockets/
│   └── socket.js
│
├── .env.example
├── server.js
├── swagger.js
└── package.json
```

> A estrutura pode evoluir conforme novas funcionalidades forem adicionadas ao projeto.

---

## 🔐 Autenticação

A autenticação da aplicação utiliza **JWT (JSON Web Token)** armazenado em cookies HTTP.

O processo utiliza dois tokens:

* **Access Token:** utilizado para autenticar as requisições protegidas.
* **Refresh Token:** utilizado para renovar o Access Token após sua expiração.

Os tokens são armazenados em **cookies HTTP-only**, impedindo que sejam acessados diretamente pelo JavaScript do navegador.

### Fluxo de autenticação

```text
Cliente
   │
   │ Login
   ▼
POST /auth/login
   │
   ▼
Auth Controller
   │
   ▼
Auth Service
   │
   ▼
Validação das credenciais
   │
   ▼
JWT
   │
   ├── Access Token
   └── Refresh Token
          │
          ▼
       Cookies
```

As rotas protegidas utilizam um middleware responsável por verificar a autenticação do usuário.

---

## 💬 Comunicação em tempo real

O Fumec Hub utiliza **WebSocket** para funcionalidades que precisam de comunicação em tempo real.

Atualmente, o WebSocket é utilizado principalmente para:

* Envio de mensagens;
* Recebimento de mensagens;
* Entrada e saída de chats;
* Notificações de novas mensagens;
* Comunicação entre usuários conectados.

As mensagens também são persistidas no PostgreSQL, permitindo que o histórico continue disponível mesmo após o usuário se desconectar.

---

## 📚 Documentação da API

A API possui documentação utilizando **Swagger/OpenAPI**.

Após iniciar o servidor, a documentação pode ser acessada através de:

```text
/api-docs
```

A documentação permite visualizar e testar os endpoints disponibilizados pela API.

---

## 🚀 Deploy

O Back-End está hospedado utilizando o **Render**.

### API

https://fumec-hub-backend.onrender.com/

### Banco de dados

O banco PostgreSQL utilizado pela aplicação é hospedado através do **Supabase**.

---

## 🚀 Como rodar o projeto

### 1. Clone o repositório

```bash
git clone git@github.com:jpjotz/Fumec-Hub-BackEnd.git
```

### 2. Acesse a pasta

```bash
cd Fumec-Hub-BackEnd
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto.

Utilize o `.env.example` como referência:

```env
NODE_ENV=development

PORT=3000

DB_PASSWORD=
DB_PORT=
DB_HOST=
DB_NAME=
DB_USER=

JWT_SECRET=
JWT_REFRESH_SECRET=
```

Preencha as variáveis com as informações do seu ambiente.

> O arquivo `.env` não deve ser versionado no Git.

### 5. Execute o servidor

```bash
npm start
```

O servidor será iniciado na porta configurada no arquivo `.env`.

---

## 🌱 Fluxo de desenvolvimento

O projeto utiliza um fluxo de Git simplificado:

```text
feature/*
     │
     ▼
development
     │
     ▼
main
```

### Branch `feature/*`

Utilizada para desenvolver novas funcionalidades ou correções.

Exemplo:

```text
feature/swagger
feature/chat
feature/friendship
```

### Branch `development`

Utilizada para integração e testes das funcionalidades antes da publicação.

### Branch `main`

Contém a versão estável do projeto utilizada em produção.

---

## 👨‍💻 Desenvolvedor

**João Pedro**

Ciência da Computação — Universidade FUMEC

GitHub: https://github.com/jpjotz

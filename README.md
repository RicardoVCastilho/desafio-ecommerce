## Ecommerce-desafio
 Este projeto é uma API RESTful desenvolvida com NestJS, TypeScript e PostgreSQL, que implementa o backend completo de um ecommerce. A API permite a gestão integral de usuários, clientes, categorias de produtos, produtos, pedidos e itens dos pedidos, além de gerar relatórios de vendas em arquivos no formato CSV.

## 🚀Tecnologias utilizadas

- Typescript;
- Javascript;
- Node.JS;
- NestJS: Framework do Node.JS;
- TypeORM: Mapeador de objeto relacional (Facilita a interação com bancos de dados, através de classes e objetos);
- Dotenv: Carrega variáveis de ambiente a partir de um arquivo .env;
- JWT Authenticator: Mecanismo para autenticação baseado em tokens JSON Web Tokens (JWT) que permitem segurança e sessões sem estado;
- Bcrypt: Biblioteca para hashear senhas de forma segura, protegendo dados sensíveis;
- Nodemailer: Biblioteca para enviar e-mails programaticamente a partir do Node.js;
- CSV-writer: Biblioteca para gerar arquivos CSV a partir de dados estruturados;
- Jest: Testes Unitários automatizados;
- Swagger: Ferramenta para gerar documentação interativa da API, facilitando testes e integração.

## ⚙️ Estrutura do projeto

```bash
ecommerce-desafio/
├── db/
│   ├── migrations/                # Arquivos de migração do banco de dados
│   └── data.source.ts             # Configuração da fonte de dados (TypeORM)
│
├── dist/                          # Código transpilado para produção
├── node_modules/                  # Dependências do projeto
│
├── src/
│   ├── categories/                # Módulo de Categorias de Produtos
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── categories.controller.ts
│   │   ├── categories.module.ts
│   │   └── categories.service.ts
│   │
│   ├── clients/                   # Módulo de Clientes
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── clients.controller.ts
│   │   ├── clients.module.ts
│   │   └── clients.service.ts
│   │
│   ├── order-items/               # Módulo de Itens dos Pedidos
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── order-items.controller.ts
│   │   ├── order-items.module.ts
│   │   └── order-items.service.ts
│   │
│   ├── orders/                    # Módulo de Pedidos
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── orders.controller.ts
│   │   ├── orders.module.ts
│   │   └── orders.service.ts
│   │
│   ├── products/                  # Módulo de Produtos
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── products.controller.ts
│   │   ├── products.module.ts
│   │   └── products.service.ts
│   │
│   ├── sales_reports/            # Módulo de Relatórios de Venda (CSV)
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── sales_reports.controller.ts
│   │   ├── sales_reports.module.ts
│   │   └── sales_reports.service.ts
│   │
│   ├── users/                     # Módulo de Usuários
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   └── users.service.ts
│   │
│   ├── common/                    # Utilitários e tipos comuns
│   ├── decorators/                # Decorators customizados
│   ├── guards/                    # Guards para autenticação/autorização
│   ├── middleware/                # Middlewares globais
│   ├── services/                  # Serviços compartilhados
│   ├── utils/                     # Funções auxiliares
│   ├── app.module.ts              # Módulo principal da aplicação
│   └── main.ts                    # Arquivo de bootstrap da aplicação
│
├── test/                          # Testes automatizados end 2 end (padrão do NestJS)
├── .env                           # Variáveis de ambiente
├── .gitignore                     # Arquivos e pastas ignorados pelo Git
├── .prettierrc                    # Configuração do Prettier
├── eslint.config.mjs             # Configuração do ESLint
├── nest-cli.json                  # Configuração do NestJS CLI
├── package.json                   # Dependências e scripts do projeto
├── package-lock.json              # Travamento de versões de dependências
├── README.md                      # Documentação do projeto
├── tsconfig.build.json            # Configuração do TypeScript para build
└── tsconfig.json                  # Configuração principal do TypeScript
```

## 📋 Como Rodar a API Localmente

```bash
1 - Clone o repositório:

2 - git clone https://github.com/SEU_USUARIO/softpet-api.git

3 - cd ecommerce-desafio

4 - Instale as dependências:

npm install
# ou
yarn install

5 - Configure o arquivo .env:
Crie um arquivo .env na raiz do projeto com as variáveis de ambiente:

env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=SUASENHAAQUI

DB_DATABASE=nome_do_banco

ACCESS_TOKEN_SECRET_KEY=SUA_CHAVE_SECRETA_AQUI
ACCESS_TOKEN_EXPIRE_TIME=30m

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=SENHA_DO_EMAIL

APP_URL=http://localhost:3000

6 - Substitua os valores pelos correspondentes ao seu banco de dados PostgreSQL;

7 - Inicie o servidor:

npm run start
# ou
yarn start

A API estará rodando em http://localhost:3000.

8 - Ao rodar o servidor, acesse a documentação da API para conferir todas as rotas em: http://localhost:3000/api/docs#/.
```

## 🧑‍💻 Entidades Principais

1 - Usuários:
Representa os usuários do sistema, responsáveis por autenticação e controle de acesso com 2 níveis: ADMIN | CLIENT;

2 - Clientes:
Extensão da entidade usuários. Registra informações dos clientes que realizam pedidos na loja;

3 - Categorias:
Classifica os produtos em diferentes grupos para melhor organização e busca;

4 - Produtos:
Contém detalhes dos produtos disponíveis para venda, incluindo preço, quantidade em estoque e até uma coluna para adicionar imagens dos produtos;

5 - Pedidos: Representa os pedidos realizados pelos clientes, contendo status, data, valor total e relacionamento com os itens do pedido.

6 - Itens do Pedido:
Itens específicos de cada pedido, incluindo o produto, quantidade, preço unitário e subtotal.

7 - Relatórios de Vendas:
Gera relatórios com dados agregados de vendas, podendo ser baixados em arquivos CSV para análise.

## 📋 Principais Endpoints da API - Todos devidamente autenticados

### 👤 Usuários
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/v1/users/signup` | Cadastro de novo usuário |
| `POST` | `/api/v1/users/signin` | Login do usuário |
| `GET` | `/api/v1/users/all` | Listar todos os usuários |
| `GET` | `/api/v1/users/single/:id` | Buscar usuário por ID |
| `GET` | `/api/v1/users/:confirm-email` | Confirma o e-mail do usuário |
| `PATCH` | `/api/v1/users/:id` | Atualizar dados do usuário |
| `DELETE` | `/api/v1/users/:id` | Deletar usuário |

---

### 🧾 Clientes
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/v1/clients/all` | Listar todos os clientes |
| `POST` | `/api/v1/clients` | Cadastrar cliente |
| `GET` | `/api/v1/clients/single/:id` | Buscar cliente por ID |
| `PATCH` | `/api/v1/clients/:id` | Atualizar cliente |
| `DELETE` | `/api/v1/clients/:id` | Deletar cliente |

---

### 🗂️ Categorias
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/v1/categories/all` | Listar categorias |
| `POST` | `/api/v1/categories` | Cadastrar categoria |
| `GET` | `/api/v1/categories/single/:id` | Buscar categoria por ID |
| `PATCH` | `/api/v1/categories/:id` | Atualizar categoria |
| `DELETE` | `/api/v1/categories/:id` | Deletar categoria |

---

### 📦 Produtos
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/v1/products/all` | Listar produtos |
| `POST` | `/api/v1/products` | Cadastrar produto |
| `GET` | `/api/v1/products/single/:id` | Buscar produto por ID |
| `PATCH` | `/api/v1/products/:id` | Atualizar produto |
| `DELETE` | `/api/v1/products/:id` | Deletar produto |

---

### 🧾 Pedidos
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/v1/orders/all` | Listar pedidos |
| `POST` | `/api/v1/orders` | Criar pedido |
| `GET` | `/api/v1/orders/single/:id` | Buscar pedido por ID |
| `PATCH` | `/api/v1/orders/:id` | Atualizar pedido |
| `DELETE` | `/api/v1/orders/:id` | Deletar pedido |

---

### 📊 Relatórios de Vendas
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/v1/sales-reports` | Gerar relatório de vendas (CSV) |
| `GET` | `/api/v1/sales-reports/all` | Listar relatórios gerados |
| `GET` | `/api/v1/sales-reports/:id/download` | Fazer download de um relatório CSV |
| `GET` | `/api/v1/sales-reports/single/:id` | Lista um único relatório |

## 📌 Principais functionalidades

### 👤 Gestão de Usuários
- Cadastro de novos usuários com autenticação segura via JWT;
- Confirmação de cadastro através de e-mail enviado para o endereço cadastrado;
- Login de usuários com verificação de credenciais (email e senha hashada);
- Atualização e exclusão de contas;
- Listagem de todos os usuários cadastrados (com proteção de rotas);
- Controle de permissões para operações específicas (admin | client) = cliente pode criar conta, editar seus próprios dados, ver produtos e criar pedidos; O usuário do tipo admin tem acesso irrestrito - pode criar conta, deletar/editar todos os usuários e clientes, gerenciar produtos e gerenciar pedidos.

### 🧾 Cadastro de Clientes
- Criação de novos registros de clientes com dados completos (nome completo, endereço, contato e status no sistema ativo | inativo).
- Consulta individual ou geral dos clientes;
- Edição e exclusão de dados de clientes.


### 🗂️ Gerenciamento de Categorias
- Criação de categorias para organizar os produtos (função exclusiva para admin).
- Visualização, edição e exclusão de categorias.

### 📦 Controle de Produtos
- Cadastro completo de produtos com nome, descrição, preço, quantidade e categoria ( adição de categorias exclusiva admin).
- Consulta geral e detalhada de produtos.
- Atualização e exclusão de produtos.
- Organização dos produtos por categoria.

### 🧾 Registro de Pedidos
- Criação de pedidos com múltiplos produtos vinculados.
- Visualização de todos os pedidos realizados.
- Atualização e cancelamento de pedidos.
- Relacionamento entre clientes e pedidos.

### 📊 Geração de Relatórios de Vendas
- Geração de relatórios detalhados de vendas em formato CSV.
- Download e consulta de relatórios salvos.
- Visão geral para análise de desempenho comercial.

### 🔐 Autenticação & Autorização
- Implementação de autenticação com JWT.
- Proteção de rotas para garantir segurança dos dados.
- Verificação de permissões com base no tipo de usuário.
- Hash de senhas com o bcrypt.
- Confirmação de cadastrado através de e-mail de confirmaçào com o nodemailer.
----

##  Licença
Este projeto está licenciado sob a MIT License.
Se você quiser adicionar mais detalhes específicos ou ajustes, fique à vontade para editar!

## **Autor**
Projeto desenvolvido por [Ricardo Vitor Castilho](https://github.com/RicardoVCastilho)

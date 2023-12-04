# API de Autenticação
[![NPM](https://img.shields.io/npm/l/react)](https://github.com/jonatasdamata/autenticacao-node/blob/master/LICENSE) 

# Sobre o projeto
Bem-vindo à API de autenticação, uma aplicação RESTful para gerenciamento de usuários, incluindo funcionalidades de cadastro, autenticação e recuperação de informações. Esta API é construída com Node.js, Express, MongoDB e utiliza JSON Web Tokens (JWT) para autenticação.

## URLs das APIs:

-Página Inicial:

https://autenticacaonode-b379a61a797e.herokuapp.com/

-Página de Exemplo:

https://autenticacaonode-b379a61a797e.herokuapp.com/exemplo

-Página de Login: 

https://autenticacaonode-b379a61a797e.herokuapp.com/auth/login

-Página de Registro:

https://autenticacaonode-b379a61a797e.herokuapp.com/auth/register

-Página de Id:

https://autenticacaonode-b379a61a797e.herokuapp.com/user/656c805cb287714bb0c76ee5







## Página Inicial
![Route-public](https://github.com/jonatasdamata/autenticacao-node/assets/144968541/9d274f1e-fe21-4ccb-8029-be646a5af7ce)

## Route Private 
![Route-private](https://github.com/jonatasdamata/autenticacao-node/assets/144968541/1202592e-2fd0-491d-83cc-0aa02eedff2a)

## Login Realizado com Sucesso
![login-sucesso](https://github.com/jonatasdamata/autenticacao-node/assets/144968541/7e28c688-1b6c-4318-a79f-446b992b2ac3)

## Login Usuário não encontrado
![login-usuario-invalido](https://github.com/jonatasdamata/autenticacao-node/assets/144968541/d347bfc2-dec1-4d23-aa76-107946e3f357)

## Usuário Cadastrado com Sucesso
![usuario-criado-sucesso](https://github.com/jonatasdamata/autenticacao-node/assets/144968541/5c69f3de-3598-4a9c-b092-4a324e4df8b6)

## Usuário Cadastro - Erro - Usuário já existe
![usuario-email-ja-existe](https://github.com/jonatasdamata/autenticacao-node/assets/144968541/37a32b36-5b18-4869-9f88-f70da98ec7e1)



# Requisitos Técnicos

-Node.js

-MongoDB

-Express

-JSON Web Tokens (JWT)

-bcrypt para criptografia

-dotenv para configuração de ambiente

-mongoose para modelagem e manipulação de dados no MongoDB

-nodemon para desenvolvimento

-Eslint para linting

-JWT como token.

-Testes unitários.

-Criptografia hash na senha e token.

** Hospedagem
Heroku




# Como executar o projeto

Pré-requisitos: npm / yarn

```bash
# clonar repositório
git clone https://github.com/jonatasdamata/autenticacao-node

# entrar na pasta do projeto 
cd autenticacao-node

# instalar dependências
npm install

Ou, se estiver usando Yarn:
yarn install

# Configure as Variáveis de Ambiente:
Certifique-se de criar um arquivo .env na raiz do projeto e configure as variáveis de ambiente conforme necessário.

# Execute o comando abaixo para iniciar o servidor:
npm start
ou, para Yarn:
yarn start

# Acesse a API:
Agora, você pode acessar a API usando as rotas definidas no código-fonte. Por exemplo, abra o navegador e vá para http://localhost:3000/ para ver a mensagem de boas-vindas.
```


Sinta-se à vontade para explorar o código conforme necessário, muito agradecido pela oportunidade!

# Autor

Jonatas da Mata

https://www.linkedin.com/in/jonatas-da-mata-16a752287/

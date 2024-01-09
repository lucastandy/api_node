Como rodar o projeto baixado?
Instale todas as dependências indicado pelo pachage.json
### npm install

Comando para rodar o projeto
### node.app.js

Comando que roda o projeto usando o nodemon
### nodemon app.js

Abrir o endereço no navegador para acessar a página inicial
### http://localhost:8090

Sequência para criar o projeto
Comando para criar o arquivo package
### npm init

Comando para instalar a dependência de forma global, "-g" significa globalmente. Execute este comando através do promt de comando. Execute somente se nunca instalou a dependência na máquina. Após a instalação, reinicie o PC.
### npm install --save express

Comando para rodar o prjeto
### node app.js

Dependência que serve para reiniciar o servidor sempre que houver alteração no código fonte.
### npm install -g nodemon

Instalando a dependência como desenvolvedor
### npm install --save-dev nodemon

Comando que roda o projeto usando o nodemon
### nodemon app.js

Abrir o endereço no navegador para acessar a página inicial
### http://localhost:8090

Comando SQL para criar a base de dados
### CREATE DATABASE celke_api CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

Sequelize é uma biblioteca JavaScript que facilita o gerenciamento do banco de dados SQL
### npm install --save sequelize

Instalar o drive do banco de dados (OBS: consulte a documentação sequelize para ver outros drives)
### npm install --save mysql2

Sequelize-cli interface de linha de comando usada para criar modelos, configurações e arquivos de migração para bancos de dados
### 

Iniciando o sequelize-cli e criando o arquivo config
### npx sequelize-cli init


Dependência para manipular variáveis de ambiente
### npm install dotenv --save

Criar a Models situacao
### npx sequelize-cli model:generate --name Situations --attributes nameSituation:string

Criar a Models usuários
### npx sequelize-cli model:generate --name Users --attributes name:string,email:string,situationId:integer

Comando para executar as migrations
### npx sequelize-cli db:migrate


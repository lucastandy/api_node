// Incluindo as bibliotecas
// Dependência que gerencia as requisições, rotas e URLs, entre outras funcionalidades
const express = require('express');

// Chamando a função express Router
const router = express.Router();

// Realizando a inclusão da conexão com o banco de dados
const db = require("../db/models"); // O node por padrão vai pegar o arquivo index.js, presente na pasta models.

// Criando a rota listar
// Endereço para acessar a api através de aplicação externa: http://localhost:8090/users?page=1
router.get("/users", async (req, res) => {

    // Recebendo o número da página. Quando não é enviado o número da página é atribuído a página 1.
    const {page = 1} = req.query;
    // console.log(page);

    // Indicando o limite de registros em cada página
    const limit = 40;

    // Variável com o número da última página
    var lastPage = 1;

    // Contando a quantidade de registros no banco de dados
    const countUser = await db.Users.count();

    // Acessa o IF quando encontrar registro no banco de dados
    if(countUser !== 0){
        // Calculando a última página
        lastPage = Math.ceil(countUser / limit);
        // console.log(lastPage);
    }else{
        // Retornando um objeto como resposta
        return res.status(40).json({
            error: true,
            message: "Erro: nenhum usuário encontrado!"
        });

    }

    // Recuperando todos os usuários do banco de dados
    const users = await db.Users.findAll({
        // Indicando quais colunas recuperar
        attributes: ['id','name','email','situationId'],
        // Ordenando os registros pela coluna id na forma descrescente
        order: [['id','DESC']],
        // Buscando dados na tabela secundária
        include:[{
            model:db.Situations,
            attributes: ['nameSituation']
        }],
        // Calcular a partir de qual registro deve retornar e o limite de registros
        offset: Number ((page * limit) -limit),
        limit: limit

    });

    // Acessa o if se encontrar o registro no banco de dados
    if(users){
        // Retornando um objeto como resposta
        return res.json({
            error: false,
            users
        });
    }else{
        // Retornando um objeto como resposta
        return res.status(400).json({
            error: true,
            message: "Erro: nenhum usuário encontrado!"
        });
    }
});

// Criação da rota visualizar
router.get("/users/:id", async (req, res) =>{
    
    // Usando a desestruturação para simplificar a atribuição do parâmetro
    const {id} = req.params; // Ex.: http://localhost:8090/users/1

    // Recuperando os registros do banco de dados
    const user = await db.Users.findOne({
        attributes: ['id','name','email','situationId','createdAt','updatedAt'],
        // Acrescentando condição para indicar qual registro deve ser retornado do banco de dados
        where:{id},
        // Busca dados na tabela secudária
        include:[{
            model: db.Situations,
            attributes: ['nameSituation']
        }]
    });
    
    // Acessa o if se encontrar o registro no banco de dados
    if(user){
        // Retornando um objeto como resposta
        return res.json({
            error: false,
            user
        });
    }else{
        // Retornando um objeto como resposta
        return res.status(400).json({
            error: true,
            message: "Erro: usuário não encontrado!"
        });
    }

});

// Criando a rota cadastrar
/*
A aplicação externa deve indicar que está enviando os dados em formato de objeto:
Content-Type: application/json
Dados em formato de objeto

{
    "name" : "Lucas Tandy",
    "email": "lucastitandy@gmail.com",
    "situationId": 1
}

*/
router.post("/users", async (req, res) => {
    
    // Recebendo os dados enviados no corpo da requisição
    var data = req.body;

    // Salvando os dados no banco de dados
    await db.Users.create (data).then((dataUser) => {
        // Retornando um objeto como resposta
        return res.json({
            error: false,
            message: "Usuário cadastrado com sucesso!",
            dataUser
        });
    }).catch(() => {
        // Retornando um objeto como resposta
        return res.status(400).json({
            error: true,
            message: "Erro: usuário não cadastrado"
        });
    });

});

// Criando a rota editar
router.put("/users/", async (req, res) =>{

    // Recebendo os dados enviados no corpo da requisição
    const data = req.body;

    // Editando os dados no banco de dados
    await db.Users.update(data, {where: {id: data.id}}).then(() =>{
        // Retornando um objeto como resposta
        return res.json({
            error: false,
            message: "Usuário editado com sucesso!"
        });

    }).catch(() => {
        // Retornando um objeto como resposta
        return res.status(400).json({
            error: true,
            message: "Erro: usuário não editado"
        });
    });

});

// Criando a rota apagar
router.delete("/users/:id", (req, res) => {
    // Recebendo o parâmetro enviado na URL
    const {id} = req.params;
    
    // Retornando um objeto como resposta
    return res.json({id});

});

// Exportando a instrução que está dentro da constante router
module.exports = router;
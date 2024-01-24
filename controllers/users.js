// Incluindo as bibliotecas
// Dependência que gerencia as requisições, rotas e URLs, entre outras funcionalidades
const express = require('express');

// Chamando a função express Router
const router = express.Router();

// Dependência para criptografar a senha
const bycrypt = require('bcryptjs');
// const { STRING } = require('sequelize');

// Dependência para validar os inputs o formulário
const yup = require('yup');

// Operador do sequelize
const { Op } = require("sequelize");

// Realizando a inclusão da conexão com o banco de dados
const db = require("../db/models"); // O node por padrão vai pegar o arquivo index.js, presente na pasta models.

// Incluindo o arquivo para validar o token
const { eAdmin } = require('../services/authService');

// Incluindo o arquivo com a função de upload
const upload = require('../services/uploadImgUserServices');

// Criando a rota listar
// Endereço para acessar a api através de aplicação externa: http://localhost:8090/users?page=1
router.get("/users", eAdmin, async (req, res) => {

    // Recebendo o número da página. Quando não é enviado o número da página é atribuído a página 1.
    const { page = 1 } = req.query;
    // console.log(page);

    // Recuperando o valor que estava no token, tratado no authService.js
    console.log(req.userId);

    // Indicando o limite de registros em cada página
    const limit = 40;

    // Variável com o número da última página
    var lastPage = 1;

    // Contando a quantidade de registros no banco de dados
    const countUser = await db.Users.count();

    // Acessa o IF quando encontrar registro no banco de dados
    if (countUser !== 0) {
        // Calculando a última página
        lastPage = Math.ceil(countUser / limit);
        // console.log(lastPage);
    } else {
        // Retornando um objeto como resposta
        return res.status(40).json({
            error: true,
            message: "Erro: nenhum usuário encontrado!"
        });

    }

    // Recuperando todos os usuários do banco de dados
    const users = await db.Users.findAll({
        // Indicando quais colunas recuperar
        attributes: ['id', 'name', 'email', 'situationId'],
        // Ordenando os registros pela coluna id na forma descrescente
        order: [['id', 'DESC']],
        // Buscando dados na tabela secundária
        include: [{
            model: db.Situations,
            attributes: ['nameSituation']
        }],
        // Calcular a partir de qual registro deve retornar e o limite de registros
        offset: Number((page * limit) - limit),
        limit: limit

    });

    // Acessa o if se encontrar o registro no banco de dados
    if (users) {
        // Retornando um objeto como resposta
        return res.json({
            error: false,
            users
        });
    } else {
        // Retornando um objeto como resposta
        return res.status(400).json({
            error: true,
            message: "Erro: nenhum usuário encontrado!"
        });
    }
});

// Criação da rota visualizar
router.get("/users/:id", eAdmin, async (req, res) => {

    // Usando a desestruturação para simplificar a atribuição do parâmetro
    const { id } = req.params; // Ex.: http://localhost:8090/users/1

    // Recuperando os registros do banco de dados
    const user = await db.Users.findOne({
        attributes: ['id', 'name', 'email', 'situationId', 'image','createdAt', 'updatedAt'],
        // Acrescentando condição para indicar qual registro deve ser retornado do banco de dados
        where: { id },
        // Busca dados na tabela secudária
        include: [{
            model: db.Situations,
            attributes: ['nameSituation']
        }]
    });

    // Acessa o if se encontrar o registro no banco de dados
    if (user) {
        // Retornando um objeto como resposta
        return res.json({
            error: false,
            user
        });
    } else {
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
router.post("/users", eAdmin, async (req, res) => {

    // Recebendo os dados enviados no corpo da requisição
    var data = req.body;

    // Validando os campos utilizando o yup
    const schema = yup.object().shape({
        situationId: yup.number("Erro: Necessário preecher o campo situação!").required("Erro: Necessário preecher o campo situação!"),
        password: yup.string("Erro: Necessário preecher o campo senha!").required("Erro: Necessário preecher o campo senha!"),
        email: yup.string("Erro: Necessário preecher o campo email!").required("Erro: Necessário preecher o campo email!").email("Erro: Necessário preencher um e-mail válido!"),
        name: yup.string("Erro: Necessário preecher o campo nome!").required("Erro: Necessário preecher o campo nome!"),

    });

    // Verificando se todos os campos passaram pela validação
    try {
        await schema.validate(data);
    } catch (error) {
        // Retornando um objeto como resposta
        return res.status(400).json({
            error: true,
            message: error.errors
        });

    }

    // Recuperando o registro do banco de dados
    const user = await db.Users.findOne({

        // Indicando quais colunas recuperar
        attributes: ['id'],

        // Acrescentando condição para indicar qual registro deve ser retornado do banco de dados
        where: { email: data.email }

    });

    console.log(user);

    // Acessando o IF se encontrar o registro no banco de dados
    if (user) {
        // Retornando um objeto como resposta
        return res.status(400).json({
            error: true,
            message: "Erro: Este e-mail já está cadastrado!"
        });

    }

    // Criptografando a senha
    data.password = await bycrypt.hash(String(data.password), 8);

    // Salvando os dados no banco de dados
    await db.Users.create(data).then((dataUser) => {
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
router.put("/users/", eAdmin, async (req, res) => {

    // Recebendo os dados enviados no corpo da requisição
    const data = req.body;

    // Recuperando o registro do banco de dados
    const user = await db.Users.findOne({

        // Indicando quais colunas recuperar
        attributes: ['id'],

        // Acrescentando condição para indicar qual registro deve ser retornado do banco de dados
        where: {
            email: data.email,
            id: {
                // Operador de negação para ignorar o registro do usuário que está sendo editado
                [Op.ne]: Number(data.id)
            }
        }

    });

    // console.log(user);

    // Acessando o IF se encontrar o registro no banco de dados
    if (user) {
        // Retornando um objeto como resposta
        return res.status(400).json({
            error: true,
            message: "Erro: Este e-mail já está cadastrado!"
        });

    }

    // Editando os dados no banco de dados
    await db.Users.update(data, { where: { id: data.id } }).then(() => {
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

// Rota para editar a imagem, recebendo o parâmetro id enviado na URL
// Endereço de acesso: http://localhost:8089/users-image/1
router.put("/users-image/:id", upload.single('image'), async (req, res) => {

    // Recebendo o id enviado na URL
    const { id } = req.params;
    // console.log(id);

    // Acessa o if quando a extensão da imagem é inválida
    // console.log(req.file);
    if (!req.file) {
        // Retornando um objeto como resposta
        return res.status(400).json({
            error: true,
            message: "Erro: Selecione uma imagem válida JPEG ou PNG!"
        });

    }

    // Editando no banco de dados
    db.Users.update(
        { image: req.file.filename },
        { where: { id: id } })
        .then(() => {
            // Retornando um objeto como resposta
            return res.json({
                error: false,
                message: "Imagem editada com sucesso 2!"
            });
        }).catch(() => {
            // Retornando um objeto como resposta
            return res.status(400).json({
                error: true,
                message: "Erro: Imagem não editada!"
            });
        });

    // Retornando um objeto como resposta
    // return res.json({
    //     error: false,
    //     message: "Imagem editada com sucesso!"
    // });
});

// Criando a rota apagar
router.delete("/users/:id", eAdmin, async (req, res) => {
    // Recebendo o parâmetro enviado na URL
    const { id } = req.params;

    // Apagando o usuário no banco de dados utilizando a MODELS users
    await db.Users.destroy({
        // Acrescentando o WHERE na instrução SQL indicando qual registro exluir no BD
        where: { id }
    }).then(() => {
        // Retornando um objeto como resposta
        return res.json({
            error: false,
            message: "Usuário apagado com sucesso!"
        });
    }).catch(() => {
        // Retornando um objeto como resposta
        return res.status(400).json({
            error: true,
            message: "Erro: usuário não apgado"
        });
    });

});

// Exportando a instrução que está dentro da constante router
module.exports = router;
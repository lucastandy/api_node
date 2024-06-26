// Incluindo as bibliotecas
// Dependência que gerencia as requisições, rotas e URLs, entre outras funcionalidades
const express = require('express');

// Chamando a função express Router
const router = express.Router();

// Dependência para criptografar a senha
const bcrypt = require('bcryptjs');

// const { STRING } = require('sequelize');

// Dependência para validar os inputs o formulário
const yup = require('yup');

// Incluindo o arquivo responsável em salvar os logs
const logger = require('../services/loggerServices');

// Operador do sequelize
const { Op } = require("sequelize");

// Realizando a inclusão da conexão com o banco de dados
const db = require("../db/models"); // O node por padrão vai pegar o arquivo index.js, presente na pasta models.

// Incluindo o arquivo para validar o token
const { eAdmin } = require('../services/authService');

// Incluindo o arquivo com a função de upload
const upload = require('../services/uploadImgUserServices');

// Incluindo o módulo fs que permite interagir com o sistema de arquivos
const fs = require('fs');

// Criando a rota listar
// Endereço para acessar a api através de aplicação externa: http://localhost:8090/users?page=1
router.get("/users", eAdmin, async (req, res) => {

    // Recebendo o número da página. Quando não é enviado o número da página é atribuído a página 1.
    const { page = 1 } = req.query;
    // console.log(page);

    // Recuperando o valor que estava no token, tratado no authService.js
    console.log(req.userId);

    // Indicando o limite de registros em cada página
    const limit = 10;

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

    // Salvando o log no nível info
    logger.info({ message: "Listar usuários.", userId: req.userId, date: new Date() });

    // Acessa o if se encontrar o registro no banco de dados
    if (users) {
        // Retornando um objeto como resposta
        return res.json({
            error: false,
            users,
            lastPage,
            countUser
        });
    } else {

        // Salvando o log no nível info
        logger.info({ message: "Listar usuários não executado corretamente.", userId: req.userId, date: new Date() });

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
        // Verificando se existe a imagem. Acessa o if quando o usuário possui a imagem.
        if(user.dataValues.image){
            // console.log(user.dataValues.image);
            // Criando o caminho da imagem
            user.dataValues['image'] = process.env.URL_ADM + "/images/users/"+user.dataValues.image;
        }else{
            // Criando o caminho da imagem
            user.dataValues['image'] = process.env.URL_ADM + "/images/users/icon_user.png";
        }
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
        password: yup.string("Erro: Necessário preecher o campo senha!").required("Erro: Necessário preecher o campo senha!").min(6, 'Erro: A senha deve ter no mínimo 6 caracteres!'),
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
    data.password = await bcrypt.hash(String(data.password), 8);

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

    // Recuperando os registros do banco de dados
    const user = await db.Users.findOne({
        // Indicando quais colunas recuperar
        attributes: ['id','image'],

        // Acrescentando condição para indicar qual registro deve ser retornado do banco de dados
        where: {id}
    });

    // Verificando se o usuário tem imagem salva no banco de dados.
    // console.log(user);
    if(user.dataValues.image){
        // Criando o caminho da imagem que o usuário tem no banco de dados
        var imgOld = `./public/images/users/${user.dataValues.image}`;

        // fs.access utilizado para testar as permissões do arquivo
        fs.access(imgOld, (error) => {
            // Acessando o if quando não tiver nanhum erro
            if(!error){
                // Apagando a imagem antiga
                fs.unlink(imgOld, () => {});
            }
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

// Criando a rota editar senha
// Endereço para acessar a api através de aplicação externa: http://localhost:8090/users-password
// A aplicação externa deve indicar que está enviado os dados em formato de objeto Content-Type: application/json
// Dados em formato de objeto
/*{
    "id": 7,
    "password": "123456"
}
*/
router.put("/users-password", eAdmin, async (req, res) => {

    // Receber os dados enviados no corpo da requisição
    const data = req.body;

    // Validar os campos utilizando o yup
    const schema = yup.object().shape({
        password: yup.string("Erro: Necessário preencher o campo senha!")
            .required("Erro: Necessário preencher o campo senha!")
            .min(6, "Erro: A senha deve ter no mínimo 6 caracteres!"),
        id: yup.string("Erro: Necessário enviar o id do usuário!")
            .required("Erro: Necessário enviar o id do usuário!")
    });

    // Verificar se todos os campos passaram pela validação
    try {
        await schema.validate(data);
    } catch (error) {
        // Retornar objeto como resposta
        return res.status(400).json({
            error: true,
            message: error.errors
        });
    }

    // Criptografar a senha
    data.password = await bcrypt.hash(String(data.password), 8);

    // Editar no banco de dados
    await db.Users.update(data, { where: { id: data.id } })
        .then(() => {

            // Salvar o log no nível info
            logger.info({ message: "Senha do usuário editado com sucesso.", id: data.id, userId: req.userId, date: new Date() });

            // Retornar objeto como resposta
            return res.json({
                error: false,
                message: "Senha do usuário editado com sucesso!"
            });
        }).catch(() => {

            // Salvar o log no nível info
            logger.info({ message: "Senha do usuário não editado.", id: data.id, userId: req.userId, date: new Date() });

            // Retornar objeto como resposta
            return res.status(400).json({
                error: true,
                message: "Erro: Senha do usuário não editado!"
            });
        });
});

// Exportando a instrução que está dentro da constante router
module.exports = router;
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
// Incluindo o arquivo responsável em salvar os logs
const logger = require('../services/loggerServices');
// Operador do sequelize. Para pegar dados de uma tabela secundária
const { Op } = require("sequelize");
// Realizando a inclusão da conexão com o banco de dados
const db = require("../db/models"); // O node por padrão vai pegar o arquivo index.js, presente na pasta models.
// Incluindo o arquivo para validar o token
const { eAdmin } = require('../services/authService');
// Incluindo o arquivo com a função de upload
const upload = require('../services/uploadImgUserServices');
// Incluindo o módulo fs que permite interagir com o sistema de arquivos
const fs = require('fs');

// Criação da rota visualizar
router.get("/profile", eAdmin, async (req, res) => {

    // Recuperando os registros do banco de dados
    const user = await db.Users.findOne({
        attributes: ['id', 'name', 'email', 'situationId', 'image', 'createdAt', 'updatedAt'],
        // Acrescentando condição para indicar qual registro deve ser retornado do banco de dados
        where: { id: req.userId },
        // Busca dados na tabela secudária
        include: [{
            model: db.Situations,
            attributes: ['nameSituation']
        }]
    });

    // Salvando o log no nível info
    logger.info({ message: "Perfil visualizado.", id: req.userId, userId: req.userId, date: new Date() });

    // Acessa o if se encontrar o registro no banco de dados
    if (user) {
        // Verificando se existe a imagem. Acessa o if quando o usuário possui a imagem.
        if (user.dataValues.image) {

            // Criando o caminho da imagem
            user.dataValues['image'] = process.env.URL_ADM + "/images/users/" + user.dataValues.image;
        } else {
            // Criando o caminho da imagem
            user.dataValues['image'] = process.env.URL_ADM + "/images/users/icon_user.png";
        }
        // Retornando um objeto como resposta
        return res.json({
            error: false,
            user
        });
    } else {
        // Salvando o log no nível info
        logger.info({ message: "Perfil não encontrado.", id: req.userId, userId: req.userId, date: new Date() });
        // Retornando um objeto como resposta
        return res.status(400).json({
            error: true,
            message: "Erro: perfil não encontrado!"
        });
    }

});

// Criando a rota editar perfil
router.put("/profile/", eAdmin, async (req, res) => {

    // Recebendo os dados enviados no corpo da requisição
    const data = req.body;

    // Validar os campos utilizando o yup
    const schema = yup.object().shape({
        email: yup.string("Erro: Necessário preencher o campo e-mail!").required("Erro: Necessário preencher o campo e-mail!").email("Erro: Necessário preecher um e-mail válido!"),
        name: yup.string("Erro: Necessário preencher o campo nome!").required("Erro: Necessário preencher o campo nome!")
    });

    // Verificando se todos os campos passaram pela validação
    try{
        await schema.validate(data);
    }catch(error){
        // Retornar um objeto como resposta
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
        where: {
            email: data.email,
            id: {
                // Operador de negação para ignorar o registro do usuário que está sendo editado
                [Op.ne]: Number(req.userId)
            }
        }

    });

    // console.log(user);

    // Acessando o IF se encontrar o registro no banco de dados
    if (user) {

        // Salvando o log no nível info
        logger.info({message: "Tentativa de usar e-mail já cadastrado em outro usuário.", id: req.userId, name: data.name, email: data.email, userId: req.userId, date: new Date()});

        // Retornando um objeto como resposta
        return res.status(400).json({
            error: true,
            message: "Erro: Este e-mail já está cadastrado!"
        });

    }

    // Editando os dados no banco de dados
    await db.Users.update(data, { where: { id: req.userId } }).then(() => {

        // Salvando o log no nível info
        logger.info({message: "Perfil editado com sucesso.", id: req.userId, name: data.name, email: data.email, userId: req.userId, date: new Date()});

        // Retornando um objeto como resposta
        return res.json({
            error: false,
            message: "Perfil editado com sucesso!"
        });

    }).catch(() => {

        // Salvando o log no nível info
        logger.info({message: "Perfil não editado.", id: req.userId, name: data.name, email: data.email, userId: req.userId, date: new Date()});

        // Retornando um objeto como resposta
        return res.status(400).json({
            error: true,
            message: "Erro: perfil não editado!"
        });
    });

});

// Exportando a instrução que está dentro da constante router
module.exports = router;
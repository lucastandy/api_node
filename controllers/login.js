// Incluindo as bibliotecas
// Dependência que gerencia as requisições, rotas e URLs, entre outras funcionalidades
const express = require('express');

// Chamando a função express Router
const router = express.Router();

// Realizando a inclusão da conexão com o banco de dados
const db = require("../db/models"); // O node por padrão vai pegar o arquivo index.js, presente na pasta models.

// Dependência para criptografar a senha
const bycrypt = require('bcryptjs');

// Dependência para gerar um token de autenticação
const jwt = require('jsonwebtoken');

// Incluindo o arquivo com as variáveis de ambiente
require('dotenv').config();

// Validando o input do formulário
const yup = require('yup');
// Incluindo o arquivo responsável em salvar os logs
const logger = require('../services/loggerServices');

// Dependência para enviar e-mail
const nodemailer = require('nodemailer');


// Criando a rota Login
// Endereço para acessar a api através de aplicação externa: http://localhost:8090/login
router.post("/login", async (req, res) => {
    var data = req.body;
    // console.log(data);
    // Recuperando os registros do banco de dados
    const user = await db.Users.findOne({
        // Indicando quais colunas recuperar
        attributes: ['id', 'name', 'email', 'password'],
        // Acrescentando condição para indicar qual registro deve ser retornado do banco de dados
        where: { email: data.email }
    });
    // console.log(user);
    // Acessa o IF se encontrar o registro no banco de dados
    if (!user) {

        // Salvar o log no nível error
        logger.warn({ message: "Tentativa de login com usuário incorreto.", email: data.email });
        // Retornando um objeto como resposta
        return res.status(401).json({
            error: true,
            message: "Erro: usuário ou senha incorreta!"
        });
    }
    // Comparando a senha do usuário com a senha salva no banco de dados
    if (!(await bycrypt.compare(String(data.password), String(user.password)))) {

        // Salvar o log no nível error
        logger.warn({ message: "Tentativa de login com senha incorreta.", email: data.email });

        // Retornando um objeto como resposta
        return res.status(401).json({
            error: true,
            message: "Erro: usuário ou senha incorreta!"
        });
    }
    // Gerando o token de autenticação
    const token = jwt.sign({ id: user.id }, process.env.SECRET, {
        //expiresIn: 600, // Indica 10 minutos
        expiresIn: '7d', // Corresponde a 7 dias

    });


    // Retornando um objeto como resposta
    return res.json({
        error: false,
        message: "Login realizado com sucesso!",
        user: { id: user.id, name: user.name, email: user.email, token }
    });
});

// Criando a rota recuperar senha
// Endereço para acessar a api através de aplicação externa: http://locahost:8090/recover-password

router.post("/recover-password", async (req, res) => {

    // Recebendo os dados enviados no corpo da requisição
    var data = req.body;
    // console.log(data);

    // Validando os campos utilizando yup
    const schema = yup.object().shape({
        urlRecoverPassword: yup.string("Erro: Necessário enviar a URL!").required("Erro: Necessário enviar a URL!"),
        email: yup.string("Erro: Necessário preencher o campo e-mail!").required("Erro: Necessário preencher o campo e-mail!")
    });

    // Verificando se todos os campos passaram pela validação
    try {
        await schema.validate(data);
    } catch (error) {
        // Retornando o objeto como resposta
        return res.status(400).json({
            error: true,
            message: error.errors
        });
    }

    // Recuperando os registros do banco de dados
    const user = await db.Users.findOne({
        // Indicando quais colunas recuperar
        attributes: ['id', 'name'],
        // Acrescentando condição para indicar qual registro dever ser retornado do banco de dados
        where: {
            email: data.email
        }

    });

    // Acessando o if se encontrar o registro no banco de dados
    if (!user) {

        // Salvando o log no nível info
        logger.info({ message: "Tentativa recuperar senha com e-mail incorreto.", email: data.email, date: new Date() });

        // Retornando um objeto como resposta
        return res.status(400).json({
            error: true,
            message: "Erro: e-mail não está cadastrado!"
        });
    }

    // Gerando a chave para recuperar a senha
    var recoverPassword = (await bycrypt.hash(data.email, 8)).replace(/\./g, "").replace(/\//g, "");

    // Editando o registro no banco de dados
    await db.Users.update({ recoverPassword }, {
        where: { id: user.id }
    }).then(() => {

        // Criando a variável com as credenciais do servidor para enviar e-mail
        var transport = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        //   Criando a variável com o conteúdo do e-mail
        var message_content = {
            from: process.env.EMAIL_FROM_PASS, // E-mail do Rementente
            to: data.email, // E-mail do destinatário 
            subject: "Recuperar senha", // Título do e-mail
            text: `Prezado (a) ${user.name} \n\nInformações que a sua solicitação de senha foi recebida com sucesso.\n\nClique no link abaixo para criar uma nova senha em nosso sistema: ${data.urlRecoverPassword}${recoverPassword}\n\nEsta mensagem foi enviada a você pela empresa ${process.env.NAME_EMP}.\n\nVocê está recebendo porque está cadastrado no banco de dados da empresa ${process.env.NAME_EMP}. Nenhum e-mail enviado pela empresa ${process.env.NAME_EMP} tem arquivos anexados ou solicita o preenchimento de senhas e informações cadastrais.\n\n`, // Conteúdo do e-mail somente texto
            html: `Prezado (a) ${user.name} <br><br>Informações que a sua solicitação de senha foi recebida com sucesso.<br><br>Clique no link abaixo para criar uma nova senha em nosso sistema: <a href='${data.urlRecoverPassword}${recoverPassword}'> ${data.urlRecoverPassword}${recoverPassword}</a><br><br>Esta mensagem foi enviada a você pela empresa ${process.env.NAME_EMP}.<br><br>Você está recebendo porque está cadastrado no banco de dados da empresa ${process.env.NAME_EMP}. Nenhum e-mail enviado pela empresa ${process.env.NAME_EMP} tem arquivos anexados ou solicita o preenchimento de senhas e informações cadastrais.<br><br>` // Conteúdo do e-mail com HTML
        }

        // Enviando o e-mail
        transport.sendMail(message_content, function (err) {
            if (err) {
                // Salvando o log no nível warn
                logger.warn({ message: "E-mail recuperar senha não enviado. 2", email: data.email, date: new Date() });
                // Retornando um objeto como resposta
                return res.status(400).json({
                    error: true,
                    message: "Erro: E-mail com as intruções para recuperar a senha não enviado, tente novamente ou entre em contato com o e-mail: " + process.env.EMAIL_ADM
                });

            } else {
                // Salvando o log no nível info
                logger.info({ message: "Enviado e-mail com instruções para recuperar a senha.", email: data.email, date: new Date() });
                // Retornando um objeto como resposta
                return res.json({
                    error: false,
                    message: "Enviado e-mail com instruções para recuperar a senha. Acesse a sua caixa de e-mail para recuperar a senha!"
                });

            }
        });
    }).catch(() => {
        // Salvando o log no nível warn
        logger.warn({ message: "E-mail recuperar senha não enviado. Erro editar usuário no banco de dados.", email: data.email, date: new Date() });

        // Retornando um objeto como resposta
        return res.json({
            error: true,
            message: "Erro: Link recuperar senha não enviado, entre em contato com o suporte: " + process.env.EMAIL_ADM
        });

    });

});

// Criando rota para validar a chave recuperar senha
// Endereço para acessar a api através de aplicação externa: http://localhost:8090/validate-recover-password
router.post('/validate-recover-password', async (req, res) => {

    // Recebendo os dados enviados no corpo da requisição
    var data = req.body;

    // Validando os campos utilizando yup
    const schema = yup.object().shape({
        recoverPassword: yup.string("Erro: Necessário enviar a chave!").required("Erro: Necessário enviar a chave!")
    });

    // Verificando se todos os campos passaram pela validação
    try {
        await schema.validate(data);
    } catch (error) {
        // Retornando o objeto como resposta
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
            recoverPassword: data.recoverPassword
        }
    });

    // Acessa o if se encontrar o registro no banco de dados
    if (user) {

        // Salvando o log no nível info
        logger.info({ message: "Validar chave recuperar senha, chave válida.", date: new Date() });

        // Retornando um objeto como resposta
        return res.json({
            error: false,
            message: "Chave recuperar senha válida!"
        });

    } else {

        // Salvando o log no nível info
        logger.info({ message: "Válidar chave recuperar senha, chave inválida.", date: new Date() });

        // Retornando um objeto como resposta
        return res.status(400).json({
            error: true,
            message: "Erro: chave recuperar senha inválida!"
        });

    }

});

// Criando a rota atualizar a senha
// Endereço para acessar a api através de aplicação externa: http://localhost:8090/update-password
router.post("/update-password", async (req, res) => {

    // Recebendo os dados enviados no corpo da requisição
    var data = req.body;

    // Validando os campos utilizando yup
    const schema = yup.object().shape({
        recoverPassword: yup.string("Erro: Necessário enviar a chave!").required("Erro: Necessário enviar a chave!"),
        password: yup.string("Erro: Necessário preencher o campo senha!").required("Erro: Necessário preencher o campo senha!").min(6, 'Erro: A senha deve ter no mínimo 6 caracteres!')
    });

    // Verificando se todos os campos passaram pela validação
    try {
        await schema.validate(data);
    } catch (error) {
        // Retornando o objeto como resposta
        return res.status(400).json({
            error: true,
            message: error.errors
        });
    }

    // Recuperando o registro do banco de dados
    const user = await db.Users.findOne({
        // Indicando quais colunas recuperar
        attributes: ['id', 'email'],

        // Acrescentando condição para indicar qual registro deve ser retornado do banco de dados
        where: {
            recoverPassword: data.recoverPassword
        }
    });

    // Acessa o if se encontrar o registro no banco de dados
    if (user) {

        // Criptografando a senha
        var password = await bycrypt.hash(data.password, 8);

        // Editando o registro no banco de dados
        await db.Users.update({ recoverPassword: null, password }, {
            where: { id: user.id }
        }).then(() => {
            // Salvando o log no nível info
            logger.info({ message: "Senha editada com sucesso.", date: new Date() });

            // Retornando um objeto como resposta
            return res.json({
                error: false,
                message: "Senha editada com sucesso!"
            });

        }).catch(() => {
            // Salvando o log no nível info
            logger.info({ message: "Senha não editada.", date: new Date() });

            // Retornando um objeto como resposta
            return res.status(400).json({
                error: true,
                message: "Senha não editada!"
            });

        });

    } else {

        // Salvando o log no nível info
        logger.info({ message: "Chave recuperar senha, chave inválida.", date: new Date() });

        // Retornando um objeto como resposta
        return res.status(400).json({
            error: true,
            message: "Erro: chave recuperar senha inválida!"
        });

    }



});


// Exportando a instrução que está dentro da constante router
module.exports = router;
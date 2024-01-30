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
const longger = require('../services/loggerServices');


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
        longger.warn({ message: "Tentativa de login com usuário incorreto.", email: data.email });
        // Retornando um objeto como resposta
        return res.status(401).json({
            error: true,
            message: "Erro: usuário ou senha incorreta!"
        });
    }
    // Comparando a senha do usuário com a senha salva no banco de dados
    if (!(await bycrypt.compare(String(data.password), String(user.password)))) {

        // Salvar o log no nível error
        longger.warn({ message: "Tentativa de login com senha incorreta.", email: data.email });

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
        longger.info({ message: "Tentativa recuperar senha com e-mail incorreto.", email: data.email, date: new Date() });

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
        // Retornando um objeto como resposta
        return res.json({
            error: false,
            message: "Enviado e-mail com instruções para recuperar a senha. Acesse a sua caixa de e-mail para recuperar a senha!"
        });

    }).catch(() => {
        // Salvando o log no nível warn
        longger.warn({ message: "E-mail recuperar senha não enviado. Erro editar usuário no banco de dados.", email: data.email, date: new Date() });

        // Retornando um objeto como resposta
        return res.json({
            error: true,
            message: "Erro: Link recuperar senha não enviado, entre em contato com o suporte: " + process.env.EMAIL_ADM
        });

    });

    // Retornando um objeto como resposta
    return res.json({
        error: false,
        message: "Acessou!",
        recoverPassword
    });

});



// Exportando a instrução que está dentro da constante router
module.exports = router;
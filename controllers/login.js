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
        // Retornando um objeto como resposta
        return res.status(401).json({
            error: true,
            message: "Erro: usuário ou senha incorreta!"
        });
    }
    // Comparando a senha do usuário com a senha salva no banco de dados
    if (!(await bycrypt.compare(String(data.password), String(user.password)))) {
        // Retornando um objeto como resposta
        return res.status(401).json({
            error: true,
            message: "Erro: usuário ou senha incorreta!"
        });
    }
    // Gerando o token de autenticação
    const token = jwt.sign({id: user.id}, process.env.SECRET,{
        //expiresIn: 600, // Indica 10 minutos
         expiresIn: '7d', // Corresponde a 7 dias
        
    });


    // Retornando um objeto como resposta
    return res.json({
        error: false,
        message: "Login realizado com sucesso!",
        user:{id: user.id, name: user.name, email: user.email, token}
    });
});



// Exportando a instrução que está dentro da constante router
module.exports = router;
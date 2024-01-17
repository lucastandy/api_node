// Manipulando token de autenticação
const jwt = require('jsonwebtoken');

// Incluindo o módulo "util" que fornece funções para imprimir strings formatadas
const { promisify } = require('util');

// Incluindo o arquivo com as variáveis de ambiente
require('dotenv').config();

// Exportar para usar em outras partes do projeto
module.exports = {
    eAdmin: async function (req, res, next) {
        // return res.json({message: "Validar token."});

        // Recebendo o cabeçalho da requisição
        const authHeader = req.headers.authorization;

        // console.log(authHeader); // Verificando o envio do token

        // Acessando o if quando não existe dados no cabeçalho
        if (!authHeader) {
            // Retornando um objeto como resposta
            return res.status(401).json({
                error: false,
                message: "Erro: Necessário realizar o login para acessar a página!"
            });
        }
        // Separar o token da palavra bearer
        const [bearer, token] = authHeader.split(' ');
        // console.log(token);

        // Verificando se o token estiver vazio, retorne erro
        if (!token) {
            // Retornando um objeto como resposta
            return res.status(401).json({
                error: false,
                message: "Erro: Necessário enviar o token!"
            });
        }

        // Permanece no try se conseguir executar corretamente
        try {
            // Validando o token
            const decode = await promisify(jwt.verify)(token, process.env.SECRET);
            // console.log(decode);

            // Atribuindo como parâmetro o id do usuário que está no token
            req.userId = decode.id;

            return next(); // Instrução para a aplicação continuar o processamento, visto que esse bloco de código é um middleware.

        } catch (error) { // Acessando o catch quando não conseguir executar o código no try
            // Retornando um objeto como resposta
            return res.status(401).json({
                error: false,
                message: "Erro: Necessário realizar o login para acessar a página!"
            });
        }
    }

};
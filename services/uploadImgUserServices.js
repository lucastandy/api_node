// Utilizando o Multer, um middleware node.js, para manipulação multipart/form-data, usado para o upload de arquivos
const multer = require('multer');

// O módulo path permite interagir com o sistema de arquivos
const path = require('path');

// Realizando o upload do arquivo
module.exports = (multer({
    // diskStorage permite manipular o local para salvar a imagem
    storage: multer.diskStorage({
        // Local para salvar a imagem
        destination: function(req, file, cb){
            // console.log(file);
            cb(null,'./public/images/users')
        },
        filename: function(req, file, cb){
            // Criando um novo nome para o arquivo
            cb(null, Date.now().toString() + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
        }
    }),
    // Validando a extensão do arquivo
    fileFilter: (req, file, cb) => {
        // Verificando se a extensão da imagem enviada pelo usuário está no array de extensões
        const extensionImg = ['image/jpeg','image/jpg','image/png'].find((acceptedFormat) => acceptedFormat == file.mimetype);

        // Retornando true quando a extensão da imagem é válida
        if(extensionImg){
            return cb(null, true);
        }else{
            return cb(null, false);
        }
    }
}));


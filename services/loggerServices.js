// Incluindo a biblioteca de log
const {createLogger, transports, format} = require('winston');

// Criando o logger personalizado
const logger = createLogger({
    // Definindo o nível de log (debug, info, warn, error)
    level: "debug",

    // Definindo o formato das mensagens de log como JSON
    format: format.json(),

    // Definindo os métodos de log (info, warn, error, etc.)
    transports:[
        new transports.File({
            filename: "./logs/arquivo_de_log.log",

        })
    ]
});

// Exportando o logger para que possa ser usado em outros módulos
module.exports = logger;


// Explicação dos níveis de logs

// emerg (emergência) - Nível 0: Este é o nível mais alto de emergência e geralmente é usado para mensagens que indicam uma falha catastrófica no sistema. Use-o para erros graves que causam a intrrupção completa do aplicativo.

// alert (alerta) - Nível 1: Utilize este nível para mensagens que indicam uma situação que requer atenção imediata, mas que não é necessariamente catastrófica. Por exemplo, um problema que pode levar a uma falha em breve se não for tratado.

// crit (crítico) - Nível 2: Este nível é usado para mensagens que indicam um erro crítico, mas que não é necessariamente uma emergência imediata. Isso pode ser usado para situações que requerem ação urgente, mas não emediata.

// error (erro) - Nível 3: Use este nível para mensagens que indicam erros graves que não são críticos para o funcionamento do aplicativo, mas ainda precisam de atenção imediata.

// warning (aviso) - Nível 4: Use este nível para mensagens que indicam situações de aviso que não são erros, mas que podem indicar problemas potenciais. Isso é frequentemente usado para situações que podem ser ignorados, mas que ainda merecem atenção.

// notice (aviso) - Nível 5: Este nível é usado para mensagens que fornecem informações importantes sobre o funcionamento normal do aplicativo. É útil para registrar eventos significativos.

// info (informação) - Nível 6: Utilize este nível para mensagens informativas gerais que são úteis para rastrear o fluxo de execução do aplicativo. Isso pode incluir informações sobre solicitações HTTP, eventos do aplicativo, etc.

// debug (depuração) - Nível 7: Este é o nível mais baixo e é usado para mensagens de depuração. É útil para rastrear detalhes específicos do funcionamento interno do aplicativo. Normalmente, você não usaria essas mensagens em produção, mas durante o desenvolvimento para depurar problemas.
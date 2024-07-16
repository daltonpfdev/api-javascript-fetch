// Importação da interface http do módulo 'http'
import http from 'node:http'

// Importando a função json do módulo middlewares/json.js
import { json } from './middlewares/json.js'

// Importando a constante routes do módulo ./routes
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'

// Principais Métodos Http: GET, POST, PUT, PATCH, DELETE
// GET => Buscar uma informação do back-end
// POST => Criar um recurso no back-end
// PUT => Atualizar um recurso no back-end
// PATCH => Atualizar uma informação específica de um recuso no back-end
// DELETE => Deletar um recurso no back-end

// Aplicação Stateful: É uma aplicação que somente guarda dados de forma local, na memória do computador.
// Aplicação Stateless: É uma aplicação que guarda seus dados de forma externa, como em banco de dados.
// Uma aplicação Statefull não é recomendada para aplicações reais, mas sim para testes e aprendizado, pois, uma vez o servidor reiniciado,
// todos os dados iram se perder. Já no banco de dados, os dados são salvos mesmo com o servidor reiniciando.

// JSON (JavaScript Object Notation) => É a forma como os dados são passados do back-end para o front-end e vice-versa

// Cabeçalho (Requisição/Resposta) => Metadados(JSON)

// Formas de enviar dados do front-end para o back-end:
// Query Parameters => http://localhost:3333/users?userId=1&userName=Dalton => URL Stateful => Filtros, Paginação | Ambos são dados enviados na URL, sendo assim não
// Route Parameters => http://localhost:3333/users/1 => Identificação de Recurso                                  | podendo enviar Informações seguras para o backend 
// Request Body => Envio de informaçõe de um formulário (HTTPS) => Dados são enviados de forma segura | Dados não ficam na URL

// Criando o servidor a partir de uma arrow function da lib http. req = request | res = response
const server = http.createServer(async (req, res) => {
    // Pegando o método e a url da requisição e guardando em variáveis
    const { method, url } = req

    // pegando os dados enviados na requisição com a função json()
    await json(req, res)

    // Verificando se existe uma rota com o método e o url especificado na requisição
    const route = routes.find(route => {
        return route.method === method && route.path.test(url)
    })

    // Se exisite, executa a função handler dessa rota
    if (route) {
        const routeParams = req.url.match(route.path)

        const { query, ...parms } = routeParams.groups

        req.params = parms
        req.query = query ? extractQueryParams(query) : {}

        return route.handler(req, res)
    }

    // Rota de escape se não achar nenhuma rota criada. Volta um erro 404 - Not Found
    return res.writeHead(404).end()
})

// Difinindo a porta que o servidor web irá ficar "ouvindo"
server.listen(3333)
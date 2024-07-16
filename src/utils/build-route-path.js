// modelo para busca de id na url: /user/:id

// Função que recebe um path e pega todos os argumentos depois de : com RegEx
export function buildRoutePath(path) {
    // Determina a RegEx
    const routeParametersRegex = /:([a-zA-Z]+)/g
    
    const pathWithParams = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\-_]+)')

    const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))$`)

    return pathRegex
}
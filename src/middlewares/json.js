// Função que pega os dados enviados na requisição e coloca no corpo da mesma em formato JSON
export async function json(req, res) {
    // Criando a constante dos Buffers do Stream da requisição
    const buffers = []

    // Pega todos os Chunks da requisição e guarda na lista de buffers
    for await (const chunk of req) {
        buffers.push(chunk)
    }

    // Tenta inserir no corpo da requisição os buffers em formato JSON
    try {
        req.body = JSON.parse(Buffer.concat(buffers).toString())
    // Se não tiver nenhum Buffer em buffers, o corpo da requisição é nulo
    } catch {
        req.body = null
    }
}
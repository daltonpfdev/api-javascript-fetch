// Importando o módulo fs (file system) do node para lidar com arquivos 
import fs from 'node:fs/promises'

// Pegando o caminho raiz do projeto. Onde está esse arquivo, uma pasta para trás e determinando o nome do arquivo do banco de dados
const databasePath = new URL('../db.json', import.meta.url)

// Criando a classe Database que irá ser meu banco de dados
export class Database {
    // Criando meu atributo do database que representa meu banco onde ficaram as tabelas. Ela é privada (#) para somente esse arquivo poder user esse atributo diretamente
    #database = {}

    // Definindo o método construtor da classe que lê o arquivo do banco de dados existente, se nao existe, constroi o arquivo
    constructor() {
        fs.readFile(databasePath, 'utf-8').then(data => {
            this.#database = JSON.parse(data)
        }).catch(() => {
            this.#persist()
        })
    }

    // Criando o método que salva um JSON no arquivo do banco de dados
    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    // Criando o método para mostrar todos os dados de uma tabela passada pelo usuário
    select(table, search) {
        let data = this.#database[table] ?? []

        if (search) {
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    return row[key].includes(value)
                })
            })
        }
        return data
    }

    // Criando o método para armazenar um dado a uma tabela passada pelo usuário, se não possuir a tabela, cria a tabela no atributo database
    insert(table, data) {
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data]
        } 
        this.#persist();
        return data
    }

    // Criando o método para deletar um usuário passando a tabela e o id do usuário
    delete(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if (rowIndex > -1 ) {
            this.#database[table].splice(rowIndex, 1)
            this.#persist()
        }
    }

    // Criando o método para alterar os dados de um usuário passando a tabela e o id do usuário e os dados para alterar
    update(table, id, data) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if (rowIndex > -1 ) {
            this.#database[table][rowIndex] = { id, ...data }
            this.#persist()
        }
    }
}
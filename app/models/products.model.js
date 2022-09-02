var {model, Schema} = require('mongoose')

// Atributos e variáveis que os produtos podem ter 
// type: tipo do atributo
// required: ele é necessário se aparecer ou não

var ProdutoSchema = new Schema({
    titulo: {
        type: String, 
        required: true
    },
    id_produto: {
        type: Number, 
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    fornecedor: {
        type: String,
        required: true
    },
    data_ultima_entrada: {
        type: Date,
        required: true
    },
    quantidade_estoque:{
        type: Number, 
        required: true
    },
    preço_individual:{
        type: Number, 
        required: true
    },
    permitir_compra:{
        type: Boolean, 
        required: true
    },
    
}, {
    timestamps: true
})

module.exports = model('produtos', ProdutoSchema)
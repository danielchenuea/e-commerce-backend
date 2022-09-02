var {model, Schema} = require('mongoose')

// Atributos e variáveis que os produtos podem ter 
// type: tipo do atributo
// required: ele é necessário se aparecer ou não

var UsuarioSchema = new Schema({
    nome: {
        type: String, 
        required: true
    },
    email: {
        type: String,
        required: true
    },
    data_cadastro: {
        type: Date,
        required: true
    },
    carrinho: {
        type: Object,
        required: true
    },
}, {
    timestamps: true,
    minimize: false
})

module.exports = model('usuarios', UsuarioSchema)
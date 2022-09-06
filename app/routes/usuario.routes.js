var UsuarioController = require('../controllers/usuario.controller')
var CarrinhoController = require('../controllers/carrinho.controller')

// Caminhos que a aplicação usará para pegar ou postar informações
module.exports = function (application) {

    application.get('/lista_usuarios', UsuarioController.lista_usuarios)
    application.post('/adicionar_usuario', UsuarioController.adicionar_novo_usuario)
    application.post('/encontrar_usuario', UsuarioController.encontrar_usuario)
    application.post('/modificar_usuario', UsuarioController.modificar_usuario)
    application.post('/deletar_usuario', UsuarioController.deletar_usuario)

    application.post('/mostrar_carrinho', CarrinhoController.mostrar_carrinho)
    application.post('/adicionar_item', CarrinhoController.adicionar_item)
    application.post('/modificar_item', CarrinhoController.modificar_item)
    application.post('/deletar_item', CarrinhoController.remover_item)
    application.post('/deletar_carrinho', CarrinhoController.remover_tudo)


}
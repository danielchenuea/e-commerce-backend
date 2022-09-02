var ProductController = require('../controllers/products.controller')

// Caminhos que a aplicação usará para pegar ou postar informações
module.exports = function (application) {

    application.get('/lista_produtos', ProductController.lista_produtos)

    application.post('/adicionar_produto', ProductController.adicionar_produtos)
    application.post('/encontrar_produto', ProductController.encontrar_produto_individual)
    application.post('/modificar_produto', ProductController.modificar_produto)
    application.post('/deletar_produto', ProductController.deletar_produto)

}
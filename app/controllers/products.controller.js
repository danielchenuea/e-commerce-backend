var Products = require('../models/products.model.js')

// Json Utilizado para fazer Posts de adição
// {
//   "titulo": "Teste",
//   "descricao": "10",
//   "fornecedor": "B",
//   "quantidade_estoque": 1,
//   "preço_individual": 50,
//   "permitir_compra": true
// }


module.exports = {
  // Retorna uma lista de todos os produtos dentro do banco de dados mongo.
  // {
  //  apenas_permitidos: bool
  // }
  async lista_produtos(req, res){
    try {
      // Se encontrar
      Products.find({"permitir_compra": true}).then((produtos) => {

          res.send(produtos)

      // Se não encontrar
      }).catch((erro) => {
          res.status(500).send({
            message:
              erro.message || "Algum erro aconteceu ao tentar retonar a lista de produtos."
          });
      })
    } catch (error) {
      res.status(500).send({message: "Algum erro ocorreu - Produtos - 1"})
    }
  },

  // Cadastrar produtos dentro do banco
  async adicionar_produtos(req, res){
    try {
      var novo_produto = new Products()
      novo_produto = req.body;

      novo_produto.id_produto = (novo_produto.titulo + "_" + novo_produto.fornecedor).toLowerCase()
      novo_produto.data_ultima_entrada = new Date().getTime()

      // Adiciona o produto ao banco
      Products.create(novo_produto).then((prod) =>{

        res.status(204).send()
        
      // Se ocorrer erro ao criar
      }).catch((erro) =>{
        res.status(500).send({
          message:
            erro.message || "Algum erro aconteceu ao tentar adicionar produtos."
        });
      })
    } catch (error) {
      res.status(500).send({message: "Algum erro ocorreu - Produtos - 2"})
    }
  },

  // Encontrar produtos individuais dentro do banco
  async encontrar_produto_individual(req, res){
    try {
      produto = req.body;

      if ("id_produto" in produto){
        // Encontrar produtos
        Products.findOne({"id_produto": produto.id_produto}).then((prod) =>{

          if (prod.length == 0){
            res.status(404).send({message: "Nenhum produto encontrado"})
            return
          }

          res.send(prod)
          
        // Se ocorrer erro
        }).catch((erro) =>{
          res.status(500).send({
            message:
              erro.message || "Algum erro aconteceu ao tentar adicionar usuarios."
          });
        })
      }else{
        res.status(500).send({message: "Algum erro aconteceu ao tentar encontrar esse produto."});
        return
      }

    } catch (error) {
      console.log(error)
      res.status(500).send({message: "Algum erro ocorreu - Produtos - 3"})
    }
  },
  // Modificar produto dentro do banco
  async modificar_produto(req, res){
    try {
      produto = req.body;

      if ("id_produto" in produto){

        Products.updateOne({"id_produto": produto.id_produto}, produto).then((prod) =>{

          if (prod.length == 0){
            res.status(404).send({message: "Nenhum produto encontrado"})
            return
          }

          res.status(204).send()
          
        // Se ocorrer erro
        }).catch((erro) =>{

          res.status(500).send({
            message:
              erro.message || "Algum erro aconteceu ao tentar adicionar usuarios."
          });

        })
      }
      else{
        res.status(500).send({message: "Algum erro aconteceu ao tentar modificar o produto."});
        return
      }
    } catch (error) {
      res.status(500).send({message: "Algum erro ocorreu - Produtos - 4"})
    }
  },

  // Deletar produto dentro do banco
  async deletar_produto(req, res){
    try {
      produto = req.body
    
      if ("id_produto" in produto){
        
      // Deleta o usuario do banco
      Products.deleteOne({"id_produto": produto.id_produto}).then((prod) =>{
        if (prod.length == 0){
          res.status(404).send({message: "Nenhum produto encontrado"})
          return
        }

        res.status(204).send()
        
        // Se ocorrer erro ao deletar
        }).catch((erro) =>{
          res.status(500).send({
            message:
              erro.message || "Algum erro aconteceu ao tentar deletar usuarios."
          });
        })
      }else{
        res.status(500).send("Algum erro aconteceu ao tentar deletar o produto.");
        return
      }
    } catch (error) {
      res.status(500).send({message: "Algum erro ocorreu - Produtos - 5"})
    }
  }

}
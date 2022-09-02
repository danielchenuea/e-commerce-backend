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
      Products.find({"permitir_compra": req.apenas_permitidos}).then((produtos) => {

          res.send(produtos)

      // Se não encontrar
      }).catch((erro) => {
          res.status(500).send({
            message:
              erro.message || "Algum erro aconteceu ao tentar retonar a lista de produtos."
          });
      })
    } catch (error) {
      res.send("Algum erro ocorreu")
    }
  },

  // Cadastrar produtos dentro do banco
  async adicionar_produtos(req, res){
    try {
      var novo_produto = new Products()
      novo_produto = req.body;

      novo_produto.data_ultima_entrada = new Date().getTime()

      Products.countDocuments({}, function(err, result) {
        if (err) {
          console.log(err);
        }
      }).then((qtd) => {

        novo_produto.id_produto = qtd + 1

        // Adiciona o produto ao banco
        Products.create(novo_produto).then((prod) =>{

          res.json(prod)
          
        // Se ocorrer erro ao criar
        }).catch((erro) =>{
          res.status(500).send({
            message:
              erro.message || "Algum erro aconteceu ao tentar adicionar produtos."
          });
        })
      // Erro encontrar documentos
      }).catch((erro) =>{
        res.status(500).send({
        message:
        erro.message || "Algum erro aconteceu ao tentar encontrar estoque."
        });
      })
    } catch (error) {
      res.send("Algum erro ocorreu")
    }
  },

  // Encontrar produtos individuais dentro do banco
  async encontrar_produto_individual(req, res){
    try {
      produto = req.body;

      if ("titulo" in info_carrinho && "fornecedor" in info_carrinho){
        // Encontrar produtos
        Products.findOne({"titulo": produto.titulo, "fornecedor": produto.fornecedor}).then((prod) =>{

          if (prod.length == 0){
            res.json("Nenhum produto encontrado")
            return
          }

          res.json(prod[0])
          
        // Se ocorrer erro
        }).catch((erro) =>{
          res.status(500).send({
            message:
              erro.message || "Algum erro aconteceu ao tentar adicionar usuarios."
          });
        })
      }else{
        res.send("Algum erro aconteceu ao tentar encontrar esse produto.");
        return
      }

    } catch (error) {
      res.send("Algum erro ocorreu")
    }
  },
  // Modificar produto dentro do banco
  async modificar_produto(req, res){
    try {
      produto = req.body;

      if ("titulo" in info_carrinho && "fornecedor" in info_carrinho){

        Products.updateOne({"titulo": produto.titulo, "fornecedor": produto.fornecedor}, produto).then((prod) =>{

          if (prod.length == 0){
            res.json("Nenhum usuario encontrado")
            return
          }

          res.json(prod)
          
        // Se ocorrer erro
        }).catch((erro) =>{

          res.status(500).send({
            message:
              erro.message || "Algum erro aconteceu ao tentar adicionar usuarios."
          });

        })
      }
      else{
        res.send("Algum erro aconteceu ao tentar modificar o produto.");
        return
      }
    } catch (error) {
      res.send("Algum erro ocorreu - ", error)
    }
  },

  // Deletar produto dentro do banco
  async deletar_produto(req, res){
    try {
      produto = req.body
    
      if ("titulo" in info_carrinho && "fornecedor" in info_carrinho){
        
      // Deleta o usuario do banco
      Products.deleteOne({"titulo": produto.titulo, "fornecedor": produto.fornecedor}).then((prod) =>{
        if (prod.length == 0){
          res.json("Nenhum usuario encontrado")
          return
        }

        res.json(prod)
        
        // Se ocorrer erro ao deletar
        }).catch((erro) =>{
          res.status(500).send({
            message:
              erro.message || "Algum erro aconteceu ao tentar deletar usuarios."
          });
        })
      }else{
        res.send("Algum erro aconteceu ao tentar deletar o produto.");
        return
      }
    } catch (error) {
      res.send("Algum erro ocorreu")
    }
  }

}
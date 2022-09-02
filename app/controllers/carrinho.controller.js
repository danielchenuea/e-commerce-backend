var Usuario = require('../models/usuario.model.js')
var Products = require('../models/products.model.js')

module.exports = {
  // Retorna uma lista do carrinho do usuario.
  async mostrar_carrinho(req, res){
    try {
      carrinho_usuario = req.body

      if ("email" in carrinho_usuario){

        Usuario.find({"email": carrinho_usuario.email}).then((user) => {

            res.send(user[0].carrinho)
            return

        // Se não encontrar
        }).catch((erro) => {
            res.status(500).send({
              message:
                erro.message || "Algum erro aconteceu ao tentar retonar o carrinho."
            });
        })
      }else{
          res.send("É preciso passar um usuário.");
          return
      }        
    } catch (error) {
      res.send("Algum erro ocorreu - Carrinho - 1")
    }
  },

  // Adicionar produtos ao carrinho
  // { 
  //  email_usuario: string, 
  //  titulo_produto: string,
  //  fornecedor_produto: string,
  //  quantidade: int
  // }
  async adicionar_item(req, res){
    try {
    info_carrinho = req.body;

      if ("email" in info_carrinho && "titulo" in info_carrinho && 
          "fornecedor" in info_carrinho && "quantidade" in info_carrinho){
        
        // Encontrar carrinho do usuario
        Usuario.find({"email": info_carrinho.email}).then((user) => {

          carrinho = user[0].carrinho

          // Encontrar produto sendo modificado
          Products.find({"titulo": info_carrinho.titulo, "fornecedor": info_carrinho.fornecedor}).then((produtos) => {

            if (produtos.length == 0){
              res.json("Item não encontrado.");
              return
            }
            else{
              // Verifica se existe o estoque está válido
              if (produtos[0].quantidade_estoque <= 0 || produtos[0].permitir_compra == false){
                res.json("Algum erro aconteceu ao tentar adicionar itens.");
                return
              }
            }

            prod = produtos[0].id_produto

            // Se existe o produto no carrinho
            if (prod in carrinho){

              carrinho.quantidade_itens += info_carrinho.quantidade
              carrinho.valor_total += produtos[0].preço_individual * info_carrinho.quantidade

              carrinho[prod].quantidade += info_carrinho.quantidade

            }else{
              carrinho.quantidade_produtos += 1
              carrinho.quantidade_itens += info_carrinho.quantidade
              carrinho.valor_total += produtos[0].preço_individual * info_carrinho.quantidade

              carrinho[prod] = {
                "titulo": info_carrinho.titulo,
                "fornecedor": info_carrinho.fornecedor,
                "quantidade": info_carrinho.quantidade,
                "preço_individual": produtos[0].preço_individual
              }

            }

            nova_qtd_produtos = produtos[0].quantidade_estoque - 1
            
            // Atualizar carrinho
            Usuario.updateOne({"email": info_carrinho.email}, {"carrinho": carrinho}).then(() =>{

              // Atualizar estoque
              Products.updateOne({"titulo": info_carrinho.titulo, "fornecedor": info_carrinho.fornecedor}, 
              {"quantidade_estoque": nova_qtd_produtos}).then(() =>{

                res.json("Sucesso")
                return

                // Se ocorrer erro com update estoque
                }).catch((erro) =>{
                  res.status(500).send({
                  message:
                  erro.message || "Algum erro aconteceu ao tentar atualizar estoque."
                  });
                })
            // Se ocorrer erro com update carrinho
            }).catch((erro) =>{
              res.status(500).send({
                message:
                  erro.message || "Algum erro aconteceu ao tentar atualizar carrinho."
              });
            })
          // Se não encontrar produto
          }).catch((erro) => {
              res.status(500).send({
                message:
                  erro.message || "Algum erro aconteceu ao tentar encontrar o produto."
              });
          })
        // Se não encontrar usuario
        }).catch((erro) => {
            res.status(500).send({
              message:
                erro.message || "Algum erro aconteceu ao tentar encontrar o usuario."
            });
        })
      }else{
        res.send("Algum erro aconteceu ao tentar adicionar itens.");
        return
      }      
    } catch (error) {
      res.send("Algum erro ocorreu - Carrinho - 2")
    }
  },

  // Modificar produtos do carrinho
  // { 
  //  email_usuario: string, 
  //  titulo_produto: string,
  //  fornecedor_produto: string,
  //  modo_adicionar: bool,
  //  quantidade: int
  // }
  //
  async modificar_item(req, res){
    try {
      info_carrinho = req.body;

      if ("email" in info_carrinho && "titulo" in info_carrinho && 
          "fornecedor" in info_carrinho && "modo_adicionar" in info_carrinho &&
          "quantidade" in info_carrinho){
        
        // Encontrar carrinho do usuario
        Usuario.find({"email": info_carrinho.email}).then((user) => {

          carrinho = user[0].carrinho

          // Encontrar produto sendo modificado
          Products.find({"titulo": info_carrinho.titulo, "fornecedor": info_carrinho.fornecedor}).then((produtos) => {

            if (produtos.length == 0){
              res.json("Item não encontrado.");
              return
            }
            else if(!produtos[0].id_produto in carrinho){ // Verifica se há produtos no carrinho
              res.json("Não existe esse item no carrinho");
              return
            }
            else{
              // Verifica se existe o estoque está válido
              if (produtos[0].quantidade_estoque <= 0 || produtos[0].permitir_compra == false){
                res.json("Algum erro aconteceu ao tentar adicionar itens.");
                return
              }
            }

            prod_id = produtos[0].id_produto

            if (info_carrinho.modo_adicionar){ // Adicionar itens no carrinho
              if (produtos[0].quantidade_estoque >= info_carrinho.quantidade){

                carrinho.quantidade_itens += info_carrinho.quantidade
                carrinho.valor_total += produtos[0].preço_individual * info_carrinho.quantidade

                carrinho[prod_id].quantidade += info_carrinho.quantidade

                nova_qtd_produtos = produtos[0].quantidade_estoque - info_carrinho.quantidade

              }else{
                res.json("Não foi possivel adicionar essa quantidade de itens.");
                return
              }
            }else{ // Retirar itens do carrinho
              if (carrinho[prod_id].quantidade >= info_carrinho.quantidade){

                carrinho.quantidade_itens -= info_carrinho.quantidade
                carrinho.valor_total -= produtos[0].preço_individual * info_carrinho.quantidade

                carrinho[prod_id].quantidade -= info_carrinho.quantidade

                nova_qtd_produtos = produtos[0].quantidade_estoque + info_carrinho.quantidade

                if (carrinho[prod_id].quantidade == 0){ // Se retirou todos os itens
                  delete carrinho[prod_id]
                  carrinho.quantidade_produtos -= 1 
                }
              }else{
                res.json("Não foi possivel retirar essa quantidade de itens.");
                return
              }
            }
            
            // Atualizar carrinho
            Usuario.updateOne({"email": info_carrinho.email}, {"carrinho": carrinho}).then(() =>{

              // Atualizar estoque
              Products.updateOne({"titulo": info_carrinho.titulo, "fornecedor": info_carrinho.fornecedor}, 
              {"quantidade_estoque": nova_qtd_produtos}).then(() =>{

                res.json("Sucesso")
                return

                // Se ocorrer erro com update estoque
                }).catch((erro) =>{
                  res.status(500).send({
                  message:
                  erro.message || "Algum erro aconteceu ao tentar atualizar estoque."
                  });
                })
            // Se ocorrer erro com update carrinho
            }).catch((erro) =>{
              res.status(500).send({
                message:
                  erro.message || "Algum erro aconteceu ao tentar atualizar carrinho."
              });
            })
          // Se não encontrar produto
          }).catch((erro) => {
              res.status(500).send({
                message:
                  erro.message || "Algum erro aconteceu ao tentar encontrar o produto."
              });
          })
        // Se não encontrar usuario
        }).catch((erro) => {
            res.status(500).send({
              message:
                erro.message || "Algum erro aconteceu ao tentar encontrar o usuario."
            });
        })

      }else{
        res.send("Algum erro aconteceu ao tentar modificar itens.");
        return
      }      
    } catch (error) {
      res.send("Algum erro ocorreu - Carrinho - 3")
    }
  },

  // Remover produtos do carrinho
  // { 
  //  email_usuario: string, 
  //  titulo_produto: string,
  //  fornecedor_produto: string,
  // }
  //
  async remover_item(req, res){
    try {
      info_carrinho = req.body;

      if ("email" in info_carrinho && "titulo" in info_carrinho && "fornecedor" in info_carrinho){
        
        // Encontrar carrinho do usuario
        Usuario.find({"email": info_carrinho.email}).then((user) => {

          carrinho = user[0].carrinho

          // Encontrar produto sendo modificado
          Products.find({"titulo": info_carrinho.titulo, "fornecedor": info_carrinho.fornecedor}).then((produtos) => {

            if (produtos.length == 0){
              res.json("Item não encontrado.");
              return
            }
            else if(!produtos[0].id_produto in carrinho){ // Verifica se há produtos no carrinho
              res.json("Não existe esse item no carrinho");
              return
            }
            else{
              // Verifica se existe o estoque está válido
              if (produtos[0].quantidade_estoque <= 0 || produtos[0].permitir_compra == false){
                res.json("Algum erro aconteceu ao deletar itens.");
                return
              }
            }

            prod_id = produtos[0].id_produto

            carrinho.quantidade_produtos -= 1
            carrinho.quantidade_itens -= carrinho[prod_id].quantidade
            carrinho.valor_total -= produtos[0].preço_individual * carrinho[prod_id].quantidade

            nova_qtd_produtos = produtos[0].quantidade_estoque + carrinho[prod_id].quantidade

            delete carrinho[prod_id]
            
            // Atualizar carrinho
            Usuario.updateOne({"email": info_carrinho.email}, {"carrinho": carrinho}).then(() =>{

              // Atualizar estoque
              Products.updateOne({"titulo": info_carrinho.titulo, "fornecedor": info_carrinho.fornecedor}, 
              {"quantidade_estoque": nova_qtd_produtos}).then(() =>{

                res.json("Sucesso")
                return

                // Se ocorrer erro com update estoque
                }).catch((erro) =>{
                  res.status(500).send({
                  message:
                  erro.message || "Algum erro aconteceu ao tentar atualizar estoque."
                  });
                })
            // Se ocorrer erro com update carrinho
            }).catch((erro) =>{
              res.status(500).send({
                message:
                  erro.message || "Algum erro aconteceu ao tentar atualizar carrinho."
              });
            })
          // Se não encontrar produto
          }).catch((erro) => {
              res.status(500).send({
                message:
                  erro.message || "Algum erro aconteceu ao tentar encontrar o produto."
              });
          })
        // Se não encontrar usuario
        }).catch((erro) => {
            res.status(500).send({
              message:
                erro.message || "Algum erro aconteceu ao tentar encontrar o usuario."
            });
        })

      }else{
        res.send("Algum erro aconteceu ao tentar modificar itens.");
        return

      }   
    } catch (error) {
      res.send("Algum erro ocorreu - Carrinho - 4")
    }
  },
}
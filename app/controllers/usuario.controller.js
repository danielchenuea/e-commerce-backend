var Usuario = require('../models/usuario.model.js')

module.exports = {
    // Retorna uma lista de todos os usuarios.
    async lista_usuarios(req, res){
      try {
        // Se encontrar
        Usuario.find().then((user) => {

          res.send(user)

        // Se não encontrar
        }).catch((erro) => {
            res.status(500).send({
              message:
                erro.message || "Algum erro aconteceu ao tentar retonar a lista de usuarios."
            });
        })
      } catch (error) {
        res.send("Algum erro ocorreu")
      }
    },

    // Cadastrar usuarios dentro do banco
    async adicionar_novo_usuario(req, res){
      try {
        var novo_usuario = new Usuario()
        novo_usuario = req.body;

        novo_usuario.data_cadastro = new Date().getTime()
        novo_usuario.carrinho = {
          "produtos": {},
          "quantidade_produtos": 0,
          "quantidade_itens": 0,
          "valor_total": 0
        }
        Usuario.find({"email": novo_usuario.email}).then((repeated) => {
          if(repeated.length == 0){
            // Adiciona o usuario ao banco
            Usuario.create(novo_usuario).then((user) =>{

              res.json(user)
              
            // Se ocorrer erro
            }).catch((erro) =>{
              res.status(500).send({
                message:
                  erro.message || "Algum erro aconteceu ao tentar adicionar usuarios."
              });
            })            
          }else{
            res.send("Esse usuário já existe")
          }
        })
      } catch (error) {
        res.send("Algum erro ocorreu")
      }
        
    },

  // Encontrar usuarios individuais dentro do banco
  async encontrar_usuario(req, res){
    try {
      usuario_var = req.body;

      Usuario.findOne({"email": usuario_var.email}).then((user) =>{

        if (user.length == 0){
          res.json("Nenhum usuario encontrado")
          return
        }

        res.json(user[0])
        
      // Se ocorrer erro
      }).catch((erro) =>{
        res.status(500).send({
          message:
            erro.message || "Algum erro aconteceu ao tentar adicionar usuarios."
        });
      })
    } catch (error) {
      res.send("Algum erro ocorreu")
    }
    
  },

  // Modificar usuarios dentro do banco
  async modificar_usuario(req, res){
    try {
      usuario_var = req.body;

      Usuario.updateOne({"email": usuario_var.email}, usuario_var).then((user) =>{

        if (user.length == 0){
          res.json("Nenhum usuario encontrado")
          return
        }

        res.json(user)
        
      // Se ocorrer erro
      }).catch((erro) =>{
        res.status(500).send({
          message:
            erro.message || "Algum erro aconteceu ao tentar adicionar usuarios."
        });
      })
    } catch (error) {
      res.send("Algum erro ocorreu")
    }

  },

  // Deletar usuarios dentro do banco
  async deletar_usuario(req, res){
    try {
      usuario_var = req.body;

      Usuario.deleteOne({"email": usuario_var.email}).then((user) =>{

        if (user.length == 0){
          res.json("Nenhum usuario encontrado")
          return
        }

        res.json(user)
        
      // Se ocorrer erro
      }).catch((erro) =>{
        res.status(500).send({
          message:
            erro.message || "Algum erro aconteceu ao tentar deletar usuarios."
        });
      })        
    } catch (error) {
      res.send("Algum erro ocorreu")
    }

  }
}
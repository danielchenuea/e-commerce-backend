var app = require('./app/config/server')

app.listen(process.env.PORT,() => {
  console.log("Servidor ON")
})
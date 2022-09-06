var app = require('./app/config/server')

// app.listen(process.env.PORT,() => {
app.listen(3001,() => {
  console.log("Servidor ON")
})
var Mongoose = require('mongoose')

// Conexões mongo/mongoose para conectar com o banco de dados mongodb
Mongoose.connect(process.env.MONGODB_URI);
// Mongoose.connect('mongodb+srv://usuario1:lex8CkgfpNdQlHVa@coleta.4xqe0.mongodb.net/e-commerce-test?retryWrites=true&w=majority');
Mongoose.connection.on('connected', () => console.log('Connected to database'));
Mongoose.connection.on('error', (err) => console.log('Connection failed with - ',err));
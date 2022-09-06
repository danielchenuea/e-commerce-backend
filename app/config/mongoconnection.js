var Mongoose = require('mongoose')

// Conexões mongo/mongoose para conectar com o banco de dados mongodb
Mongoose.connect(process.env.MONGODB_URI);
Mongoose.connection.on('connected', () => console.log('Connected to database'));
Mongoose.connection.on('error', (err) => console.log('Connection failed with - ',err));
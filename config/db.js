require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Conectando ao MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            // As opções useNewUrlParser e useUnifiedTopology não são mais necessárias, então vamos removê-las
        });
        console.log("🔥 MongoDB Conectado!");
    } catch (error) {
        console.error("❌ Erro ao conectar ao MongoDB:", error);
        process.exit(1); // Encerra o processo em caso de erro
    }
};

module.exports = connectDB;

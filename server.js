const express = require("express");
const conectarDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();

console.log("MONGO_URI:", process.env.MONGO_URI);

const app = express();
const PORT = process.env.PORT || 5000;

// Garante que a resposta seja enviada como UTF-8
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Se estiver acessando de outro domínio

// Garante que a resposta seja enviada como UTF-8
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});

// Conectar ao banco de dados
conectarDB();

app.use(express.json());
app.use(cors());


// 🔥 Servir imagens estáticas para permitir o acesso às imagens salvas
app.use("/images", express.static("images"));

// Importar e usar as rotas
const cardapioRoutes = require("./routes/cardapioRoutes");
const eventosRoutes = require("./routes/eventosRoutes");
const imagensRoutes = require("./routes/imagensRoutes");
const categoriaRoutes = require("./routes/categoriaRoutes")

app.use("/cardapio", cardapioRoutes);
app.use("/eventos", eventosRoutes);
app.use("/imagens", imagensRoutes);
app.use("/categorias", categoriaRoutes);

app.listen(PORT, "0.0.0.0", () => { 
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

const mongoose = require("mongoose");

const pratoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    descricao: { type: String, required: true },
    preco: { type: Number, required: true },
    categoria: { type: String, required: true } // 🔹 Adicionado o campo categoria
});

module.exports = mongoose.model("Prato", pratoSchema);

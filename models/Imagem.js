const mongoose = require("mongoose");

const ImagemSchema = new mongoose.Schema({
    nome: String,
    caminho: String,  // Caminho do arquivo salvo
    data: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Imagem", ImagemSchema);

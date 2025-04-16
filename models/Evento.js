const mongoose = require("mongoose");

const EventoSchema = new mongoose.Schema({
    nome: { type: String, required: true },  // ✅ Agora obrigatório
    descricao: { type: String, required: true },
    data: { type: Date, required: true }
});

module.exports = mongoose.model("Evento", EventoSchema);

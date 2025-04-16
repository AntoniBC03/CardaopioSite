const express = require("express");
const Evento = require("../models/Evento");

const router = express.Router();

// 🔹 Rota para adicionar evento
router.post("/", async (req, res) => {
    try {
        console.log("📝 Dados recebidos do frontend:", req.body); // Debug

        // Verifica se os campos estão vindo corretamente
        if (!req.body.nome || !req.body.descricao || !req.body.data) {
            return res.status(400).json({ message: "⚠️ Todos os campos são obrigatórios!" });
        }

        const novoEvento = new Evento({
            nome: req.body.nome,
            descricao: req.body.descricao,
            data: new Date(req.body.data) // 💡 Converte para Date
        });

        await novoEvento.save();

        console.log("✅ Evento salvo no MongoDB:", novoEvento);
        res.status(201).json({ message: "✅ Evento adicionado!", evento: novoEvento });
    } catch (error) {
        console.error("❌ Erro ao adicionar evento:", error);
        res.status(500).json({ message: "❌ Erro ao adicionar evento", error });
    }
});

// 🔹 Rota para listar eventos
router.get("/", async (req, res) => {
    try {
        const eventos = await Evento.find();
        res.json(eventos);
    } catch (error) {
        res.status(500).json({ message: "❌ Erro ao buscar eventos", error });
    }
});

// 🔹 Rota para excluir evento
router.delete("/:id", async (req, res) => {
    try {
        const evento = await Evento.findById(req.params.id);
        if (!evento) {
            return res.status(404).json({ message: "⚠️ Evento não encontrado" });
        }

        await Evento.findByIdAndDelete(req.params.id);
        res.json({ message: "✅ Evento excluído!" });
    } catch (error) {
        res.status(500).json({ message: "❌ Erro ao excluir evento", error });
    }
});

module.exports = router;

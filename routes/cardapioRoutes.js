const express = require("express");
const Cardapio = require("../models/Prato");

const router = express.Router();

// 🔹 Rota para adicionar item ao cardápio
router.post("/", async (req, res) => {
    console.log("📩 Recebendo requisição:", req.body); // <-- Adicione esta linha
    try {
        const { nome, descricao, preco, categoria } = req.body;

        // Validação: todos os campos são obrigatórios
        if (!nome || !descricao || !preco || !categoria) {
            return res.status(400).json({ message: "⚠️ Todos os campos são obrigatórios!" });
        }

        const novoPrato = new Cardapio({ nome, descricao, preco, categoria });
        await novoPrato.save();
        
        res.status(201).json({ message: "✅ Prato adicionado!", prato: novoPrato });
    } catch (error) {
        res.status(500).json({ message: "❌ Erro ao adicionar prato", error: error.message });
    }
});

// 🔹 Rota para listar itens do cardápio (opcionalmente filtrando por categoria)
router.get("/", async (req, res) => {
    try {
        const { categoria } = req.query;
        let pratos;

        if (categoria) {
            pratos = await Cardapio.find({ categoria });
        } else {
            pratos = await Cardapio.find();
        }

        res.json(pratos);
    } catch (error) {
        res.status(500).json({ message: "❌ Erro ao buscar cardápio", error: error.message });
    }
});

// 🔹 Rota para excluir item do cardápio
router.delete("/:id", async (req, res) => {
    try {
        const prato = await Cardapio.findById(req.params.id);
        if (!prato) {
            return res.status(404).json({ message: "⚠️ Prato não encontrado" });
        }

        await Cardapio.findByIdAndDelete(req.params.id);
        res.json({ message: "✅ Prato excluído!" });
    } catch (error) {
        res.status(500).json({ message: "❌ Erro ao excluir prato", error: error.message });
    }
});

module.exports = router;

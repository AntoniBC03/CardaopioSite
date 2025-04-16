const express = require("express");
const Categoria = require("../models/Categoria");

const router = express.Router();

// 🔹 Rota para adicionar uma nova categoria
router.post("/", async (req, res) => {
    try {
        const { nome } = req.body;
        
        if (!nome) {
            return res.status(400).json({ message: "⚠️ O nome da categoria é obrigatório!" });
        }

        const novaCategoria = new Categoria({ nome });
        await novaCategoria.save();
        
        res.status(201).json({ message: "✅ Categoria adicionada!", categoria: novaCategoria });
    } catch (error) {
        res.status(500).json({ message: "❌ Erro ao adicionar categoria", error: error.message });
    }
});

// 🔹 Rota para listar todas as categorias
router.get("/", async (req, res) => {
    try {
        const categorias = await Categoria.find();
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ message: "❌ Erro ao buscar categorias", error: error.message });
    }
});

// 🔹 Rota para excluir categoria
router.delete("/:id", async (req, res) => {
    try {
        const categoria = await Categoria.findById(req.params.id);
        if (!categoria) {
            return res.status(404).json({ message: "⚠️ Categoria não encontrada" });
        }

        await Categoria.findByIdAndDelete(req.params.id);
        res.json({ message: "✅ Categoria excluída!" });
    } catch (error) {
        res.status(500).json({ message: "❌ Erro ao excluir categoria", error: error.message });
    }
});


module.exports = router;

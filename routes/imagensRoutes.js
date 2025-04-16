const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Imagem = require("../models/Imagem");

const router = express.Router();

// 🔹 Criar a pasta "images" caso não exista
const uploadFolder = "images";
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
}

// 🔹 Configuração do multer para armazenar imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// 🔹 Rota para enviar imagem
router.post("/", upload.single("imagem"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "❌ Nenhum arquivo enviado" });
    }

    try {
        const novaImagem = new Imagem({
            nome: req.file.filename,
            caminho: `/images/${req.file.filename}`
        });

        await novaImagem.save();
        res.status(201).json({ message: "✅ Imagem enviada!", imagem: novaImagem });
    } catch (error) {
        res.status(500).json({ message: "❌ Erro ao salvar imagem", error });
    }
});

// 🔹 Rota para listar imagens
router.get("/", async (req, res) => {
    try {
        const imagens = await Imagem.find();
        res.json(imagens);
    } catch (error) {
        res.status(500).json({ message: "❌ Erro ao buscar imagens", error });
    }
});

// 🔹 Rota para excluir imagem
router.delete("/:id", async (req, res) => {
    try {
        const imagem = await Imagem.findById(req.params.id);
        if (!imagem) {
            return res.status(404).json({ message: "⚠️ Imagem não encontrada" });
        }

        // Exclui o arquivo físico do servidor
        const caminhoImagem = path.join(__dirname, "..", imagem.caminho);
        if (fs.existsSync(caminhoImagem)) {
            fs.unlinkSync(caminhoImagem);
        }

        // Exclui do banco de dados
        await Imagem.findByIdAndDelete(req.params.id);
        res.json({ message: "✅ Imagem excluída!" });
    } catch (error) {
        res.status(500).json({ message: "❌ Erro ao excluir imagem", error });
    }
});

module.exports = router;

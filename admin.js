document.addEventListener("DOMContentLoaded", () => {
    carregarCardapio();
    carregarEventos();
    carregarImagens();
    carregarCategorias(); // ✅ Agora carregamos as categorias também
});

// 🔹 Carregar categorias do backend e preencher o <select>
async function carregarCategorias() {
    try {
        const resposta = await fetch("http://localhost:5000/categorias");
        const categorias = await resposta.json();

        console.log("📌 Categorias recebidas:", categorias); // 🛠️ Debug

        let categoriasContainer = document.getElementById("categorias-container");
        categoriasContainer.innerHTML = ""; // Limpa antes de adicionar

        categorias.forEach(categoria => {
            let categoriaDiv = document.createElement("div");
            categoriaDiv.classList.add("categoria"); // Estilo no CSS
            categoriaDiv.dataset.categoria = categoria.nome; // Armazena o nome para filtro depois
            categoriaDiv.innerHTML = `
                <h3>${categoria.nome}</h3>
                <div class="lista-cardapio" id="cardapio-${categoria.nome.replace(/\s/g, "-")}"></div>
            `;
            categoriasContainer.appendChild(categoriaDiv);
        });

        carregarCardapio(); // 🔹 Após carregar categorias, carregamos os pratos nos locais certos
    } catch (error) {
        console.error("❌ Erro ao carregar categorias:", error);
    }
}


// 🔹 Adicionar nova categoria ao banco e atualizar o <select>
document.getElementById("form-categoria").addEventListener("submit", async function(event) {
    event.preventDefault();

    let novaCategoria = document.getElementById("nova-categoria").value.trim();
    if (!novaCategoria) return;

    try {
        await fetch("http://localhost:5000/categorias", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome: novaCategoria })
        });

        alert("✅ Categoria adicionada!");
        document.getElementById("nova-categoria").value = ""; // Limpa o campo
        carregarCategorias(); // Atualiza a lista de categorias
    } catch (error) {
        console.error("❌ Erro ao adicionar categoria:", error);
    }
});


// 🔹 Função para carregar categorias e criar botões de remoção
async function carregarCategorias() {
    try {
        const resposta = await fetch("http://localhost:5000/categorias");
        const categorias = await resposta.json();

        let categoriaSelect = document.getElementById("categoria");
        let listaCategorias = document.getElementById("categorias-container"); // Novo elemento para exibir categorias com botão de remover

        categoriaSelect.innerHTML = "";
        listaCategorias.innerHTML = "";

        categorias.forEach(categoria => {
            // Criar opção no select
            let option = document.createElement("option");
            option.value = categoria.nome;
            option.textContent = categoria.nome;
            categoriaSelect.appendChild(option);

            // Criar um bloco de categoria ao invés de <li>
            let categoriaDiv = document.createElement("div");
            categoriaDiv.classList.add("categoria"); // Aplica os estilos
            categoriaDiv.innerHTML = `
                <span>${categoria.nome}</span>
                <button class="btn-excluir" onclick="excluirCategoria('${categoria._id}')">🗑️ Remover</button>
            `;

            listaCategorias.appendChild(categoriaDiv);

        });
    } catch (error) {
        console.error("❌ Erro ao carregar categorias:", error);
    }
}

// 🔹 Função para excluir categoria
async function excluirCategoria(id) {
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) return;

    try {
        const resposta = await fetch(`http://localhost:5000/categorias/${id}`, { method: "DELETE" });

        if (resposta.ok) {
            alert("✅ Categoria removida!");
            carregarCategorias();
        } else {
            alert("❌ Erro ao remover categoria!");
        }
    } catch (erro) {
        console.error("Erro ao excluir categoria:", erro);
    }
}




// 🔹 Carregar cardápio e exibir pratos com suas categorias
async function carregarCardapio() {
    try {
        const resposta = await fetch('http://localhost:5000/cardapio');
        const cardapio = await resposta.json();

        let lista = document.getElementById("lista-cardapio");
        lista.innerHTML = ""; // 🔹 Limpa antes de adicionar novos itens

        cardapio.forEach(item => {
            let li = document.createElement("li");
            li.classList.add("prato-item");
            li.innerHTML = `
                <strong>${item.nome}</strong> - R$${item.preco} <br>
                <span>${item.descricao}</span>
                <button class="btn-excluir" onclick="excluirItem('cardapio', '${item._id}')">🗑️ Excluir</button>
            `;
            lista.appendChild(li);
        });

        console.log("📌 Pratos carregados:", lista.innerHTML); // Debug no console
    } catch (erro) {
        console.error("❌ Erro ao carregar cardápio:", erro);
    }
}
// 🔹 Carregar eventos
async function carregarEventos() {
    try {
        const resposta = await fetch('http://localhost:5000/eventos');
        const eventos = await resposta.json();

        console.log("📌 Eventos carregados:", eventos); // 🔹 Debug no navegador

        let lista = document.getElementById("lista-eventos");
        lista.innerHTML = ""; // Limpa antes de adicionar novos itens

        eventos.forEach(evento => {
            let dataFormatada = new Date(evento.data).toLocaleDateString('pt-BR');

            let li = document.createElement("li");
            li.classList.add("evento-item");
            li.innerHTML = `
                <div class="evento-card">
                    <span class="emoji">🎉</span>
                    <div class="evento-info">
                        <h4>${evento.nome || 'Nome não definido'}</h4>
                        <p>${evento.descricao}</p>
                        <span class="evento-data">📅 ${dataFormatada}</span>
                    </div>
                    <button class="btn-excluir" onclick="excluirItem('eventos', '${evento._id}')">🗑️ Excluir</button>
                </div>
            `;

            console.log("🔹 Evento gerado:", li); // Debug

            lista.appendChild(li);
        });

        
        console.log("📌 Evento adicionado à lista:", lista.innerHTML);


    } catch (erro) {
        console.error("❌ Erro ao carregar eventos:", erro);
    }
}




// 🔹 Carregar imagens
async function carregarImagens() {
    try {
        const resposta = await fetch("http://localhost:5000/imagens");
        const imagens = await resposta.json();

        let galeria = document.getElementById("galeria");
        galeria.innerHTML = "";

        imagens.forEach(img => {
            let div = document.createElement("div");
            div.classList.add("item-imagem");
            div.innerHTML = `
                <img src="http://localhost:5000${img.caminho}" alt="${img.nome}" style="width: 100px; margin: 5px;">
                <button class="btn-excluir" onclick="excluirItem('imagens', '${img._id}')">🗑️ Excluir</button>
            `;
            galeria.appendChild(div);
        });
    } catch (erro) {
        console.error("Erro ao carregar imagens:", erro);
    }
}



// 🔹 Função para excluir itens
async function excluirItem(tipo, id) {
    if (!id || id === "undefined" || id === "null") {
        console.error("⚠️ ID inválido para exclusão:", id);
        alert("Erro: ID inválido para exclusão!");
        return;
    }

    if (!confirm("Tem certeza que deseja excluir este item?")) return;

    try {
        const resposta = await fetch(`http://localhost:5000/${tipo}/${id}`, { method: "DELETE" });

        if (resposta.ok) {
            alert("✅ Item excluído!");
            if (tipo === "cardapio") carregarCardapio();
            if (tipo === "eventos") carregarEventos();
            if (tipo === "imagens") carregarImagens();
        } else {
            alert("❌ Erro ao excluir!");
        }
    } catch (erro) {
        console.error("Erro ao excluir item:", erro);
    }
}



// 🔹 Adicionar item ao cardápio
document.getElementById("form-cardapio").addEventListener("submit", async function(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const descricao = document.getElementById("descricao").value;
    const preco = document.getElementById("preco").value;
    const categoria = document.getElementById("categoria").value; // ✅ Obtendo a categoria

    // 🔹 Verifica se algum campo está vazio
    if (!nome || !descricao || !preco || !categoria) {
        alert("❌ Todos os campos são obrigatórios!");
        return;
    }

    try {
        const resposta = await fetch("http://localhost:5000/cardapio", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, descricao, preco, categoria })
        });

        if (resposta.ok) {
            alert("✅ Item adicionado!");
            carregarCardapio();
        } else {
            alert("❌ Erro ao adicionar item!");
        }
    } catch (erro) {
        console.error("Erro ao adicionar item:", erro);
    }
});

// 🔹 Adicionar evento
document.getElementById("form-evento").addEventListener("submit", async function(event) {
    event.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const descricao = document.getElementById("descricao-evento").value;
    const data = document.getElementById("data").value;

    try {
        await fetch('http://localhost:5000/eventos', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome: titulo, descricao, data }) // ✅ "nome" correto
        });
        

        alert("✅ Evento adicionado!");
        carregarEventos();
    } catch (erro) {
        console.error("Erro ao adicionar evento:", erro);
    }
});

// 🔹 Adicionar imagens
document.getElementById("form-imagem").addEventListener("submit", async function(event) {
    event.preventDefault();

    const formData = new FormData();
    const imagem = document.getElementById("imagem").files[0];

    if (!imagem) {
        alert("Selecione uma imagem antes de enviar!");
        return;
    }

    formData.append("imagem", imagem);

    try {
        const resposta = await fetch("http://localhost:5000/imagens", {
            method: "POST",
            body: formData
        });

        if (resposta.ok) {
            alert("✅ Imagem enviada!");
            carregarImagens();
        } else {
            alert("❌ Erro ao enviar imagem!");
        }
    } catch (erro) {
        console.error("Erro ao enviar imagem:", erro);
    }
});

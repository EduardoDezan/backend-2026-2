/**
 * Zoológico - Gestão de Animais
 * 
 * Integração com API ASP.NET Core:
 * - GET    /api/animais       -> Listar todos os animais
 * - GET    /api/animais/{id}  -> Obter animal por ID
 * - POST   /api/animais       -> Cadastrar novo animal
 * - PUT    /api/animais/{id}  -> Atualizar animal existente
 * - DELETE /api/animais/{id}  -> Remover animal
 */

// Rota base relativa da API
const API_URL = "/api/animais";

// Estado da Aplicação em Memória (alimentado via API)
let listaAnimais = [];
let idEdicaoEmAndamento = null;

// Referências de Elementos do DOM
const formAnimal = document.getElementById("animal-form");
const inputId = document.getElementById("animal-id");
const inputNome = document.getElementById("animal-nome");
const selectSaudavel = document.getElementById("animal-saudavel");
const btnSubmit = document.getElementById("btn-submit");
const btnCancel = document.getElementById("btn-cancel");
const formTitle = document.getElementById("form-title");

const tabelaAnimais = document.getElementById("table-animais");
const tbodyAnimais = document.getElementById("tbody-animais");
const emptyState = document.getElementById("empty-state");
const emptyStateText = document.getElementById("empty-state-text");
const totalCountBadge = document.getElementById("total-count");

const searchInput = document.getElementById("search-input");
const filterSaude = document.getElementById("filter-saude");
const feedbackContainer = document.getElementById("feedback-container");

// Inicialização ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    configurarEventos();
    carregarAnimais();
});

// Configuração de Event Listeners
function configurarEventos() {
    formAnimal.addEventListener("submit", tratarEnvioFormulario);
    btnCancel.addEventListener("click", cancelarEdicao);
    searchInput.addEventListener("input", renderizarTabela);
    filterSaude.addEventListener("change", renderizarTabela);
}

/**
 * Exibe mensagem de notificação / feedback para o usuário
 */
function exibirFeedback(mensagem, tipo = "success") {
    feedbackContainer.replaceChildren();

    const alertDiv = document.createElement("div");
    alertDiv.className = `feedback-alert feedback-${tipo}`;
    alertDiv.setAttribute("role", "alert");

    const spanMsg = document.createElement("span");
    spanMsg.textContent = mensagem;

    const btnFechar = document.createElement("button");
    btnFechar.type = "button";
    btnFechar.className = "btn btn-sm btn-secondary";
    btnFechar.textContent = "✕";
    btnFechar.setAttribute("aria-label", "Fechar notificação");
    btnFechar.addEventListener("click", () => alertDiv.remove());

    alertDiv.appendChild(spanMsg);
    alertDiv.appendChild(btnFechar);
    feedbackContainer.appendChild(alertDiv);

    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (alertDiv.parentElement) {
            alertDiv.remove();
        }
    }, 5000);
}

/**
 * Controla o estado dos botões durante requisições de rede
 */
function definirCarregando(carregando) {
    if (carregando) {
        btnSubmit.disabled = true;
        btnCancel.disabled = true;
    } else {
        btnSubmit.disabled = false;
        btnCancel.disabled = false;
    }
}

/**
 * GET /api/animais - Busca todos os animais cadastrados na API
 */
async function carregarAnimais() {
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Falha ao consultar a API (Status: ${response.status} ${response.statusText})`);
        }

        const dados = await response.json();
        listaAnimais = Array.isArray(dados) ? dados : [];
        renderizarTabela();
    } catch (erro) {
        console.error("Erro ao carregar lista de animais:", erro);
        exibirFeedback(`Erro ao carregar animais da API: ${erro.message}`, "error");
        
        listaAnimais = [];
        renderizarTabela();
        if (emptyStateText) {
            emptyStateText.textContent = "Não foi possível carregar os animais da API.";
        }
    }
}

/**
 * GET /api/animais/{id} - Busca um animal específico pelo ID na API
 */
async function obterAnimalPorId(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    });

    if (response.status === 404) {
        throw new Error(`Animal com ID #${id} não foi encontrado.`);
    }

    if (!response.ok) {
        throw new Error(`Erro ao obter animal (Status: ${response.status})`);
    }

    return await response.json();
}

/**
 * POST /api/animais e PUT /api/animais/{id} - Envio de dados do formulário
 */
async function tratarEnvioFormulario(event) {
    event.preventDefault();

    const nome = inputNome.value.trim();
    const saudavel = selectSaudavel.value === "true";

    // Validação de campo obrigatório
    if (!nome) {
        exibirFeedback("Por favor, informe o nome do animal.", "error");
        inputNome.focus();
        return;
    }

    definirCarregando(true);

    try {
        if (idEdicaoEmAndamento !== null) {
            // ==========================================
            // MODO EDIÇÃO: PUT /api/animais/{id}
            // ==========================================
            const animalAtualizado = {
                id: idEdicaoEmAndamento,
                nome: nome,
                saudavel: saudavel
            };

            const response = await fetch(`${API_URL}/${idEdicaoEmAndamento}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(animalAtualizado)
            });

            if (response.status === 404) {
                throw new Error("O animal selecionado não existe mais no banco de dados.");
            }

            if (!response.ok) {
                throw new Error(`Erro na atualização (Status: ${response.status} ${response.statusText})`);
            }

            exibirFeedback(`Animal #${idEdicaoEmAndamento} (${nome}) atualizado com sucesso!`, "success");
            cancelarEdicao();
            await carregarAnimais();
        } else {
            // ==========================================
            // MODO CADASTRO: POST /api/animais
            // ==========================================
            const novoAnimal = {
                nome: nome,
                saudavel: saudavel
            };

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(novoAnimal)
            });

            if (response.status !== 201 && !response.ok) {
                throw new Error(`Erro ao cadastrar animal (Status: ${response.status} ${response.statusText})`);
            }

            const animalCriado = await response.json();
            const idGerado = animalCriado.id ?? animalCriado.Id ?? "";

            exibirFeedback(`Animal "${nome}" cadastrado com sucesso! ${idGerado ? `(ID #${idGerado})` : ""}`, "success");
            cancelarEdicao();
            await carregarAnimais();
        }
    } catch (erro) {
        console.error("Erro ao salvar animal:", erro);
        exibirFeedback(`Falha ao salvar animal: ${erro.message}`, "error");
    } finally {
        definirCarregando(false);
    }
}

/**
 * Prepara o formulário para editar um animal existente
 * Utiliza GET /api/animais/{id} para carregar os dados mais recentes da API
 */
window.prepararEdicao = async function(id) {
    try {
        definirCarregando(true);
        const animal = await obterAnimalPorId(id);

        const animalId = animal.id ?? animal.Id;
        const animalNome = animal.nome ?? animal.Nome ?? "";
        const animalSaudavel = animal.saudavel ?? animal.Saudavel;

        idEdicaoEmAndamento = animalId;
        inputId.value = animalId;
        inputNome.value = animalNome;
        selectSaudavel.value = String(animalSaudavel);

        formTitle.textContent = `Editar Animal (#${animalId})`;
        btnSubmit.innerHTML = `<span class="btn-icon">🔄</span> Atualizar Animal`;
        btnCancel.style.display = "inline-flex";

        inputNome.focus();
    } catch (erro) {
        console.error("Erro ao carregar dados do animal para edição:", erro);
        exibirFeedback(`Não foi possível preparar edição: ${erro.message}`, "error");
    } finally {
        definirCarregando(false);
    }
};

/**
 * Cancela o modo de edição e redefine o formulário
 */
function cancelarEdicao() {
    idEdicaoEmAndamento = null;
    formAnimal.reset();
    inputId.value = "";

    formTitle.textContent = "Cadastrar / Editar Animal";
    btnSubmit.innerHTML = `<span class="btn-icon">💾</span> Salvar Animal`;
    btnCancel.style.display = "none";
}

/**
 * DELETE /api/animais/{id} - Remove um animal após confirmação do usuário
 */
window.excluirAnimal = async function(id, nome) {
    const confirmacao = confirm(`Deseja realmente excluir o animal "${nome}" (ID #${id}) da API?`);
    if (!confirmacao) return;

    try {
        definirCarregando(true);

        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (response.status === 404) {
            throw new Error("O animal já havia sido removido ou não foi encontrado.");
        }

        if (response.status !== 204 && !response.ok) {
            throw new Error(`Erro ao excluir (Status: ${response.status} ${response.statusText})`);
        }

        if (idEdicaoEmAndamento === id) {
            cancelarEdicao();
        }

        exibirFeedback(`Animal "${nome}" (ID #${id}) excluído com sucesso!`, "success");
        await carregarAnimais();
    } catch (erro) {
        console.error("Erro ao excluir animal:", erro);
        exibirFeedback(`Falha ao excluir animal: ${erro.message}`, "error");
    } finally {
        definirCarregando(false);
    }
};

/**
 * Renderiza a lista de animais na tabela utilizando estritamente textContent
 * para inserir os dados recebidos da API (segurança contra XSS e cumprimento de critério).
 */
function renderizarTabela() {
    const termoBusca = searchInput.value.toLowerCase().trim();
    const filtroStatus = filterSaude.value;

    const animaisFiltrados = listaAnimais.filter(animal => {
        const nomeAnimal = animal.nome ?? animal.Nome ?? "";
        const saudavelAnimal = animal.saudavel ?? animal.Saudavel;

        const atendeNome = nomeAnimal.toLowerCase().includes(termoBusca);
        const atendeSaude = filtroStatus === "all" || String(saudavelAnimal) === filtroStatus;
        return atendeNome && atendeSaude;
    });

    // Atualizar contador de animais
    totalCountBadge.textContent = `Total: ${animaisFiltrados.length}`;

    // Limpar corpo da tabela
    tbodyAnimais.replaceChildren();

    if (animaisFiltrados.length === 0) {
        if (emptyStateText) {
            emptyStateText.textContent = listaAnimais.length === 0
                ? "Nenhum animal cadastrado no banco de dados."
                : "Nenhum animal encontrado para o filtro aplicado.";
        }
        emptyState.style.display = "block";
        tabelaAnimais.style.display = "none";
        return;
    }

    emptyState.style.display = "none";
    tabelaAnimais.style.display = "table";

    // Criar e preencher linhas da tabela com textContent
    animaisFiltrados.forEach(animal => {
        const animalId = animal.id ?? animal.Id;
        const animalNome = animal.nome ?? animal.Nome ?? "";
        const animalSaudavel = Boolean(animal.saudavel ?? animal.Saudavel);

        const tr = document.createElement("tr");

        // 1. Coluna ID (usando textContent)
        const tdId = document.createElement("td");
        const strongId = document.createElement("strong");
        strongId.textContent = `#${animalId}`;
        tdId.appendChild(strongId);
        tr.appendChild(tdId);

        // 2. Coluna Nome (usando textContent)
        const tdNome = document.createElement("td");
        tdNome.textContent = animalNome;
        tr.appendChild(tdNome);

        // 3. Coluna Saúde (usando textContent)
        const tdSaude = document.createElement("td");
        const spanSaude = document.createElement("span");
        spanSaude.className = `badge ${animalSaudavel ? "badge-healthy" : "badge-care"}`;
        spanSaude.textContent = animalSaudavel ? "🟢 Saudável" : "🟡 Requer Cuidados";
        tdSaude.appendChild(spanSaude);
        tr.appendChild(tdSaude);

        // 4. Coluna Ações (Botões)
        const tdAcoes = document.createElement("td");
        tdAcoes.className = "text-right";

        const divAcoes = document.createElement("div");
        divAcoes.className = "table-actions";

        // Botão Editar
        const btnEditar = document.createElement("button");
        btnEditar.type = "button";
        btnEditar.className = "btn btn-sm btn-outline-primary";
        btnEditar.textContent = "✏️ Editar";
        btnEditar.setAttribute("aria-label", `Editar animal ${animalNome}`);
        btnEditar.addEventListener("click", () => window.prepararEdicao(animalId));

        // Botão Excluir
        const btnExcluir = document.createElement("button");
        btnExcluir.type = "button";
        btnExcluir.className = "btn btn-sm btn-outline-danger";
        btnExcluir.textContent = "🗑️ Excluir";
        btnExcluir.setAttribute("aria-label", `Excluir animal ${animalNome}`);
        btnExcluir.addEventListener("click", () => window.excluirAnimal(animalId, animalNome));

        divAcoes.appendChild(btnEditar);
        divAcoes.appendChild(btnExcluir);
        tdAcoes.appendChild(divAcoes);
        tr.appendChild(tdAcoes);

        tbodyAnimais.appendChild(tr);
    });
}

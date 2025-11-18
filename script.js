let tarefas = []

const form = document.getElementById('formTarefas')

const tabelaCorpo = document.getElementById('table-body')

form.addEventListener('submit', function(event) {
    event.preventDefault();

   

    const tarefa = document.getElementById('tarefa').value;
    const prioridade = document.getElementById('prioridade').value;
    const descricao = document.getElementById('descricao').value;
    const prazo = document.getElementById('prazo').value;

    if(!tarefa || !prioridade || !prazo || !descricao){
        console.log("Por favor preencha todos os dados");
        return;
    }

    const hoje = new Date();
    const dataPrazo = new Date(prazo);
    if(dataPrazo < hoje){
        console.log("O prazo preenchido já passou");
        return;
    }
    //função tendo os arrays de valores do HTML inseridos
    adicionarTarefa(tarefa, prioridade, prazo, descricao);

    form.reset();//apaga o cache do form
})

//Função responsável por atualizar as tarefas do array quando são alteradas
function atualizarTarefas(){
    const tarefasSalvas = localStorage.getItem('tarefas');
    
    if(tarefasSalvas){
        tarefas = JSON.parse(tarefasSalvas);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    atualizarTarefas();
    listarTarefas();
})

//Salva as tarefas digitadas no sistema do histórico
function salvarTarefas(){
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

//Adiciona as tarefas inseridas nos campos "tarefas","prioridade","prazo" e "descrição"
//no formúlario de forma padronizada
function adicionarTarefa(tarefa, prioridade, prazo, descricao){
    const novaTarefa = {
        id: Date.now(), 
        tarefa, 
        prioridade, 
        prazo, 
        descricao, 
        concluido: false,
    };
    tarefas.push(novaTarefa);
    listarTarefas()
    salvarTarefas()
}

//Remove todas as tarefas existentes no formulario
function removerTodas(index){
    if(confirm('Realmente deseja apagar todas as tarefas da sua lista?')){
        console.log("Tarefas Removidas");
        tarefas.length = 0;
        listarTarefas();
        salvarTarefas();
    }
}

//Remove todos os dados de uma tarefa existente no formúlario
function removerTarefa(index){
    if(confirm('Realmente deseja apagar esta tarefa de sua lista?')){
        console.log("Tarefa {index} removida");
        tarefas.splice(index, 1);
        listarTarefas();
        salvarTarefas();
    }
}

//Permite o código identificar se a tarefa está concluída ou não
function estaConcluida(index){
    tarefas[index].concluido = !tarefas[index].concluido 
    listarTarefas();
    salvarTarefas();
}

//O código filtra as tarefas concluídas 
function filtrarConcluídas(){
    document.getElementById("filtro").addEventListener("click", filtrarConcluídas);
    tarefas.filter
    const tarefasAntigas = [...tarefas]
    tarefas = tarefas.filter(task => task.concluido === true);
}

//Coloca os dados em ordem "prioritaria", classificação dada em "baixo","médio" e "alto"
function ordernarPrioridades(){
    const ordemPrioridade = { alta: 3, media: 2, baixa: 1 };
    tarefas.sort((a, b) => ordemPrioridade[b.prioridade] - ordemPrioridade[a.prioridade]);
    listarTarefas();
    salvarTarefas();

    return;
}

function listarTarefas(){
    tabelaCorpo.innerHTML = '';
    if (tarefas.length === 0){
        tabelaCorpo.innerHTML = 
        '<tr><td>Nenhuma tarefa foi atribuida</td></tr>'
        return;
    }
    tarefas.forEach((tarefa, index) => {
        const linha = document.createElement('tr');

        if(tarefa.concluido){
            linha.classList.add('concluiu')
        }

        const dataHoje = new Date();
        const dataPrazo = new Date(tarefa.prazo)
        const dataComparacao = dataPrazo < dataHoje ? 'Prazo Vencido' :
                                dataPrazo.toDateString() === dataHoje.toDateString() ? 'Prazo Hoje' :
                                '';
        
        linha.innerHTML = `
        <td>${tarefa.prioridade}</td>
        <td>${tarefa.tarefa}</td>
        <td>${tarefa.descricao}</td>
        <td>${tarefa.prazo}</td>
        <td><input type = "checkbox" onchange = estaConcluida(${index}) ${tarefa.concluido ? 'checked' : ''}></td>
        <td>
            <button onclick="editarTarefa(${index})">Editar</button>
            <button onclick="removerTarefa(${index})">Remover</button>
        </td>
        `;

        tabelaCorpo.appendChild(linha);
    })
}
//Capaz de alterar as informações já estabelecidas no formúlario
function editarTarefa(index){
    const tarefa = tarefas[index]
    const novaTarefa = prompt('Nova Tarefa:', tarefa.tarefa);
    const novaPrioridade = prompt('Nova Prioridade (baixa ou alta):', tarefa.prioridade);
    const novoPrazo = prompt('Novo Prazo (aaaa/mm/dd):', tarefa.prazo);
    const novaDescricao = prompt('Nova Descrição:', tarefa.descricao);

    if(novaTarefa && prioridade && prazo && descricao){
        tarefas[index] = {
            ...tarefa, 
            tarefa: novaTarefa,
            prioridade: novaPrioridade,
            prazo: novoPrazo,
            descricao: novaDescricao
        };
        listarTarefas();
        salvarTarefas();
    }
}

function logout() {
    localStorage.removeItem('sb_token')
    localStorage.removeItem('sb_refresh_token')
    localStorage.removeItem('sb_user')
    window.location.href = './Login/html/index.html'
}

const botao = document.getElementById('logoutBtn')
if(botao) {
    botao.addEventListener('click', () => {
        logout()
    })
}
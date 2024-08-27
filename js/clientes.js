var btnCadastrar= document.getElementById("btn-cadastrar");
var tabela = document.querySelector('table>tbody');

function buscaTabela(){
    let entrada = document.getElementById("searchInput").value.toLowerCase();
    let table = document.getElementById("tabelaClientes");
    let tr = table.getElementsByTagName("tr");

    for(let i = 1; i < tr.length; i++){
        let nomeTd = tr[i].getElementsByTagName("td")[0];
        let cpfTd = tr[i].getElementsByTagName("td")[1];

        let nome = nomeTd.textContent.toLowerCase();
        let cpf = cpfTd.textContent.toLowerCase();

        if(nome.indexOf(entrada) > -1 || cpf.indexOf(entrada) > -1){
            tr[i].style.display = "";
        }else{
            tr[i].style.display = "none";
        }
    }
}

var modal = {
   nome: document.getElementById('nome'),
   cpf: document.getElementById('cpf'),
   dataNascimento: document.getElementById('data'),
   email: document.getElementById('email'),
   btnSalvar: document.getElementById('btn-salvar'),
   btnSair: document.getElementById('btn-sair')
};

btnCadastrar.addEventListener('click', (e) =>{
    e.preventDefault();
    abrirModalCliente();
});

modal.btnSalvar.addEventListener('click', (e) => {
    e.preventDefault();
    let cliente = criarCliente();

    if (!cliente.modeloValido()) {
        mostrarAlerta("Todos os campos são obrigatórios para o cadastro!");
        return;
    }

    const linha = document.querySelector('tr[data-editing="true"]');

    if (linha) {

        console.log(modal.cpf.value);

        // Atualiza os dados na linha
        linha.cells[0].textContent = cliente.nome;
        linha.cells[1].textContent = cliente.cpf;
        linha.cells[2].textContent = cliente.dataNascimento;
        linha.cells[3].textContent = cliente.email;

        console.log(linha.getAttribute("original_cpf"));

        linha.removeAttribute('data-editing'); // Remove o identificador de edição

        atualizarCliente(cliente, linha.getAttribute("original_cpf"));
    } else {
        // Se não for uma edição, adiciona uma nova linha
        adicionarClienteNaTabela(cliente);
        salvarCliente(cliente);
        limparCampos();
    }
    fecharModalCliente();
});


modal.btnSair.addEventListener('click', (e) =>{
    e.preventDefault();
    limparCampos();
    fecharModalCliente();
});


function abrirModalCliente(){
    $("#btn-cadastrar").click(function(){
        $("#cadastro-cliente").modal({backdrop: "static"});
    });
}

function fecharModalCliente(){
    $("#btn-sair").click(function(){
        $("#cadastro-cliente").modal("hide");
    });
}

function criarCliente(){
    return new Cliente({
        nome: modal.nome.value,
        cpf: modal.cpf.value,
        dataNascimento: modal.dataNascimento.value, 
        email: modal.email.value,
    });
}

function salvarCliente(cliente){
    fetch("http://52.15.243.61:3000/clientes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cliente)
    })
    .then(response => response.text())
    .then(data => {
        console.log("Cliente salvo", data);
    })

    .catch(error => console.error("Erro ao salvar cliente:", error));
}

function limparCampos(){
    modal.nome.value = "";
    modal.cpf.value = "";
    modal.dataNascimento.value = "";
    modal.email.value = "";

    esconderAlerta();
}

function adicionarClienteNaTabela(cliente){

    var tr = document.createElement('tr');
    var tdNome = document.createElement('td');
    var tdCpf = document.createElement('td');
    var tdDataNascimento = document.createElement('td');
    var tdEmail = document.createElement('td');
    var tdAcoes = document.createElement('td');

    tdNome.textContent = cliente.nome;
    tdCpf.textContent = cliente.cpf;
    tdDataNascimento.textContent = cliente.dataNascimento;
    tdEmail.textContent = cliente.email;
    tdAcoes.innerHTML = `<button type="button" class="btn btn-link" id="btn-excluir">Excluir</button>/
                         <button type="button" class="btn btn-link" id ="bnt-editar">Editar</button>`

    const btnExcluir = tdAcoes.querySelector('.btn.btn-link:nth-child(1)');    
    const btnEditar = tdAcoes.querySelector('.btn.btn-link:nth-child(2)'); 
    
    btnExcluir.addEventListener('click', excluirCliente);    
    btnEditar.addEventListener('click', editarCliente);
                         
    tr.appendChild(tdNome);
    tr.appendChild(tdCpf);
    tr.appendChild(tdDataNascimento);
    tr.appendChild(tdEmail);
    tr.appendChild(tdAcoes);

    tabela.appendChild(tr);
}

function editarCliente(event){
    const linha = event.target.closest("tr");
    const nome = linha.cells[0].textContent;
    const cpf = linha.cells[1].textContent;
    const dataNascimento = linha.cells[2].textContent;
    const email = linha.cells[3].textContent;

   modal.nome.value = nome;
   modal.cpf.value = cpf;
   modal.dataNascimento.value = dataNascimento;
   modal.email.value = email;
   
    linha.setAttribute("original_cpf", cpf);

    linha.setAttribute("data-editing", "true");  
    $("#cadastro-cliente").modal({backdrop: "static"});   
     
}


function excluirCliente(event) {
    const linha = event.target.closest("tr");
    const cpf = linha.getElementsByTagName("td")[1].textContent; // Supondo que a linha tenha um atributo data-id com o ID do cliente
    console.log(linha.getElementsByTagName("td")[1].textContent);

    fetch(`http://52.15.243.61:3000/clientes/${cpf}`, {
        method: "DELETE"
    })
    .then(response => {
        if (response.ok) {
            const tabela = document.getElementById("tabelaClientes");
            const rowIndex = linha.rowIndex;
            tabela.deleteRow(rowIndex);
            console.log("Cliente excluído com sucesso.");
        } else {
            console.error("Erro ao excluir cliente.");
        }
    })
    .catch(error => console.error("Erro ao excluir cliente:", error));
}

function carregarClientes(){
    console.log("GetClientes clientes.js\n");
    fetch("http://52.15.243.61:3000/clientes", {  // Substitua pela URL correta
        method: "GET"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(clientes => {
        clientes.forEach(cliente => {
            adicionarClienteNaTabela(cliente);
        });
    })
    .catch(error => console.error("Erro: ", error));
}

function atualizarCliente(cliente, cpfOriginal) {
    fetch(`http://52.15.243.61:3000/clientes/${cpfOriginal}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cliente)
    })
    .then(response => response.text())
    .then(data => {
        console.log("Cliente atualizado", data);
    })
    .catch(error => console.error("Erro ao atualizar cliente:", error));
}

document.addEventListener("DOMContentLoaded", carregarClientes);

let myTable = document.querySelector('#table');
let headers = ['cliente_id', 'nome', 'endereco', 'gostos'];

async function fetchClientes() {
    try {
        const response = await fetch('http://127.0.0.1:5000/clientes');
        if (!response.ok) {
            throw new Error('Failed to fetch data from the server');
        }
        const {clientes} = await response.json();
        return clientes;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function generateTable(clientes) {
    myTable.innerHTML = " "; // Limpa o conteúdo anterior

    let table = document.createElement('table');
    let headerRow = document.createElement('tr');

    // Define os headers da tabela
    headers.forEach(headerText => {
        let header = document.createElement('th');
        let textNode = document.createTextNode(headerText);
        header.appendChild(textNode);
        headerRow.appendChild(header);
    });

    // Adiona o header no botão Delete
    let deleteHeader = document.createElement('th');
        deleteHeader.textContent = 'Ações'; // Actions column
        headerRow.appendChild(deleteHeader);

    table.appendChild(headerRow);

    // Preenche as tabelas com dados
    clientes.forEach(cliente => {
        let row = document.createElement('tr');
        row.setAttribute('data-cliente-id', cliente.cliente_id);

    // Preenche as células com dados
    headers.forEach(header => {
        let cell = document.createElement('td');
        let textNode = document.createTextNode(cliente[header]);
        cell.appendChild(textNode);
        row.appendChild(cell);
    });

    // Cria a célula para as ações (Excluir e Atualizar)
    let actionCell = document.createElement('td');

    // Adiciona o botão Delete
    let deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir'; // Delete button text
        deleteButton.addEventListener('click', () => deleteClient(cliente.cliente_id));
        actionCell.appendChild(deleteButton);

    // Adiciona o botão Update
    let updateButton = document.createElement('button');
        updateButton.textContent = 'Atualizar'; // Update button text
        updateButton.addEventListener('click', () => populateFormForUpdate(cliente.cliente_id)); // Fill the form with client data
        actionCell.appendChild(updateButton);


    // Adiciona a célula de ação à linha
    row.appendChild(actionCell);

    // Adiciona a linha à tabela
    table.appendChild(row);
});


    // Anexa a tabela ao container
    myTable.appendChild(table);
}


document.addEventListener('DOMContentLoaded', async function() {
    const clientes = await fetchClientes();
    generateTable(clientes);
});


// Funcao para criar um novo cliente

let nextClienteId = 1;

async function submitForm() {
    // Toma os valores do input
    const nome = document.getElementById("newNome").value;
    const gostos = document.getElementById("newGostos").value;
    const endereco = document.getElementById("newEndereco").value;

    let clienteId = nextClienteId;
    nextClienteId++; 
    
    // Cria um objeto JSON
    const requestBody = {
        "cliente_id": clienteId,
        "nome": nome,
        "endereco": endereco,
        "gostos": gostos
    };

    try {
        let url = `http://127.0.0.1:5000/clientes/${clienteId}`
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.text();
        
        // Chama a função generateTable após o envio do form
        generateTable(await fetchClientes());

        // Limpa os campos do input
        document.getElementById("form").reset();

        nome.value = ''
        gostos.value = ''
        endereco.value = ''

        alert('Registro criado com sucesso!')
    } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
    }

    
}



// Funcao para deletar um cliente 

async function deleteClient(clienteId) {

    try {
        // Requisicao DELETE para deletar um cliente 
        const deleteUrl = `http://127.0.0.1:5000/clientes/${clienteId}`;
        const deleteResponse = await fetch(deleteUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!deleteResponse.ok) {
            throw new Error('Failed to delete client. Network response was not ok.');
        }

        // Envia mensagem de sucesso ou informações adicionais após a exclusão
        console.log(`Client ID ${clienteId} deletado.`);


        alert(`Cliente ID ${clienteId} excluído com sucesso!`);
    } catch (error) {
        console.error('Erro ao deletar:', error);
        alert(`Erro ao excluir cliente ID ${clienteId}. Verifique o console para mais detalhes.`);
    }
}

// função para atualizar os dados de um cliente

// Preenche o formulário para atualização
function populateFormForUpdate(cliente) {
    document.getElementById('newNome').value = cliente.nome;
    document.getElementById('newGostos').value = cliente.gostos;
    document.getElementById('newEndereco').value = cliente.endereco;

    // Adiciona um atributo de cliente_id ao formulário para fazer a atualização posteriormente
    document.getElementById('form').setAttribute('data-cliente-id', cliente.cliente_id);

    // Altera o comportamento do botão de envio
    document.querySelector('.button input').value = 'Atualizar';
    document.querySelector('.button input').onclick = () => updateClient(cliente);
}


// Função para atualizar os dados dos clientes
async function updateClient(clienteId) {

    const nome = document.getElementById('newNome').value;
    const gostos = document.getElementById('newGostos').value;
    const endereco = document.getElementById('newEndereco').value;

    const requestBody = {
        "nome": nome,
        "endereco": endereco,
        "gostos": gostos
    };

    try {
        let url = `http://127.0.0.1:5000/clientes/${clienteId}`;  // Make sure the clienteId is correct
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        alert(`Cliente ID ${clienteId} atualizado com sucesso!`);
        generateTable(await fetchClientes()); // Atualiza a tabela

        // Limpa o formulário após a atualização
        document.getElementById('form').reset();
        document.getElementById('form').removeAttribute('data-cliente-id');
        document.querySelector('.button input').value = 'Enviar'; // Retorna ao comportamento de envio de novo cliente
        document.querySelector('.button input').onclick = submitForm;
    } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
    }
}


  // Event listener para form submission
  document.getElementById("address-form").addEventListener("submit", function (e) {
    e.preventDefault();  // Prevent form submission
    const address = document.getElementById("address").value;
  
    // Faz a chamada para pegar os dados da localização 
    fetch("http://localhost:5000/api/getLocation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: address }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.lat && data.lng) {
          const lat = data.lat;
          const lng = data.lng;
  
          // Mostra as coordenadas
          document.getElementById("location-result").innerText = `Latitude: ${lat}, Longitude: ${lng}`;
  
          // Inicia ou atualiza o mapa com a nova localização
          const map = L.map('map').setView([lat, lng], 13);
  
          // Add OpenStreetMap 
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);
  
          // Adiciona o marcador na localização
          L.marker([lat, lng]).addTo(map)
            .bindPopup('Location: ' + address)
            .openPopup();
        } else {
          document.getElementById("location-result").innerText = "Location not found.";
        }
      })
      .catch(error => console.error("Error fetching geolocation:", error));
  });
  
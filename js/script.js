
var map;

// Adicionando o layer do OpenStreetMap
function initializeMap() {
    if (!map) {
        map = L.map('map'); // Inicializa o mapa vazio
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
    }
}

// Formulário e evento de envio
document.getElementById('addressForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Previne o comportamento padrão do formulário

    const cep = document.getElementById('cep').value;
    const logradouro = document.getElementById('logradouro').value;
    const coordinates = document.getElementById('coordinates').value;

    // Verificar se as coordenadas foram inseridas diretamente
    if (coordinates) {
        const [lat, lon] = coordinates.split(',');
        setMapLocation(lat, lon);
    } else {
        let query = '';
        if (cep) {
            query = cep;
        } else if (logradouro) {
            query = logradouro; 
        }
        if (query) {
            geocode(query); 
        }
    }
});

// Função para geocodificar o endereço
function geocode(query) {
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=br&addressdetails=1`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const lat = data[0].lat;
                const lon = data[0].lon;
                setMapLocation(lat, lon);
            } else {
                alert('Localização não encontrada!');
            }
        })
        .catch(error => console.error('Erro:', error));
}

// Função para centralizar o mapa nas coordenadas fornecidas
function setMapLocation(lat, lon) {
    initializeMap(); // Inicializa o mapa, se ainda não estiver inicializado
    map.setView([lat, lon], 13); // Centraliza o mapa nas novas coordenadas
    L.marker([lat, lon]).addTo(map) // Adiciona um marcador na localização encontrada
        .bindPopup('Localização encontrada').openPopup(); // Exibe um popup ao clicar
}

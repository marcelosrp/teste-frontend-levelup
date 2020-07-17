'use strict'

const app = {
    btnPesquisa: null,
    cepField: undefined,
    divResultado: null,
    divContentEndereco: null,
    btnNovaPesquisa: null,
    error: null,
    map: undefined,

    init() {
        this.btnPesquisa = document.querySelector('.btn-pesquisar');
        this.cepField = document.querySelector('.cep-field');
        this.divResultado = document.querySelector('.endereco');
        this.divContentEndereco = document.querySelector('.content-endereco');
        this.btnNovaPesquisa = document.querySelector('.btn-nova-pesquisa');
        this.error = document.querySelector('.error');
        this.map = document.getElementById('map')

        this.btnPesquisa.addEventListener('click', () => {
            const cep = this.cepField.value.replace('-', '');

            if(this.validaCep(cep)) {
                this.error.innerHTML = "";
                this.btnPesquisa.setAttribute('disabled', true)
                this.buscaCEP(cep);
            }
        });

        this.btnNovaPesquisa.addEventListener('click', () => {
            this.novaPesquisa();
        });
    },

    validaCep(cep) {
        const testaCep = /^[0-9]{8}$/;

        if(cep === "") {
            this.error.innerHTML = "O campo CEP não pode estar vazio.";
            return false;
        }

        if(!testaCep.test(cep)) {
            this.error.innerHTML = "Formato de CEP inválido.";
            return false;
        }

        return true;
    },

    buscaCEP(cep) {
        const url = `https://viacep.com.br/ws/${cep}/json/`;

        axios.get(url)
            .then(res => {
                const data = res.data;

                this.resultado(data);
                this.montaMapa(data)
            })
    },

    resultado(data) {
        const { bairro, cep, localidade, logradouro, uf } = data;

        const template = `
            <h1>${logradouro}</h1>
            <p>${bairro}</p>
            <p>${localidade} - ${uf}</p>
            <p>${cep}</p>
        `

        this.divContentEndereco.innerHTML = template;
        this.divResultado.classList.remove('hide');
        this.divResultado.appendChild(this.divContentEndereco);
    },

    montaMapa(data) {
        const { logradouro, cep, uf, localidade } = data;

        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${logradouro} ${localidade} ${uf} ${cep}.json?country=BR&access_token=pk.eyJ1IjoibWFyY2Vsb3NycCIsImEiOiJja2NxZWJ6ZGIwdXFrMndvYjRqY212MTMyIn0.RZuCbrv8fPfkjcZoBjwp0g`;

        axios.get(url)
            .then(res => {

                mapboxgl.accessToken = 'pk.eyJ1IjoibWFyY2Vsb3NycCIsImEiOiJja2NxZWR4bmgwZnk1MnpxbTI0ZXBrYmxtIn0.LzZdvUxhA_RoQWzDbr7V2w';

                const map = new mapboxgl.Map({
                    container: this.map,
                    style: 'mapbox://styles/mapbox/streets-v11',
                    center: [res.data.features[0].center[0], res.data.features[0].center[1]],
                    zoom: 14
                });

                const marker = new mapboxgl.Marker()
                    .setLngLat([res.data.features[0].center[0], res.data.features[0].center[1]])
                    .addTo(map);
            })
    },

    novaPesquisa() {
        this.divContentEndereco.innerHTML = "";
        this.divResultado.classList.add('hide');
        this.divResultado.appendChild(this.divContentEndereco);
        this.btnPesquisa.removeAttribute('disabled', true)
        this.cepField.value = "";
        this.cepField.focus();
    }
}

app.init();
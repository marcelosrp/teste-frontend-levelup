'use strict';

var app = {
  btnPesquisa: null,
  cepField: undefined,
  divResultado: null,
  divContentEndereco: null,
  btnNovaPesquisa: null,
  error: null,
  map: undefined,
  init: function init() {
    var _this = this;

    this.btnPesquisa = document.querySelector('.btn-pesquisar');
    this.cepField = document.querySelector('.cep-field');
    this.divResultado = document.querySelector('.endereco');
    this.divContentEndereco = document.querySelector('.content-endereco');
    this.btnNovaPesquisa = document.querySelector('.btn-nova-pesquisa');
    this.error = document.querySelector('.error');
    this.map = document.getElementById('map');
    this.btnPesquisa.addEventListener('click', function () {
      _this.dispatchClick();
    });
    this.btnNovaPesquisa.addEventListener('click', function () {
      _this.novaPesquisa();
    });
    this.cepField.addEventListener('keyup', function (event) {
      if (event.keyCode === 13) {
        _this.dispatchClick();
      }
    });
  },
  dispatchClick: function dispatchClick() {
    var cep = this.cepField.value.replace('-', '');

    if (this.validaCep(cep)) {
      this.error.innerHTML = "";
      this.btnPesquisa.setAttribute('disabled', true);
      this.buscaCEP(cep);
    }
  },
  validaCep: function validaCep(cep) {
    var testaCep = /^[0-9]{8}$/;

    if (cep === "") {
      this.error.innerHTML = "O campo CEP não pode estar vazio.";
      return false;
    }

    if (!testaCep.test(cep)) {
      this.error.innerHTML = "Formato de CEP inválido.";
      return false;
    }

    return true;
  },
  buscaCEP: function buscaCEP(cep) {
    var _this2 = this;

    var url = "https://viacep.com.br/ws/".concat(cep, "/json/");
    axios.get(url).then(function (res) {
      var data = res.data;

      _this2.resultado(data);

      _this2.montaMapa(data);
    });
  },
  resultado: function resultado(data) {
    var bairro = data.bairro,
        cep = data.cep,
        localidade = data.localidade,
        logradouro = data.logradouro,
        uf = data.uf;
    var template = "\n            <h1>".concat(logradouro, "</h1>\n            <p>").concat(bairro, "</p>\n            <p>").concat(localidade, " - ").concat(uf, "</p>\n            <p>").concat(cep, "</p>\n        ");
    this.divContentEndereco.innerHTML = template;
    this.divResultado.classList.remove('hide');
    this.divResultado.appendChild(this.divContentEndereco);
  },
  montaMapa: function montaMapa(data) {
    var _this3 = this;

    var logradouro = data.logradouro,
        cep = data.cep,
        uf = data.uf,
        localidade = data.localidade;
    var url = "https://api.mapbox.com/geocoding/v5/mapbox.places/".concat(logradouro, " ").concat(localidade, " ").concat(uf, " ").concat(cep, ".json?country=BR&access_token=pk.eyJ1IjoibWFyY2Vsb3NycCIsImEiOiJja2NxZWJ6ZGIwdXFrMndvYjRqY212MTMyIn0.RZuCbrv8fPfkjcZoBjwp0g");
    axios.get(url).then(function (res) {
      mapboxgl.accessToken = 'pk.eyJ1IjoibWFyY2Vsb3NycCIsImEiOiJja2NxZWR4bmgwZnk1MnpxbTI0ZXBrYmxtIn0.LzZdvUxhA_RoQWzDbr7V2w';
      var map = new mapboxgl.Map({
        container: _this3.map,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [res.data.features[0].center[0], res.data.features[0].center[1]],
        zoom: 14
      });
      var marker = new mapboxgl.Marker().setLngLat([res.data.features[0].center[0], res.data.features[0].center[1]]).addTo(map);
    });
  },
  novaPesquisa: function novaPesquisa() {
    this.divContentEndereco.innerHTML = "";
    this.divResultado.classList.add('hide');
    this.divResultado.appendChild(this.divContentEndereco);
    this.btnPesquisa.removeAttribute('disabled', true);
    this.cepField.value = "";
    this.cepField.focus();
  }
};
app.init();
//# sourceMappingURL=app.js.map

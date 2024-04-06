const https = require('https')
const express = require('express')
const axios = require('axios')

const apiurl = "https://servicebus2.caixa.gov.br/portaldeloterias/api/megasena/"
const port = process.env.PORT || 3001;

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const app = express()
app.use(express.json()) // for parsing application/json bodies

app.set('view engine', 'ejs')

app.get('/:nr_conc?', async (req, res) => {
  var nr_conc = req.params.nr_conc;

  let meusjogos = [
    ["03","15","18","23","40","54"],
    ["01","02","12","29","46","51"],
    ["04","08","22","37","41","56"],
    ["02","04","07","14","25","33"],
    ["04","09","13","24","30","55"]
  ]

  const endpoint = `${apiurl}${nr_conc}`
  
  axios.get(endpoint, { httpsAgent })
    // Print data
    .then(response => {
      const dt = response.data;
      res.render('home', {
        concurso: dt.numero,
        listaDezenas: dt.listaDezenas,
        dataApuracao: dt.dataApuracao,
        dataProximoConcurso: dt.dataProximoConcurso,
        valorEstimadoProximoConcurso: formata_moeda(dt.valorEstimadoProximoConcurso),
        lista_numeros: dt.listaDezenas,
        concurso_anterior: dt.numeroConcursoAnterior,
        concurso_proximo: dt.numeroConcursoProximo,
        rateio: {
          sena: formata_qtde(dt.listaRateioPremio[0].numeroDeGanhadores),
          premioSena: formata_moeda(dt.listaRateioPremio[0].valorPremio),
          quina: formata_qtde(dt.listaRateioPremio[1].numeroDeGanhadores),
          premioQuina: formata_moeda(dt.listaRateioPremio[1].valorPremio),
          quadra: formata_qtde(dt.listaRateioPremio[2].numeroDeGanhadores),
          premioQuadra: formata_moeda(dt.listaRateioPremio[2].valorPremio),
        },
        meusjogos: meusjogos,
      });
    })
    // Print error message if occur
    .catch(error => {
      console.log(`Error to fetch data\n ${error}`);
      res.render('error');
    })
});

function formata_moeda(valor) {
  var dinheiro = valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
  return dinheiro;
}

function formata_qtde(qtd) {
  var q = qtd.toLocaleString('pt-br');
  return q;
}

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;


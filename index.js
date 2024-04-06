const https = require('https')
const express = require('express')
const axios = require('axios')

const apiurl = "https://servicebus2.caixa.gov.br/portaldeloterias/api/megasena/"
const port = 3000

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const app = express()
app.use(express.json()) // for parsing application/json bodies

app.set('view engine', 'ejs')

app.get('/:nr_conc?', async (req, res) => {
  const jogos_ori = [
    {"de":2400,"ate":3000,"jogo":["03","15","18","23","40","54"]},
    {"de":2400,"ate":3000,"jogo":["01","02","12","29","46","51"]},
    {"de":2400,"ate":3000,"jogo":["04","08","22","37","41","56"]},
    {"de":2400,"ate":3000,"jogo":["02","04","07","14","25","33"]},
    {"de":2400,"ate":3000,"jogo":["04","09","13","24","30","55"]}
  ]

  var jogos = JSON.stringify(jogos_ori);

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

// app.listen(process.env.PORT || port);
app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening on port ${port}`)
});

// module.exports = app;

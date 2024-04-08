const express = require('express');

const apiurl = "https://servicebus2.caixa.gov.br/portaldeloterias/api/megasena/";
const port = process.env.PORT || 3001;

const meusjogos = [
  ["03","15","18","23","40","54"],
  ["01","02","12","29","46","51"],
  ["04","08","22","37","41","56"],
  ["02","04","07","14","25","33"],
  ["04","09","13","24","30","55"]
];

const app = express();
app.set('views', 'views');
app.set('view engine', 'ejs');
app.use(express.json()); // for parsing application/json bodies
app.use(express.urlencoded({extended:true}));

app.get('/:nr_conc?', async (req, res) => {
  let nr_conc = req.params.nr_conc ?? "";
  const endpoint = `${apiurl}${nr_conc}`;

  try {
    dt = await getData(endpoint);

    res.render('home', {
      concurso: dt.numero,
      listaDezenas: dt.listaDezenas,
      dataApuracao: dt.dataApuracao,
      dataProximoConcurso: dt.dataProximoConcurso,
      valorEstimadoProximoConcurso: format_curr(dt.valorEstimadoProximoConcurso),
      lista_numeros: dt.listaDezenas,
      concurso_anterior: dt.numeroConcursoAnterior,
      concurso_proximo: dt.numeroConcursoProximo,
      rateio: {
        sena: format_qty(dt.listaRateioPremio[0].numeroDeGanhadores),
        premioSena: format_curr(dt.listaRateioPremio[0].valorPremio),
        quina: format_qty(dt.listaRateioPremio[1].numeroDeGanhadores),
        premioQuina: format_curr(dt.listaRateioPremio[1].valorPremio),
        quadra: format_qty(dt.listaRateioPremio[2].numeroDeGanhadores),
        premioQuadra: format_curr(dt.listaRateioPremio[2].valorPremio),
      },
      meusjogos: meusjogos,
    });
  } catch(err) {
    res.render('error');
    console.log('ERROR', err);
  }
});

function format_curr(valor) {
  var r = valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
  return r;
}

function format_qty(qtd) {
  var q = qtd.toLocaleString('pt-br');
  return q;
}

async function getData(endpoint) {
  const response = await fetch(endpoint);
  const jsonResponse = await response.json();
  // console.log(jsonResponse);
  return jsonResponse;
} 

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import { isAfter, parse } from 'date-fns';

// const apiurl = "https://servicebus2.caixa.gov.br/portaldeloterias/api/megasena/";
const apiurl = 'https://api.guidi.dev.br/loteria/megasena/';
const port = process.env.PORT || 3001;

const meusjogos = [
  ['03', '15', '18', '23', '40', '54'],
  ['01', '02', '12', '29', '46', '51'],
  ['04', '08', '22', '37', '41', '56'],
  ['02', '04', '07', '14', '25', '33'],
  ['04', '09', '13', '24', '30', '55'],
];

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/:id?', async (req, res) => {
  try {
    const nrConc = req.params.id ?? 'ultimo';
    if (nrConc === 'ultimo' || !isNaN(nrConc)) {
      // console.log(req.params);
      const endpoint = `${apiurl}${nrConc}`;
      // console.log(endpoint);

      const response = await axios.get(endpoint);
      const dt = await response.data;
      const hoje = new Date(new Date().toDateString());

      // const hoje = new Date();
      const prox = parse(dt.dataProximoConcurso, 'dd/MM/yyyy', new Date());
      // console.log(` hoje: ${hoje.toString()}\n`, `prox: ${prox.toString()}`);
      const mostraBotao = !isAfter(prox, hoje);
      // console.log(`botao: ${mostraBotao}`);

      res.render('home.ejs', {
        concurso: dt.numero,
        listaDezenas: dt.listaDezenas,
        dataApuracao: dt.dataApuracao,
        dataProximoConcurso: dt.dataProximoConcurso,
        valorEstimadoProximoConcurso: fmtCurrency(
          dt.valorEstimadoProximoConcurso
        ),
        lista_numeros: dt.listaDezenas,
        concurso_anterior: dt.numeroConcursoAnterior,
        concurso_proximo: dt.numeroConcursoProximo,
        rateio: {
          sena: fmtQty(dt.listaRateioPremio[0].numeroDeGanhadores),
          premioSena: fmtCurrency(dt.listaRateioPremio[0].valorPremio),
          quina: fmtQty(dt.listaRateioPremio[1].numeroDeGanhadores),
          premioQuina: fmtCurrency(dt.listaRateioPremio[1].valorPremio),
          quadra: fmtQty(dt.listaRateioPremio[2].numeroDeGanhadores),
          premioQuadra: fmtCurrency(dt.listaRateioPremio[2].valorPremio),
        },
        meusjogos,
        botaoProximo: mostraBotao,
      });
    }
  } catch (error) {
    console.log(`Error to fetch data\n ${error}`);
    res.render('error.ejs');
  }
});

function fmtCurrency(valor) {
  const r = valor.toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL',
  });
  return r;
}

function fmtQty(qtd) {
  const q = qtd.toLocaleString('pt-br');
  return q;
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

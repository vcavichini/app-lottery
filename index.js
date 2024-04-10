import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

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
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/jogo/:id?', async (req, res) => {
  try {
    const nr_conc = req.params.id ?? "";
    console.log(req.params);
    const endpoint = `${apiurl}${nr_conc}`;
    console.log(endpoint);

    const response = await axios.get(endpoint);
    const dt = response.data;
    // console.log(dt);
    res.render('home.ejs', {
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
  }
  catch (error) {
      console.log(`Error to fetch data\n ${error}`);
      res.render('error.ejs');
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

const express = require('express');
const axios = require('axios');

const server = express();
server.use(express.json());

server.get('/cira/:redacao', (req, res) => {
  const { redacao } = req.params;
  axios.get('http://143.107.183.175:15680/score_essay?text=' + redacao)
    .then((resp) => {
      return res.json(resp.data);
    })
    .catch((erro) => {
      return res.json(erro.exception);
    })
})

server.get('/chatgpt/:tema', (req, res) => { 
  const { tema } = req.params;

  axios.post('https://api.openai.com/v1/completions',{
      model: "text-davinci-003",
      prompt: "faça uma redação do gênero dissertativo-argumentativo sobre" + tema + " considerando que é de extrema importancia a redação conter no minimo 430 palavras e que tenha somente 4 parágrafos contendo introdução, desenvolvimento e conclusão. tente também fazer citações relevantes ao tema e não se esqueça que é de extrema importância o texto estar em terceira pessoa",
      max_tokens: 3000
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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'
      }
    })
    .then((resp) => {
      return res.json(resp.data);
    })
    .catch((erro) => {
      return res.json(erro.exception);
    })
})

server.listen(3000);
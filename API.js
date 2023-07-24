const mqtt = require("mqtt");
const { Pool } = require("pg");
require("dotenv").config();

const protocol = "mqtt";
const host = "broker.emqx.io";
const port = "1883";
const connectUrl = `${protocol}://${host}:${port}`;

//Tempo percorrido para definir sensor como desconectado em minutos
const tempoOciosomm = 1

//intervalo de Tempo percorrido para verificar todos os sensores em minutos
const checkIntervalmm = 2

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});

// Conexão com o servidor EMQX
const mqttClient = mqtt.connect(connectUrl);

// Evento de conexão bem-sucedida
mqttClient.on("connect", () => {
  console.log("Conexão com o servidor Mosquitto estabelecida.");

  // Inscreva-se em um tópico para ouvir mensagens
  mqttClient.subscribe("italo/esp32/#", () => {
    console.log(`Subscribe all topics`);
  });
});

// Evento de mensagem recebida
mqttClient.on("message", function (topic, payload) {

  // Payload é o Buffer
  var local = "";
  const partes = topic.split("/");
  if (partes.length > 2) {
  local = partes.slice(2).join("/");
  console.log("Mensagem: " + payload.toString() + " Topico: " + local);
  }

  var split = payload.toString().split(";");
  var idSensor = parseInt(split[1].split(/[a-zA-Z]+/)[1]);
  var valorSensor = split[0];

  var selectQuery = `SELECT * FROM public.dados_sensor WHERE sensor = ${idSensor}`;
  pool.query(selectQuery, (error, results) => {
    if (error) {
      console.error(error);
    } else {
      var selectRow = results.rows;
      if (selectRow.length > 0) {
        var updateQuery = `UPDATE public.dados_sensor SET sensor=${idSensor}, local='${local}', valor=${valorSensor},data=CURRENT_TIMESTAMP, status=true, min=0`;
        pool.query(updateQuery, (error) => {
          if (error) {
            console.error(error);
          }
        });
      } else {
        var insertQuery = {
          text: "INSERT INTO public.dados_sensor (sensor, valor, data, status, min) VALUES ($1, $2, CURRENT_TIMESTAMP, true, 0)",
          values: [idSensor, valorSensor, status],
        };

        pool.query(insertQuery, (error) => {
          if (error) {
            console.error(error);
          }
        });
      }
    }
  });
});

function verificaLeitura(results) {
  for (let i = 0; i < results.length; i++) {
    let sensor = results[i].sensor;
    let data = results[i].data;

    let dataAtual = new Date();
    let dataBanco = new Date(data);

    // Calcula a diferença em milissegundos entre as duas datas
    let mls = dataAtual - dataBanco;

    // Calcula o tempo passado em minutos
    let minutosPassados = Math.floor(mls / 60000);

    //vertifica se o tempo é maior que o tempo ocioso, caso sim, atualiza o status
    if(minutosPassados >= tempoOciosomm){
      var updateQuery = `UPDATE public.dados_sensor SET status=false, min=${minutosPassados} WHERE sensor=${sensor}`;
        pool.query(updateQuery, (error) => {
          if (error) {
            console.error(error);
          } else {
            console.log("Sensor " + sensor +": Desligou. Minutos desligado:" +minutosPassados);
          }
        });
    }else{
      console.log("Sensor" + sensor +" Ativo");
    }
  }
}

//função que vai verificar todos os sensores depois de um intervalo
setInterval(function () {
  const selectQuery = `SELECT sensor, data FROM public.dados_sensor`;
  pool.query(selectQuery, (error, resultado) => {
    if (error) {
      console.error(error);
    } else {
      verificaLeitura(resultado.rows);
    }
  });
}, checkIntervalmm * 60000);

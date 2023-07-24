require('dotenv').config()
const { Telegraf } = require('telegraf');
const { Pool } = require('pg');

const botToken = process.env.TOKEN
const bot = new Telegraf(botToken);

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});


bot.start((ctx) => {
  ctx.reply('Bem-vindo! Envie uma mensagem para testar o bot.');
});

bot.help((ctx) => {
  ctx.reply('Comandos disponíveis:\n/start - Inicia o bot\n/help - Exibe ajuda');
});

bot.command('teste', (ctx) => {
    ctx.reply('teste');
  });

  

function checarSensor() {

  pool.query('SELECT * FROM dados_sensor', (error, results) => {
    if (error) {
      console.error(error);
    } else {
      const groupId = "-1001910154687"

      for (let i = 0; i < results.rows.length; i++) {
        const row = results.rows[i];
        console.log('Valor do sensor:', row.valor);
        console.log('Status:', row.status);
        if(row.status == true){
          if(row.valor >= 1000){
            const mensagem = `🔥 Pode estar havendo um incêndio no Sensor ${row.sensor}, valor: ${row.valor}`
            bot.telegram.sendMessage(groupId, mensagem);
          }else{
            return
          }
        }else{

          if(row.min == 1){
            const mensagem = `🛠 Sensor ${row.sensor} precisa de uma atenção, pode estar desabilitado ou quebrado`;
            bot.telegram.sendMessage(groupId, mensagem);
          }else{
            console.log('Sensor desabilitado, notificações ja foram enviadas')
          }

        }
    
      }
    }
  });

}

const intervaloSegundos = 5;
setInterval(checarSensor, intervaloSegundos * 1000);

bot.launch();
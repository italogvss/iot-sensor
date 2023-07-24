# iot-sensor
Sensor para detecção de gases toxicos que notifica via Bot no Telegram caso haja muita presença de gases toxicos no ambiente

Neste projeto há tres aplicações:

Sensor.ino -> Script que ira rodar dentro de um ESP-32 para detectar a presença de gases toxicos utilizando um sensor MQ-135 e postando as leituras em um MQTT Broker Publico

API.js -> API que ira se inscrever e ouvir os topicos do MQTT BRoker Publico em que o sensor esta postando mensagens, para processar esses dados e armazenar em um banco de dados Postgres

Bot.js -> Aplicação do bot do Telegram que ira ler do banco de dados as leituras e notificar por meio de mensagens os usuarios que tiverem o bot em seus grupos, dando a informação se algum sensor parou de responder ou um aviso de presença de gases toxicos, o que indica um incendio

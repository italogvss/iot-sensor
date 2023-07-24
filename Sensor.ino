#include <WiFi.h>
#include <PubSubClient.h>

const char* ssid = "Rede";
const char* wfpassword = "123456789";
const char* username = "emqx";
const char* password = "public";
const char* pubTopic = "italo/esp32/bloco12/sala3";
const char* id = "sensor1";
const unsigned int writeInterval = 5000; 

const char* mqtt_server = "broker.emqx.io";
unsigned int mqtt_port = 1883;

#define MQ135_THRESHOLD_1   1000   

WiFiClient broker;
PubSubClient client(broker);

void setup() {
  Serial.begin(115200);
  Serial.println("*****************************************************");
  Serial.println("Iniciando ESP");
  Serial.print("Conectando no WIFI: ");
  Serial.println(ssid);

  WiFi.begin(ssid, wfpassword);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("->WiFi conectado com endereço: ");
  Serial.println(WiFi.localIP());
  
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void loop() {

  if (!client.connected()) 
    reconnect();
  client.loop();
  
   int MQ135_data = analogRead(A0);

  if(MQ135_data < MQ135_THRESHOLD_1){
    Serial.print("Ar Fresco: ");
  } else {
    Serial.print("Ar Ruim: "); 
  }
    Serial.print(MQ135_data); 
    Serial.println(" PPM"); 
  
  Serial.println("Publicando dados no Broker");
  char mqtt_payload[30] = "";
  snprintf (mqtt_payload, 30, "%ld;%s", MQ135_data, id);
  Serial.print("Mensagem publicada: ");
  Serial.println(mqtt_payload);
  client.publish(pubTopic, mqtt_payload);
  Serial.println("Fim");
  Serial.println("*****************************************************");
  
 delay(writeInterval);// delay
}


void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Mensagem recebida [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("********** Tentando conexão com o MQTT...");
    // Attempt to connect
    if (client.connect(id, username, password)) {  
      Serial.println("MQTT client conectado");
    } else {
      Serial.print("falhou, rc= ");
      Serial.print(client.state());
      Serial.println("\nTentando novamente...");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}
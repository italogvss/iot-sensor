# iot-sensor
This repository presents an intricate project that combines JavaScript, Arduino, and the ESP-32 board to create a toxic gas detection system. The system employs an MQ-135 sensor to detect hazardous gases and promptly notifies users via a Telegram bot. The project comprises three interconnected applications, each serving a critical purpose.

# Applications

1. Sensor.ino
This application is designed to run on an ESP-32 board with the MQ-135 gas sensor. It detects the presence of toxic gases and communicates the readings to a public MQTT broker.

3. API.js
The API application plays a pivotal role in processing the data received from the MQTT broker. It subscribes to the relevant topics, processes the data, and stores it in a PostgreSQL database for future reference.

3. Bot.js
The Telegram bot application serves as a vital communication channel with the end-users. It reads the gas detection data stored in the PostgreSQL database and sends notifications to users' Telegram groups. Notifications include alerts for unresponsive sensors and warnings about toxic gas presence, indicating potential fire hazards.

# how to Use
Sensor Operation: The ESP-32 board with the MQ-135 sensor will continuously monitor gas levels and post readings to the public MQTT broker.

API Listening: The API application will listen to the MQTT topics and store the received data in the PostgreSQL database.

Bot Notifications: The Telegram bot will read gas detection data from the database and send timely notifications to users. These notifications include alerts about unresponsive sensors and warnings about toxic gas presence.

# Conclusion
This intricate project showcases the integration of hardware, MQTT communication, databases, and Telegram bot interactions. By combining JavaScript, Arduino, and ESP-32 capabilities, you've created a robust toxic gas detection and notification system that can potentially save lives in hazardous situations.

Feel free to explore, contribute, and adapt this project for your learning and development needs!

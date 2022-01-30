#include "config.h"

// Import required libraries
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <Servo.h>

static const int servosPins[2] = {21, 23}; //base, giro

Servo servos[2];
int servoPos1 = 0;
int servoPos2 = 0;
float prevServoPos1 = 0;
float prevServoPos2 = 0;

unsigned long previousMillis = 0;

const char* PARAM_INPUT_1 = "servo1";
const char* PARAM_INPUT_2 = "servo2";

void setServos(int Servo1Val, int Servo2Val) {
  servoPos1 = constrain(Servo1Val, 0, 180);
  servoPos2 = constrain(Servo2Val, 0, 180);
}

void increaseServos(int servoIncrease1, int servoIncrease2) {
  int Servo1Val = servoPos1 + servoIncrease1;
  int Servo2Val = servoPos2 + servoIncrease2;
  setServos(Servo1Val, Servo2Val);
}

void moveServos(){
  if((round(prevServoPos1) != servoPos1) || (round(prevServoPos2) != servoPos2)){
  unsigned long currentMillis = millis();
    if (currentMillis - previousMillis > 45) {
      float smoothPos1 = (servoPos1 * 0.05) + (prevServoPos1 * 0.95);
      float smoothPos2 = (servoPos2 * 0.05) + (prevServoPos2 * 0.95);
      /*
      Serial.print("servoPos1: ");
      Serial.print(servoPos1);
      Serial.print("\t smoothPos1: ");
      Serial.print(smoothPos1);
      Serial.print("\t prevServoPos1: ");
      Serial.print(prevServoPos1);
      Serial.print("\t round(prevServoPos1): ");
      Serial.println(round(prevServoPos1));
      
      Serial.print("servoPos2: ");
      Serial.print(servoPos2);
      Serial.print("\t smoothPos2: ");
      Serial.print(smoothPos2);
      Serial.print("\t prevServoPos2: ");
      Serial.print(prevServoPos2);
      Serial.print("\t round(prevServoPos2): ");
      Serial.println(round(prevServoPos2));
      */
      servos[0].write(smoothPos1);
      servos[1].write(smoothPos2);
    
      prevServoPos1 = smoothPos1;
      prevServoPos2 = smoothPos2;
  
      previousMillis = currentMillis;
    }
  }
}

char* ssid = WIFI_SSID;
char* password =  WIFI_PASSWORD;

AsyncWebServer server(80);

void setup() {

  Serial.begin(115200);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi..");
  }

  Serial.println(WiFi.localIP());

  server.on("/update", HTTP_GET, [](AsyncWebServerRequest * request) {
    String servo1Val;
    String servo2Val;

    if (request->hasParam(PARAM_INPUT_1) && request->hasParam(PARAM_INPUT_2)) {
      servo1Val = request->getParam(PARAM_INPUT_1)->value();
      servo2Val = request->getParam(PARAM_INPUT_2)->value();
      setServos(servo1Val.toInt(), servo2Val.toInt());
    }
    else {
      servo1Val = "No message sent";
      servo2Val = "No message sent";
    }
    Serial.print("servo1Val: ");
    Serial.print(servo1Val);
    Serial.print(" servo2Val: ");
    Serial.println(servo2Val);
    request->send(200, "text/plain", "OK");
  });

 server.on("/move", HTTP_ANY, [](AsyncWebServerRequest * request) {
    String servoIncrease1;
    String servoIncrease2;

    if (request->hasParam(PARAM_INPUT_1) && request->hasParam(PARAM_INPUT_2)) {
      servoIncrease1 = request->getParam(PARAM_INPUT_1)->value();
      servoIncrease2 = request->getParam(PARAM_INPUT_2)->value();

      increaseServos(servoIncrease1.toInt(), servoIncrease2.toInt());
    }
    else {
      servoIncrease1 = "No message sent";
      servoIncrease2 = "No message sent";
    }
    Serial.print("servoIncrease1: ");
    Serial.print(servoIncrease1);
    Serial.print(" servoIncrease2: ");
    Serial.println(servoIncrease2);
    request->send(200, "text/plain", "OK");
  });


  server.onNotFound([](AsyncWebServerRequest * request) {
    if (request->method() == HTTP_OPTIONS) {
      request->send(200);
    } else {
      request->send(404);
    }
  });

  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
  DefaultHeaders::Instance().addHeader("Access-Control-Max-Age", "10000");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Methods", "PUT,POST,GET,OPTIONS,PATCH");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Headers", "*");
  server.begin();

  for (int i = 0; i < 2; i++) {
    if (!servos[i].attach(servosPins[i])) {
      Serial.print("Servo ");
      Serial.print(i);
      Serial.println("attach error");
    }
  }
}

void loop() {
  moveServos();  
}

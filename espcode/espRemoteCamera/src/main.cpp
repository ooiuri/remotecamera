#include <Arduino.h>

// Include file with required WIFI Credentials
#include "config.h"

// Import required libraries
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <Servo.h>

static const int servosPins[2] = {D5, D6}; //base, giro

Servo servos[2];
// global variables to desired servoPos
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
  Serial.print("IncreseServos S1Increase: ");
  Serial.print(servoIncrease1);
  Serial.print("\tIncreseServos S2Increase: ");
  Serial.println(servoIncrease2);
  setServos(Servo1Val, Servo2Val);
}

void moveServos(){
  if((round(prevServoPos1) != servoPos1) || (round(prevServoPos2) != servoPos2)){
  unsigned long currentMillis = millis();
    if (currentMillis - previousMillis > 50) {
      float smoothPos1 = (servoPos1 * 0.04) + (prevServoPos1 * 0.96);
      float smoothPos2 = (servoPos2 * 0.04) + (prevServoPos2 * 0.96);
      
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
      
      servos[0].write(round(smoothPos1));
      servos[1].write(round(smoothPos2));
    
      prevServoPos1 = smoothPos1;
      prevServoPos2 = smoothPos2;
  
      previousMillis = currentMillis;
    }
  }
  else {
    servos[0].write(servoPos1);
    servos[1].write(servoPos2);
  }
}

char* ssid = WIFI_SSID;
char* password =  WIFI_PASSWORD;

AsyncWebServer server(80);

const int led_WIFI = 16;

// Set your Static IP address
IPAddress local_IP(10, 0, 0, 65);
// Set your Gateway IP address
IPAddress gateway(10, 0, 0, 1);

IPAddress subnet(255, 255, 0, 0);
IPAddress primaryDNS(8, 8, 8, 8);   //optional
IPAddress secondaryDNS(8, 8, 4, 4); //optional


void setup() {

  Serial.begin(115200);
  pinMode(led_WIFI, OUTPUT);
  
   // Configures static IP address
  if (!WiFi.config(local_IP, gateway, subnet, primaryDNS, secondaryDNS)) {
    Serial.println("STA Failed to configure");
  }

  WiFi.begin(ssid, password);
  digitalWrite(led_WIFI, HIGH);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi..");
  }

  digitalWrite(led_WIFI, LOW);
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
    Serial.print(servoIncrease1.toInt());
    Serial.print(" servoIncrease2: ");
    Serial.println(servoIncrease2.toInt());
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
      Serial.print("Attaching Servo ");
      Serial.println(i);
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

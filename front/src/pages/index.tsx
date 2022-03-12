/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import Head from 'next/head'
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { KeyboardEvent, RefObject, useEffect, useRef, useState } from "react";

import InputComponent from '../components/InputComponent'
import { API_BASE_URL } from '../utils/constants'

let leftTimer: NodeJS.Timeout;
let rightTimer: NodeJS.Timeout;
let upTimer: NodeJS.Timeout;
let downTimer: NodeJS.Timeout;

import { CameraProvider } from '../contexts/CameraContext';

const BASE_URL = API_BASE_URL;

const Home: NextPage = () => {
  const upButton = useRef<HTMLButtonElement>(null);
  const downButton = useRef<HTMLButtonElement>(null);
  const leftButton = useRef<HTMLButtonElement>(null);
  const rightButton = useRef<HTMLButtonElement>(null);

  function handleKeyDown(event: KeyboardEvent<Element>) {
    if (event.key === "ArrowUp") {
      handleClick(upButton, upTimer);
    }
    if (event.key === "ArrowLeft") {
      handleClick(leftButton, leftTimer);
    }
    if (event.key === "ArrowRight") {
      handleClick(rightButton, rightTimer);
    }
    if (event.key === "ArrowDown") {
      handleClick(downButton, downTimer);    }
  }

  function setTimer(
    button: RefObject<HTMLButtonElement>,
    timer: NodeJS.Timeout
  ) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      button.current?.blur();
    }, 300);
    button.current?.focus();
  }

  function handleClick(button: RefObject<HTMLButtonElement>, timer: NodeJS.Timeout) {
    try{
      if (button == upButton) {
        setTimer(upButton, upTimer);
        try {
          fetch(BASE_URL + "/move?servo1=0&servo2=-10", { 
            method: "PATCH", 
            referrerPolicy: "unsafe-url"
          });
        }
        catch(e){
          //
        }
      }
      if (button == leftButton) {
        setTimer(leftButton, leftTimer);
        try {
          fetch(BASE_URL + "/move?servo1=10&servo2=0", { 
            method: "PATCH", 
            referrerPolicy: "unsafe-url"
          });
        }
        catch(e){
          //
        }
      }
      if (button == rightButton) {
        setTimer(rightButton, rightTimer);
        try{
          fetch(BASE_URL + "/move?servo1=-10&servo2=0", { 
            method: "PATCH", 
            referrerPolicy: "unsafe-url"
          });
        }
        catch(e){
          //
        }
      }
      if (button == downButton) {
        setTimer(downButton, downTimer);
        try{
          fetch(BASE_URL + "/move?servo1=0&servo2=10", { 
            method: "PATCH", 
            referrerPolicy: "unsafe-url"
          });
        }
        catch(e){
          //
        }
      }
    }
    catch(e){
      console.log(e)
    }
  }
  const [servo1Val, setServo1Val] = useState(90);
  const [servo2Val, setServo2Val] = useState(90);
  
  const updateServos = () => {
    try {
      fetch(BASE_URL + `/update?servo1=${servo1Val}&servo2=${servo2Val}`, { method: "get" });
      console.log('updateServos: ', BASE_URL + `/update?servo1=${servo1Val}&servo2=${servo2Val}`)
    }
    catch (e) {
      console.log(e)
    }
  }
  
  useEffect(() => {
    window.addEventListener(
      "keydown",
      handleKeyDown as unknown as EventListener
    );
  }, []);

  return (
    <CameraProvider>
      <div className={styles.container} onKeyDown={handleKeyDown}>
        <Head>
          <title>Remote Camera</title>
        </Head>
        <Image src="/logo.svg" alt="RemoteCamera" width={348} height={173} />
        <main className={styles.main} onKeyPress={handleKeyDown}>
          <div className={styles.keys}>
            <button
              ref={upButton}
              onClick={() => handleClick(upButton, upTimer)}
              className={styles.move}
            >
              <img src="/arrow.svg" width="40" height="40" 
                  alt="Move up"></img>
            </button>
          </div>
          <div className={styles.row}>
            <div className={styles.keys}>
              <button
                ref={leftButton}
                onClick={() => handleClick(leftButton, leftTimer)}
                className={styles.move}
              >
                <img
                  src="/arrow.svg"
                  className={styles.arrowLeft}
                  width="40"
                  height="40"
                  alt="Move to the left"
                ></img>
              </button>
            </div>
            <div className={styles.keys}>
              <button
                ref={rightButton}
                onClick={() => handleClick(rightButton, rightTimer)}
                className={styles.move}
              >
                <img
                  src="/arrow.svg"
                  className={styles.arrowRight}
                  width="40"
                  height="40"
                  alt="Move to the right"
                ></img>
              </button>
            </div>
          </div>
          <div className={styles.keys}>
            <button
              ref={downButton}
              onClick={() => handleClick(downButton, downTimer)}
              className={styles.move}
            >
              <img
                src="/arrow.svg"
                className={styles.arrowDown}
                width="40"
                height="40"
                alt="Move down"
              ></img>
            </button>
          </div> 
          <InputComponent />

          <h3>Servo1 {servo1Val}</h3>
          <input type="range" min="0" max="180" 
            onChange={(e) => {console.log(Number(e.target.value)); setServo1Val(Number(e.target.value))}}/>
          <h3>Servo2 {servo2Val}</h3>
          <input type="range" min="0" max="180"
            onChange={(e) => {console.log(Number(e.target.value)); setServo2Val(Number(e.target.value))}}/>
          <button onClick={updateServos}>Enviar</button>
        </main>

        <footer className={styles.footer}>
          Criado por <a href="https://github.com/ooiuri">ooiuri</a>! 🤍
        </footer> 
      </div>
    </CameraProvider>
  );
};

export default Home;

/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { KeyboardEvent, RefObject, useEffect, useRef } from "react";

let leftTimer: NodeJS.Timeout;
let rightTimer: NodeJS.Timeout;
let upTimer: NodeJS.Timeout;
let downTimer: NodeJS.Timeout;


const BASE_URL = "http://192.168.1.10";
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
    if (button == upButton) {
      setTimer(upButton, upTimer);
      fetch(BASE_URL + "/led/on", { method: "PATCH" });
    }
    if (button == leftButton) {
      setTimer(leftButton, leftTimer);
      fetch(BASE_URL + "/led/toggle", { method: "PATCH" });
    }
    if (button == rightButton) {
      setTimer(rightButton, rightTimer);
      fetch(BASE_URL + "/led/toggle", { method: "PATCH" });
    }
    if (button == downButton) {
      setTimer(downButton, downTimer);
      fetch(BASE_URL + "/led/off", { method: "PATCH" });
    }
  }

  useEffect(() => {
    window.addEventListener(
      "keydown",
      handleKeyDown as unknown as EventListener
    );
  }, []);

  return (
    <div className={styles.container} onKeyDown={handleKeyDown}>
      <Head>
        <title>RemoteCamera | Controle a sua camera a distância</title>
        <meta name="description" content="Controle a sua camera a distância" />
        <link rel="icon" href="/favicon.png" />
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
      </main>

      {/* <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer> */}
    </div>
  );
};

export default Home;

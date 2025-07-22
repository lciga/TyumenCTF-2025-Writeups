const socket = new WebSocket("ws://voldemort.tech:8080/beep");

const DOT_INTERVAL = 2000;

const sequence = [];
let lastState = null;
let lastMessageTime = null;

socket.addEventListener("message", (event) => {
  const state = event.data === "true";
  const now = new Date();

  if (state !== lastState) {
    if (lastState !== null) {
      const timeDelta = now.getTime() - lastMessageTime.getTime();
      const dotCount = Math.floor(timeDelta / DOT_INTERVAL);

      if (state) {
        if (dotCount > 10) {
          sequence.push(" end ");
        } else if (dotCount > 6) {
          sequence.push(" / ");
        } else if (dotCount > 1) {
          sequence.push(" ");
        }
      } else {
        if (dotCount > 1) {
          sequence.push("_");
        } else {
          sequence.push(".");
        }
      }
    }

    lastState = state;
    lastMessageTime = new Date();

    console.log(sequence.join(""));
  }
});

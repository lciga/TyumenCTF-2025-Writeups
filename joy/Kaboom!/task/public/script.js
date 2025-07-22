const reconnectInterval = 2000;

class Util {
  static getRandomChoice(variants) {
    return variants[Math.floor(Math.random() * variants.length)];
  }
}

class Game {
  static INSTANCE = null;

  constructor() {
    if (Game.INSTANCE !== null) {
      throw new Error("The Game class is a singleton");
    }

    Game.INSTANCE = this;

    this.modules = this.randomizeModules();
    this.blocks = this.getBlocks();
    this.currentMistakes = 0;
    this.allowedMistakes = 1 + Math.floor(Math.random() * 3);
    this.eventHandlers = { mistake: [], tick: [] };
    this.secondsAvailable = (3 + Math.floor(Math.random() * 5)) * 60;
    this.secondsLeft = this.secondsAvailable;

    this.timerInterval = setInterval(() => {
      if (this.secondsLeft > 0) {
        this.secondsLeft--;
        this.eventHandlers.tick.forEach((handler) => handler());
      } else {
        this.kaboom();
      }
    }, 1000);

    this.modules.forEach((module, position) => {
      const block = this.blocks[position];

      if (module.constructor) {
        new module(block);
      } else {
        module(block);
      }
    });
  }

  getBlocks() {
    return [...document.querySelectorAll(".module")];
  }

  getAvailableModules() {
    return [Wires, Memory, Button];
  }

  getRequiredModules() {
    return [Timer, Radio];
  }

  getAvailablePositionsCount() {
    return 6;
  }

  addMistake() {
    this.currentMistakes++;

    if (this.currentMistakes > this.allowedMistakes) {
      this.kaboom();
    }

    this.eventHandlers.mistake.forEach((handler) => handler());
  }

  formatTimeLeft() {
    const m = String(Math.floor(this.secondsLeft / 60)).padStart(2, "0");
    const s = String(this.secondsLeft % 60).padStart(2, "0");

    return `${m}:${s}`;
  }

  randomizeModules() {
    const modules = new Array(this.getAvailablePositionsCount()).fill();

    this.getRequiredModules().forEach((module) => {
      const availablePositions = modules
        .map((m, i) => [m, i])
        .filter(([m, _]) => m === undefined)
        .map(([_, i]) => i);

      const position = Util.getRandomChoice(availablePositions);

      modules[position] = module;
    });

    modules.forEach((m, i) => {
      if (m === undefined) {
        modules[i] = Util.getRandomChoice(this.getAvailableModules());
      }
    });

    return modules;
  }

  kaboom() {
    clearInterval(this.timerInterval);

    [...document.body.children].forEach((child) =>
      document.body.removeChild(child)
    );

    document.body.classList.add("kaboom");

    const video = document.createElement("video");
    video.src = "/kaboom.webm";
    video.autoplay = true;

    document.body.appendChild(video);
  }

  onMistake(handler) {
    this.eventHandlers.mistake.push(handler);
  }

  onTick(handler) {
    this.eventHandlers.tick.push(handler);
  }
}

class Module {
  constructor(block) {
    this.block = block;
    this.isSolved = false;

    if (this.canBeSolved()) {
      this.solveIndicator = document.createElement("div");
      this.solveIndicator.className = "solve-indicator";

      this.block.appendChild(this.solveIndicator);
    }
  }

  setSolved() {
    this.isSolved = true;
    this.solveIndicator.classList.add("solved");
  }

  canBeSolved() {
    return true;
  }
}

class Wires extends Module {
  constructor(block) {
    super(block);

    this.isSolved = false;
    this.wireCount = Util.getRandomChoice(this.getWireCountVariants());
    this.socketCount = Math.max(...this.getWireCountVariants());

    this.block.classList.add("wire-module");

    const panelLeft = document.createElement("div");
    panelLeft.className = "wire-panel left";
    const panelRight = document.createElement("div");
    panelRight.className = "wire-panel right";

    for (let i = 0; i < this.socketCount; i++) {
      const holeLeft = document.createElement("div");
      holeLeft.className = "wire-hole";
      panelLeft.appendChild(holeLeft);

      const holeRight = document.createElement("div");
      holeRight.className = "wire-hole";
      panelRight.appendChild(holeRight);
    }

    const wireSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    wireSvg.classList.add("wire-svg");
    wireSvg.setAttribute("width", "100%");
    wireSvg.setAttribute("height", "100%");

    const sockets = new Array(this.socketCount).fill();
    const wires = [];

    for (let i = 0; i < this.wireCount; i++) {
      const color = Util.getRandomChoice(this.getAvailableColors());

      const availableSockets = sockets
        .map((w, i) => [w, i])
        .filter(([w, _]) => w === undefined)
        .map(([_, i]) => i);

      const socket = Util.getRandomChoice(availableSockets);

      sockets[socket] = i;

      wires.push({
        color,
        socket,
        isCut: false,
      });
    }

    this.wires = wires
      .sort((a, b) => a.socket - b.socket)
      .map((wire, i) => ({ serial: i, ...wire }));

    this.wires.forEach((w) => {
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );

      const y =
        100 / this.socketCount / 2 + (w.socket * 100) / this.socketCount + "%";

      line.setAttribute("x1", "0%");
      line.setAttribute("y1", y);
      line.setAttribute("x2", "100%");
      line.setAttribute("y2", y);
      line.setAttribute("stroke", w.color);
      line.setAttribute("stroke-width", "5");
      line.addEventListener("click", this.handleWireClick.bind(this, w));

      wireSvg.appendChild(line);
    });

    block.appendChild(panelLeft);
    block.appendChild(wireSvg);
    block.appendChild(panelRight);
  }

  getWireCountVariants() {
    return [3, 4, 5, 6];
  }

  getAvailableColors() {
    return ["red", "yellow", "white", "black", "blue"];
  }

  handleWireClick(wire, event) {
    if (wire.isCut) {
      return;
    }

    if (this.getRightWirePosition() === wire.serial) {
      this.setSolved();
    } else {
      Game.INSTANCE.addMistake();
    }

    wire.isCut = true;
    event.target.setAttribute("stroke-dasharray", "10");
    event.target.classList.add("cut");
  }

  getRightWirePosition() {
    const count = (color) =>
      this.wires.filter((wire) => wire.color === color).length;

    const lastSerialNumberIsOdd = true;

    if (this.wireCount === 3) {
      if (count("red") === 0) {
        return 1;
      } else if (this.wires[this.wires.length - 1].color === "white") {
        return this.wires.length - 1;
      } else if (count("blue") > 1) {
        return [...this.wires].reverse().find((wire) => wire.color === "blue")
          .socket;
      } else {
        return this.wires.length - 1;
      }
    } else if (this.wireCount === 4) {
      if (count("red") > 1 && lastSerialNumberIsOdd) {
        return [...this.wires].reverse().find((wire) => wire.color === "red")
          .socket;
      } else if (
        this.wires[this.wires.length - 1].color === "yellow" &&
        count("red") === 0
      ) {
        return 0;
      } else if (count("blue") === 1) {
        return 0;
      } else if (count("yellow") > 1) {
        return this.wires.length - 1;
      } else {
        return 1;
      }
    } else if (this.wireCount === 5) {
      if (
        this.wires[this.wires.length - 1].color === "black" &&
        lastSerialNumberIsOdd
      ) {
        return 3;
      } else if (count("red") === 1 && count("yellow") > 1) {
        return 0;
      } else if (count("black") === 0) {
        return 1;
      } else {
        return 0;
      }
    } else {
      if (count("yellow") === 0 && lastSerialNumberIsOdd) {
        return 2;
      } else if (count("yellow") === 1 && count("white") > 1) {
        return 3;
      } else if (count("red") === 0) {
        return this.wires.length - 1;
      } else {
        return 3;
      }
    }
  }
}

class Timer extends Module {
  constructor(block) {
    super(block);

    this.block.classList.add("timer");

    const displayContainer = document.createElement("div");
    displayContainer.className = "timer-display-container";

    const display = document.createElement("div");
    display.className = "timer-display";

    const mistakeCounterContainer = document.createElement("div");
    mistakeCounterContainer.className = "timer-mistakes-container";

    const mistakeCounter = document.createElement("div");
    mistakeCounter.className = "timer-mistakes";

    this.mistakeIndicators = new Array(Game.INSTANCE.allowedMistakes)
      .fill()
      .map(() => {
        const indicator = document.createElement("span");
        indicator.className = "timer-mistake-hidden";
        indicator.innerText = "X";
        mistakeCounter.appendChild(indicator);

        return indicator;
      });

    const updateTimer = () => {
      const m = String(Math.floor(Game.INSTANCE.secondsLeft / 60)).padStart(
        2,
        "0"
      );
      const s = String(Game.INSTANCE.secondsLeft % 60).padStart(2, "0");
      display.textContent = `${m}:${s}`;
    };

    Game.INSTANCE.onTick(updateTimer);
    updateTimer();

    displayContainer.append(display);
    mistakeCounterContainer.append(mistakeCounter);

    block.appendChild(displayContainer);
    block.appendChild(mistakeCounterContainer);

    Game.INSTANCE.onMistake(this.handleMistake.bind(this));
  }

  handleMistake() {
    this.mistakeIndicators[Game.INSTANCE.currentMistakes - 1]?.classList.remove(
      "timer-mistake-hidden"
    );
  }

  canBeSolved() {
    return false;
  }
}

class Button extends Module {
  constructor(block) {
    super(block);

    this.color = Util.getRandomChoice(this.getAvailableColors());
    this.caption = Util.getRandomChoice(this.getAvailableCaptions());
    this.indicatorColor = Util.getRandomChoice(
      this.getAvailableIndicatorColors()
    );
    this.isHeld = false;
    this.isPressed = false;
    this.holdTimeout = null;

    const buttonCircle = document.createElement("div");
    buttonCircle.className = "button-circle";
    buttonCircle.textContent = this.caption;
    buttonCircle.style.background = this.color;

    this.indicator = document.createElement("div");
    this.indicator.className = "button-indicator";

    buttonCircle.addEventListener("mousedown", this.handlePress.bind(this));
    buttonCircle.addEventListener("mouseup", this.releaseHandler.bind(this));
    buttonCircle.addEventListener("mouseleave", this.releaseHandler.bind(this));

    block.appendChild(buttonCircle);
    block.appendChild(this.indicator);
  }

  getAvailableColors() {
    return ["blue", "yellow", "white", "red"];
  }

  getAvailableCaptions() {
    return ["Прервать", "Держать", "Взорвать", "Нажать"];
  }

  getAvailableIndicatorColors() {
    return ["blue", "white", "yellow", "red", "magenta", "green"];
  }

  handlePress() {
    this.isPressed = true;

    this.holdTimeout = setTimeout(() => {
      this.isHeld = true;
      this.handleHold();
    }, 1000);
  }

  handleHold() {
    if (this.whatToDo() === "hold") {
      this.indicator.style.background = this.indicatorColor;
    } else {
      Game.INSTANCE.addMistake();
    }
  }

  releaseHandler() {
    clearTimeout(this.holdTimeout);

    if (!this.isPressed) {
      return;
    }

    if (!this.isHeld) {
      this.handleClick();
    } else {
      this.handleHoldRelease();
    }

    this.isPressed = false;
    this.isHeld = false;
  }

  handleHoldRelease() {
    this.indicator.style.background = "#666";

    const releaseTime = {
      blue: 4,
      yellow: 5,
      default: 1,
    };

    if (
      this.whatToDo() === "hold" &&
      Game.INSTANCE.formatTimeLeft().includes(
        (releaseTime[this.indicatorColor] ?? releaseTime.default).toString()
      )
    ) {
      this.setSolved();
    } else {
      Game.INSTANCE.addMistake();
    }
  }

  handleClick() {
    if (this.isHeld) {
      return;
    }

    if (this.whatToDo() === "click") {
      this.setSolved();
    } else {
      Game.INSTANCE.addMistake();
    }
  }

  whatToDo() {
    if (this.color === "red" && this.caption === "Держать") {
      return "click";
    } else {
      return "hold";
    }
  }
}

class Radio extends Module {
  constructor(block) {
    super(block);

    const lamp = document.createElement("div");
    lamp.className = "radio-lamp";

    const rangeBar = document.createElement("div");
    rangeBar.className = "radio-range";
    const needle = document.createElement("div");
    needle.className = "radio-needle";
    rangeBar.appendChild(needle);

    const display = document.createElement("div");
    display.className = "radio-display";

    const arrowLeft = document.createElement("div");
    arrowLeft.className = "radio-arrow left";
    arrowLeft.textContent = "<";
    const arrowRight = document.createElement("div");
    arrowRight.className = "radio-arrow right";
    arrowRight.textContent = ">";

    const txButton = document.createElement("div");
    txButton.className = "radio-tx";
    txButton.textContent = "TX";
    txButton.addEventListener("click", () => Game.INSTANCE.addMistake());

    let currentFreq = 3.5;
    const minFreq = 3.5;
    const maxFreq = 4.0;
    const step = 0.005;

    function updateUI() {
      display.textContent = currentFreq.toFixed(3) + " МГц";
      const ratio = (currentFreq - minFreq) / (maxFreq - minFreq);
      needle.style.left = ratio * 100 + "%";
    }
    updateUI();

    arrowLeft.addEventListener("click", () => {
      if (currentFreq > minFreq) {
        currentFreq -= step;
        if (currentFreq < minFreq) currentFreq = minFreq;
        updateUI();
      }
    });
    arrowRight.addEventListener("click", () => {
      if (currentFreq < maxFreq) {
        currentFreq += step;
        if (currentFreq > maxFreq) currentFreq = maxFreq;
        updateUI();
      }
    });

    const connect = () => {
      const socket = new WebSocket("/beep");

      socket.addEventListener("message", (event) => {
        if (event.data === "true") {
          lamp.style.background = "yellow";
        } else {
          lamp.style.background = "#444";
        }
      });

      socket.addEventListener("close", () => {
        setTimeout(connect, reconnectInterval);
      });
    };

    connect();

    block.appendChild(lamp);
    block.appendChild(rangeBar);
    block.appendChild(display);
    block.appendChild(arrowLeft);
    block.appendChild(arrowRight);
    block.appendChild(txButton);
  }
}

class Memory extends Module {
  constructor(block) {
    super(block);

    this.stagesCount = 3 + Math.floor(Math.random() * 2);
    this.history = [];
    this.currentValue = 0;

    this.screenBox = document.createElement("div");
    this.screenBox.className = "screen-box";

    this.randomizeCurrentValue();

    this.buttonsContainer = document.createElement("div");
    this.buttonsContainer.className = "screen-buttons";

    this.randomizeButtons();

    const lampsContainer = document.createElement("div");
    lampsContainer.className = "screen-lamps";

    this.indicators = [];

    for (let i = 0; i < this.stagesCount; i++) {
      const indicator = document.createElement("div");
      indicator.className = "screen-lamp";
      lampsContainer.appendChild(indicator);
      this.indicators.push(indicator);
    }

    this.indicators.reverse();

    block.appendChild(this.screenBox);
    block.appendChild(this.buttonsContainer);
    block.appendChild(lampsContainer);
  }

  randomizeCurrentValue() {
    this.currentValue = Math.floor(Math.random() * 4);
    this.screenBox.innerText = this.currentValue + 1;
  }

  randomizeButtons() {
    const availableValues = [1, 2, 3, 4];

    const buttons = new Array(4).fill().map((_, i) => ({
      value: availableValues.splice(
        Math.floor(Math.random() * availableValues.length),
        1
      )[0],
      position: i,
    }));

    [...this.buttonsContainer.children].forEach((child) =>
      this.buttonsContainer.removeChild(child)
    );

    buttons.forEach((button) => {
      const btn = document.createElement("div");
      btn.className = "screen-btn";
      btn.textContent = String(button.value);
      this.buttonsContainer.appendChild(btn);

      btn.addEventListener("click", this.handleClick.bind(this, button));
    });
  }

  updateIndicators() {
    this.indicators.forEach((indicator, i) => {
      if (i < this.history.length) {
        indicator.classList.add("active");
      } else {
        indicator.classList.remove("active");
      }
    });
  }

  handleClick(button) {
    const requiredButton = this.getRequiredButton();

    if (Object.entries(requiredButton).every(([k, v]) => button[k] === v)) {
      this.history.push(button);
      this.updateIndicators();

      if (this.history.length >= this.stagesCount) {
        this.setSolved();
      } else {
        this.randomizeButtons();
        this.randomizeCurrentValue();
      }
    } else {
      this.history = [];
      this.randomizeButtons();
      this.randomizeCurrentValue();
      this.updateIndicators();
      Game.INSTANCE.addMistake();
    }
  }

  getRequiredButton() {
    if (this.history.length === 0) {
      return { position: [1, 1, 2, 3][this.currentValue] };
    } else if (this.history.length === 1) {
      return [
        { value: 4 },
        { position: this.history[0].position },
        { position: 0 },
        { position: this.history[0].position },
      ][this.currentValue];
    } else if (this.history.length === 2) {
      return [
        { value: this.history[1].value },
        { value: this.history[0].value },
        { position: 2 },
        { value: 4 },
      ][this.currentValue];
    } else if (this.history.length === 3) {
      return [
        { position: this.history[0].position },
        { position: 1 },
        { position: this.history[1].position },
        { position: this.history[1].position },
      ][this.currentValue];
    } else {
      return [
        { value: this.history[0].value },
        { value: this.history[1].value },
        { value: this.history[3].value },
        { value: this.history[2].value },
      ][this.currentValue];
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Game();
});

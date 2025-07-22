import { Terminal } from "ascii-ui/Terminal";
import { useEffect, useRef } from "react";
import FontFaceObserver from "fontfaceobserver";

type TerminalCommand =
  | {
      SetSize: {
        width: number;
        height: number;
      };
    }
  | {
      Write: {
        data: string;
      };
    };

type TerminalUpdate = {
  screen: string;
  cursor: [number, number];
};

const FONT_FAMILY = "Noto Sans Mono";

export function VT100() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const once = useRef(false);

  useEffect(() => {
    new FontFaceObserver(FONT_FAMILY).load("пенiс").then(() => {
      if (once.current) {
        return;
      }

      once.current = true;

      const tileWidth = 15;
      const tileHeight = 23;

      const terminalOptions = {
        rows: 0,
        columns: 0,
        autoRender: false,
        tileWidth,
        tileHeight,
        font: `20px '${FONT_FAMILY}'`,
      };

      const terminal = new Terminal(canvas.current as any, terminalOptions);

      const socket = new WebSocket("/api/v1/classified/terminal");

      const updateTerminalSize = () => {
        const width = document.body.clientWidth;
        const height = document.body.clientHeight;

        const columns = Math.floor(width / tileWidth);
        const rows = Math.floor(height / tileHeight);

        terminal.setOptions({
          ...terminalOptions,
          rows,
          columns,
        });

        const command: TerminalCommand = {
          SetSize: {
            width: columns - 2,
            height: rows,
          },
        };

        socket.send(JSON.stringify(command));
      };

      socket.addEventListener("open", () => updateTerminalSize());

      socket.addEventListener("message", (message) => {
        const update = JSON.parse(message.data) as TerminalUpdate;

        terminal.clear();
        terminal.setCursor(0, 0);

        (update.screen as string).split("\n").forEach((line, i) => {
          if (i === 0) {
            terminal.setCursor(0, 0);
          } else {
            terminal.setCursor(0, terminal.getCursor().line + 1);
          }
          terminal.setText(line);
        });

        terminal.setCursor(update.cursor[1], update.cursor[0]);

        terminal.renderAll();
      });

      document.addEventListener("keydown", (event) => {
        const command: TerminalCommand = {
          Write: {
            data: "",
          },
        };

        const sequences = {
          Enter: "\n",
          Escape: "\x1B",
          Backspace: "\b",
          ArrowUp: "\x1b[A",
          ArrowDown: "\x1b[B",
          ArrowLeft: "\x1b[D",
          ArrowRight: "\x1b[C",
          Tab: "\t",
        };

        if (event.key.length === 1) {
          if (event.ctrlKey) {
            command.Write.data = String.fromCharCode(
              event.key.toUpperCase().charCodeAt(0) & 0x1f
            );
          } else {
            command.Write.data = event.key;
          }
        } else if (event.key in sequences) {
          command.Write.data = (sequences as Record<string, string>)[event.key];
        }

        socket.send(JSON.stringify(command));

        event.preventDefault();
      });

      terminal.render();
    });
  }, [canvas]);

  return (
    <div className="min-w-full h-screen overflow-hidden bg-black">
      <canvas ref={canvas} />
    </div>
  );
}

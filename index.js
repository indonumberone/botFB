import fs from "fs";
import login from "unofficial-fb-chat-api";
import { handleCommand } from "./command.js"; // Import the commands module

login(
  { appState: JSON.parse(fs.readFileSync("appstate.json", "utf8")) },
  (err, api) => {
    if (err) return console.error(err);

    api.setOptions({ listenEvents: true });

    var stopListening = api.listen((err, event) => {
      if (err) return console.error(err);

      api.markAsRead(event.threadID, (err) => {
        if (err) console.error(err);
      });

      if (event.type === "message") {
        handleCommand(api, event); // Call the handleCommand function from commands.js
      } else if (event.type === "event") {
        console.log(event);
      }
    });
  }
);

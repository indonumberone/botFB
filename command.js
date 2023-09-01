// commands.js

import axios from "axios";
import fs from "fs";
import { fileURLToPath } from 'url';
import path from 'path';
import { sendFile } from "./utils/upload.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const commandHandlers = {
  start: (api, event) => {
    api.sendMessage("Starting...", event.threadID);
  },
  stop: (api, event) => {
    api.sendMessage("Goodbye...", event.threadID);
    stopListening(); // Assuming `stopListening` is defined in your main cskkkdjode.
  },
  pict: (api, event) => {
    const filenames = "abc.jpg"
    const fullpath = fs.createReadStream(`${dirname}/${filenames}`);
        const msg = {
        "body": "123",
        "attachment": fullpath
    }
    // const msg = {
    //   url: "https://rare-gallery.com/thumbs/1195058-anime-girls-picture-in-picture-Hyouka-Chitanda-Eru.jpg",
    // };
    api.sendMessage(msg, event.threadID);
  },
  send: (api, event, args) => {
    sendFile(api, event, args, "tes", `../tmp/${event.threadID}.jpg`)
  },
  gpt: (api, event, args) => {
    axios
      .get("https://api.akuari.my.id/ai/gpt?chat=" + args)
      .then(({ data }) => {
        api.sendMessage(data.respon, event.threadID);
      });
  },
  ip: (api, event) => {
    axios.get("https://api.myip.com").then(({ data }) => {
      const ip = `IP ADDRESS BOT: ${data.ip}\nCOUNTRY BOT: ${data.country}`;
      api.sendMessage(ip, event.threadID);
    });
  },
  id: (api, event) => {
    api.sendMessage(event.messageID, event.threadID, (err, messageInfo) => {
      if (err) {
        console.log(err)
      } else {
        api.sendMessage("test", event.threadID, {}, event.messageID)
      }
    })
  },
  save: (api, event, args) => {
    const [number, name] = args.split(" ");

    // Check if both number and name are provided
    if (number && name) {
      // Handle the savenumber command here
      api.sendMessage(`Saving number ${number} for ${name}`, event.threadID);
    } else {
      // Handle the case where arguments are missing
      api.sendMessage(
        "Invalid usage. Please provide both number and name.",
        event.threadID
      );
    }
  },
};

export function handleCommand(api, event) {
  const message = event.body.trim();
  const commands = {
    "/start": "start",
    "/stop": "stop",
    "/pict": "pict",
    "/gpt": "gpt",
    "/ip": "ip",
    "/save": "save",
    "/send": "send",
    "/id": "id",
  };

  for (const [command, handler] of Object.entries(commands)) {
    if (message.startsWith(command)) {
      const args = message.slice(command.length).trim();
      commandHandlers[handler](api, event, args);
      return;
    }
  }

  api.sendMessage("hallo 3", event.threadID, (err, messageInfo) => {
    if (err) {
      console.log(err)
    } else {
      console.log(messageInfo)
    }
  }, 'mid.$cAABtDsP0RgmQgrBW5GKUWsMeUORR');
}

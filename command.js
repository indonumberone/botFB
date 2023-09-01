// commands.js

const axios = require("axios");

const commandHandlers = {
  start: (api, event) => {
    api.sendMessage("Starting...", event.threadID);
  },
  stop: (api, event) => {
    api.sendMessage("Goodbye...", event.threadID);
    stopListening(); // Assuming `stopListening` is defined in your main code.
  },
  pict: (api, event) => {
    const msg = {
      url: "https://rare-gallery.com/thumbs/1195058-anime-girls-picture-in-picture-Hyouka-Chitanda-Eru.jpg",
    };
    api.sendMessage(msg, event.threadID);
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

function handleCommand(api, event) {
  const message = event.body.trim();
  const commands = {
    "/start": "start",
    "/stop": "stop",
    "/pict": "pict",
    "/gpt": "gpt",
    "/ip": "ip",
    "/save": "save",
  };

  for (const [command, handler] of Object.entries(commands)) {
    if (message.startsWith(command)) {
      const args = message.slice(command.length).trim();
      commandHandlers[handler](api, event, args);
      return;
    }
  }

  api.sendMessage("hallo", event.threadID);
}

module.exports = {
  handleCommand,
};

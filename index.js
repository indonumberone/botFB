const fs = require("fs");
const login = require("unofficial-fb-chat-api");
const axios = require("axios");

// Simple echo bot. It will repeat everything that you say.
// Will stop when you say '/stop'
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

      switch (event.type) {
        case "message":
          switch (event.body) {
            case "stop":
              api.sendMessage("Goodbye…", event.threadID);
              return stopListening();
              break;
            case "start":
              api.sendMessage("Starting...", event.threadID);
              break;
            case "pict":
              var msg = {
                url: "https://rare-gallery.com/thumbs/1195058-anime-girls-picture-in-picture-Hyouka-Chitanda-Eru.jpg",
              };

              api.sendMessage(msg, event.threadID);
              break;
            case `gpt ${event.body}`:
              let gpt = axios
                .get("https://api.akuari.my.id/ai/gpt?chat=" + event.body)
                .then(({ data }) => {
                  api.sendMessage(
                    "jadiiiii....." + data.respon,
                    event.threadID
                  );
                });
              break;
            case `ip`:
              {
                axios.get(`https://api.myip.com`).then(({ data }) => {
                  let ip = `IP ADREESS BOT : ${data.ip}\nCOUNTRY BOT : ${data.country}`;
                  api.sendMessage(ip, event.threadID);
                });
              }
              break;
            default:
              api.sendMessage("hallo", event.threadID);
              break;
          }
          break;
        case "event":
          console.log(event);
          break;
      }
    });
  }
);

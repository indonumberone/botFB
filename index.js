const fs = require("fs");
const login = require("unofficial-fb-chat-api");
const axios = require("axios");

// Fungsi untuk mengecek apakah pesan dimulai dengan prefix
function startsWithPrefix(text, prefix) {
  console.log(text.startsWith(prefix));
}

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
          const body = event.body;

          if (startsWithPrefix(body, "/")) {
            const command = body.substring(1); // Remove the prefix '/'
            switch (command) {
              case "stop":
                api.sendMessage("Goodbye…", event.threadID);
                return stopListening();
              case "start":
                api.sendMessage("Starting...", event.threadID);
                break;
              case "pict":
                var msg = {
                  url: "https://rare-gallery.com/thumbs/1195058-anime-girls-picture-in-picture-Hyouka-Chitanda-Eru.jpg",
                };
                api.sendMessage(msg, event.threadID);
                break;
              // Add other commands here...
              default:
                api.sendMessage("Unknown command", event.threadID);
                console.error(body);
                break;
            }
          } else if (startsWithPrefix(body, "gpt ")) {
            const gptQuery = body.substring(4); // Remove the prefix 'gpt '
            console.log(gptQuery);
            axios
              .get("https://api.akuari.my.id/ai/gpt?chat=" + gptQuery)
              .then(({ data }) => {
                api.sendMessage("jadiiiii....." + data.respon, event.threadID);
              })
              .catch((error) => {
                console.error(error);
              });
          } else if (startsWithPrefix(body, "ip")) {
            axios.get(`https://api.myip.com`).then(({ data }) => {
              let ip = `IP ADDRESS BOT: ${data.ip}\nCOUNTRY BOT: ${data.country}`;
              console.log(data);
              api.sendMessage(ip, event.threadID);
            });
          } else {
            api.sendMessage("hallo", event.threadID);
            //abc
          }
          break;
        case "event":
          console.log(event);
          break;
      }
    });
  }
);

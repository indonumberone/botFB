import { fileURLToPath } from "url";
import fs from 'fs'
import path from "path";
import request from "request";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export async function sendFile(api, event, url, msg, filepath = "../tmp/image.jpg") {
  function limit() {
    request.head(url, (err, res, body) => {
      // Download file and pass to chat API
      const fullpath = path.join(dirname, filepath);
      // const fullpath = `${__dirname}/${path}`;
      if (!err) {
        request(url)
          .pipe(fs.createWriteStream(fullpath))
          .on("close", (err, data) => {
            if (!err) {
              api.sendMessage(
                {
                  body: msg,
                  attachment: fs.createReadStream(fullpath),
                },
                event.threadID
              );
            } else {
              api.sendMessage(msg, event.threadID);
            }
          });
      } else {
        // Just send the description if photo can't be downloaded
        api.sendMessage(msg, event.threadID);
      }
    });
  }

  setTimeout(limit, 2000);
}

// exports.sendFile = (
//   filenames,
//   threadId,
//   message = "",
//   callback = () => {},
//   replyId = null,
//   api = gapi
// ) => {
//   if (typeof filenames == "string") {
//     // If only one is passed
//     filenames = [filenames];
//   }
//   for (let i = 0; i < filenames.length; i++) {
//     filenames[i] = fs.createReadStream(`${dirname}/${filenames[i]}`);
//   }
//   const msg = {
//     body: message,
//     attachment: filenames,
//   };
//   function limit() {
//     exports.sendMessage(msg, threadId, callback, replyId);
//   }
//   setTimeout(limit, 1500);
// };

const { EventEmitter } = require("events");
const http = require("http");
const fs = require("fs");
const path = require("path");

const Newsletter = new EventEmitter();

const server = http.createServer((req, res) => {
    const { url , method } = req;
    const chunks = [];

    req.on("data", (chunk) => {
        chunks.push(chunk)
    });

    req.on("end", () => {
        if(url == "/newsletter_signup" && method == "POST"){
            const reqBody = JSON.parse(Buffer.concat(chunks).toString());

            const contact = `${reqbody.name},${reqbody.email}\n`;

            Newsletter.emit("signup", contact, res);

            res.setHeader("Content-Type", "application/json");
            res.write(
                JSON.stringify({ msg: "Sign up successful!" }))
            res.end();
        } else if (url == "/newsletter_signup" && method == "GET") {
            readFile(path.join(__dirname, "../public/index.html"), (err, data) => {
                if (err){
                    console.log(err)
                    res.emit("error", err)
                    return;
                }
                res.setHeader("Content-Type", "text/html");
                res.write(data);
                res.end();
            })
        } else {
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json");
            res.write(JSON.stringify({ msg: "Error: Try your request again" }))
            res.end();
        };
    });
});

server.listen(8080, () => console.log("Server is listening"))

Newsletter.on("signup", (contact, res) => {
    fs.appendFile(path.join(__dirname, "./newsletter.csv"), contact, (err) => {
        if(err){
            Newsletter.emit("error", err, res);
            return;
        }
        console.log("Successfully updated");
    });
});

Newsletter.on("error", (err, res) => {
    console.log(err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify({msg: "Error: Please try again"}))
    res.end();
});

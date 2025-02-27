const telnet = require("telnet-client");
const fs = require("fs");
const server = new telnet();

async function connectToServer(host) {
  const params = {
    host: host,
    port: 23,
    shellPrompt: ">",
    timeout: 1500,
    loginPrompt: "login: ",
    passwordPrompt: "Password: ",
    username: "root",
    password: "Aztelekom@123",
  };
  try {
    await server.connect(params);
    console.log("Connected to the server");

    await server.send(params.username, { timeout: 1500, execTimeout: 5000 });
    await server.send(params.password, { timeout: 1500, execTimeout: 5000 });

    let res = await server.send("enable\r\ndisplay vlan all\r\n", {
      shellPrompt: ">",
    });
    console.log("Response:", res);

    const vlanLines = res.match(/^\s*\d+\s+\w+\s+\w+\s+\d+\s+\d+\s+-$/gm);
    if (vlanLines) {
      const vlanInfo = vlanLines.map((line) => {
        const parts = line.trim().split(/\s+/);
        return { VLAN: parts[0], SERV_Port_NUM: parts[4] };
      });
      console.log(vlanInfo);

      let arr = [];
      fs.readFile("telnet.json", (err, data) => {
        arr = JSON.parse(data.toString());
        arr.push(vlanInfo);
        console.log(arr);
        fs.writeFile("telnet.json", JSON.stringify(arr, null, 2), (err) => {
          if (err) {
            console.error("Error writing to file:", err);
          } else {
            console.log("Output saved to telnet.json");
          }
        });
      });
    } else {
      console.error("No VLAN information found in the response");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

module.exports = { connectToServer };

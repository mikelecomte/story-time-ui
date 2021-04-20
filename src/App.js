import "./App.css";
import React, { useEffect } from "react";
import { TextField } from "@material-ui/core";
import socketIOClient from "socket.io-client";

const apiUrl = process.env.REACT_APP_API_URL;

const client = socketIOClient(apiUrl);

const sendText = (text) => {
  client.emit("newText", {
    text: text,
    clientId: client.id,
  });
};

const App = () => {
  useEffect(() => {
    client.on("connect", () => {
      console.log(client.id);
    });

    client.on("currentSubmission", ({ text, clientId }) => {
      console.log(text);
    });
  }, []);

  return (
    <div className="App">
      <h1>Story Time!</h1>
      <h2>The story so far...</h2>
      <div>
        <TextField
          id="outlined-multiline-static"
          label="And then..."
          multiline
          rows={4}
          placeholder="What happens next?"
          variant="outlined"
          fullWidth
          onChange={(e) => sendText(e.target.value)}
        />
      </div>
    </div>
  );
};

export default App;

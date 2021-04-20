import "./App.css";
import React, { useEffect, useState } from "react";
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
  const [myTurn, setMyTurn] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [currentSubmission, setCurrentSubmission] = useState("");

  useEffect(() => {
    client.on("connect", () => {
      console.log("connect", client.id);
    });

    client.on("currentSubmission", ({ text, clientId }) => {
      setCurrentSubmission(text);
      console.log("currentSubmission", text);
    });

    client.on("nextTurn", (data) => {
      console.log("nextTurn", data);

      setMyTurn(client.id === data);
    });

    client.on("submissions", (data) => {
      setSubmissions(data);
      console.log("submissions", data);
    });
  }, []);

  return (
    <div className="App">
      <h1>Story Time!</h1>
      <h2>The story so far...</h2>
      {submissions.map((s) => (
        <ul>{s.text}</ul>
      ))}
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
          disabled={!myTurn}
        />
      </div>
    </div>
  );
};

export default App;

import "./App.css";
import React, { useEffect, useState } from "react";
import { TextField } from "@material-ui/core";
import socketIOClient from "socket.io-client";

const apiUrl = process.env.REACT_APP_API_URL;
const client = socketIOClient(apiUrl);

const App = () => {
  const [myTurn, setMyTurn] = useState(false);
  const [mySubmission, setMySubmission] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [remoteSubmission, setRemoteSubmission] = useState("");
  const [error, setError] = useState("");

  const sendText = (text) => {
    setMySubmission(text);
    client.emit("newText", {
      text: text,
    });
  };

  useEffect(() => {
    client.on("connect", () => {
      console.log("connected", client.id);
    });

    client.on("currentSubmission", ({ text, clientId }) => {
      setRemoteSubmission(text);
    });

    client.on("nextTurn", (data) => {
      setMyTurn(client.id === data);
      setMySubmission("");
      setRemoteSubmission("");
    });

    client.on("submissions", (data) => {
      setSubmissions(data);
    });

    client.on("error", (data) => {
      setError(data);
    });
  }, []);

  return (
    <div className="App">
      <h1>Story Time!</h1>
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          <h2>The story so far...</h2>
          {submissions.map((s) => (
            <ul key={s.submissionId}>
              <p style={{ color: s.colour }}>{s.text}</p>
            </ul>
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
              value={myTurn ? mySubmission : remoteSubmission}
              onChange={(e) => sendText(e.target.value)}
              disabled={!myTurn}
            />
          </div>
          <div>
            <p>
              {myTurn
                ? "It's your turn, you have 10 seconds to type something!"
                : "Other players are typing, watch them go!"}
            </p>
          </div>{" "}
        </>
      )}
    </div>
  );
};

export default App;

import "./App.css";
import React, { useEffect } from "react";
import { TextField } from "@material-ui/core";
import socketIOClient from "socket.io-client";

const apiUrl = process.env.REACT_APP_API_URL;

const App = () => {
  useEffect(() => {
    const socket = socketIOClient(apiUrl);
    socket.on("connect", () => {
      console.log("connected");
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
        />
      </div>
    </div>
  );
};

export default App;

import React, { createContext } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { RootStore } from "./stores/root";
import * as serviceWorker from "./serviceWorker";

export const StoreContext = createContext();

ReactDOM.render(
  <React.StrictMode>
    <StoreContext.Provider value={new RootStore()}>
      <App />
    </StoreContext.Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

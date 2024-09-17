import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import store from "./store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    // <React.StrictMode>
    <Provider store={store}>
        <Suspense>
            <App />
            <Toaster
                toastOptions={{
                    position: "top-center",
                    style: {
                        background: "#283046",
                        color: "white",
                    },
                }}
            />{" "}
        </Suspense>{" "}
    </Provider>
    // </React.StrictMode>
);

reportWebVitals();

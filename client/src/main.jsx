
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import "./index.css";

import {Provider} from 'react-redux';
import {store} from './app/store.js';

ReactDOM.createRoot(document.getElementById("root")).render(
    <StrictMode>
        {/* <BrowserRouter>
          <AuthProvider>
             <App />

          </AuthProvider>
        </BrowserRouter> */}

        <Provider store={store}>
            <BrowserRouter>
                    <App />
            </BrowserRouter>
        </Provider>
    </StrictMode>
);  


import React from "react";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider } from "@chakra-ui/react";
import ReactDOM from "react-dom/client";
import { ChakraBaseProvider, extendBaseTheme } from "@chakra-ui/react";
// `@chakra-ui/theme` is a part of the base install with `@chakra-ui/react`
import { theme as chakraTheme } from "@chakra-ui/theme";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { PageProvider } from "./flux/navigation/store";
import { PetProvider } from "./flux/pets/store";
import { UserProvider } from "./flux/user/store";
import { CartProvider } from "./flux/store/store";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const components = chakraTheme.components;

const theme = extendBaseTheme({
  components: components,
});

root.render(
  // <React.StrictMode>
    <ChakraProvider>
      <ChakraBaseProvider theme={theme}>
        <BrowserRouter>
          <AuthProvider>
            <UserProvider>
              <PageProvider>
                <PetProvider>
                  <CartProvider>
                    <Routes>
                      <Route path="/*" element={<App />} />
                    </Routes>
                  </CartProvider>
                </PetProvider>
              </PageProvider>
            </UserProvider>
          </AuthProvider>
        </BrowserRouter>
      </ChakraBaseProvider>
    </ChakraProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

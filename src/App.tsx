import { Route, Routes } from "react-router-dom";
import SignIn from "./pages/Signin/Views";
import PageNotFound from "./pages/Errors/404/Views";
import SidebarWithHeader from "./pages/Home/Views";
import PersistLogin from "./pages/Components/PersistLogin";
import RequireAuth from "./pages/Components/RequiredAuth";
import Root from "./pages/Landing/Root/Views";
import { useEffect } from "react";
import PetPublicDetailsPage from "./pages/Pet/Details/Views";
import RegisterPetPage from "./pages/Pet/Register/Views";
import PetNotFound from "./pages/Errors/404/Views/pet";
import RegisterLoader from "./pages/Pet/Register/Views/loading";
import QRCodeIsAlreadyTaken from "./pages/Errors/409/Views";
import PetDetailsLoader from "./pages/Pet/Details/Views/loading";
import PetFoundPage from "./pages/Pet/Found/Views";

function App() {

  return (
    <main>
      <Routes>
        {/* public routes */}
        <Route path="/" element={<Root />} />

        <Route element={<PetDetailsLoader />}>
          <Route path="/pet/:id" element={<PetPublicDetailsPage />} />
          <Route path="/pet/:id/found" element={<PetFoundPage />} />
        </Route>

        <Route element={<RegisterLoader />}>
          <Route path="/pet/:id/create" element={<RegisterPetPage />} />
        </Route>

        <Route path="/pet/error/not-found" element={<PetNotFound />} />
        <Route path="/pet/error/qr-code-is-already-taken" element={<QRCodeIsAlreadyTaken />} />
        <Route path="signin" element={<SignIn />} />
        {/* <Route path="register" element={<Register />} /> */}
        {/* we want to protect these routes */}
        <Route element={<PersistLogin />}>
          <Route path="signin" element={<SignIn />} />
          <Route element={<RequireAuth />}>
            <Route path="/home" element={<SidebarWithHeader />} />
          </Route>
        </Route>

        {/* catch all */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </main>
  );
}

export default App;
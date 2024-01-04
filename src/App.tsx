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
import VerifyEmailResultPage from "./pages/VerifyEmail/Views";
import VerifyEmailLoader from "./pages/VerifyEmail/Views/loading";
import AdminPage from "./pages/Admin/Views";
import OrderItemPage from "./pages/Purchase/Views";
import ForgotPasswordPage from "./pages/ForgotPassword/Views";
import SignUpOptionPage from "./pages/SignUpOption/Views";
import ChangePasswordPage from "./pages/ChangePassword/Views";

function App() {

  return (
    <main>
      <Routes>
        {/* public routes */}
        <Route path="/" element={<Root />} />
        <Route path="/signup/option" element={<SignUpOptionPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/change-password/:token" element={<ChangePasswordPage />} />
        <Route path="/order-petnfc-qr-tag" element={<OrderItemPage />} />

        <Route element={<PetDetailsLoader />}>
          <Route path="/pet/:id" element={<PetPublicDetailsPage />} />
          <Route path="/pet/:id/found" element={<PetFoundPage />} />
        </Route>

        <Route element={<RegisterLoader />}>
          <Route path="/pet/:id/create" element={<RegisterPetPage />} />
        </Route>

        <Route path="/pet/:id/create" element={<RegisterPetPage />} />

        {/* <Route element={<VerifyEmailLoader />}>
          <Route path="/auth/verify/:id" element={<VerifyEmailResultPage />} />
        </Route> */}

        <Route path="/pet/error/qr-code-is-already-taken" element={<QRCodeIsAlreadyTaken />} />
        {/* <Route path="signin" element={<SignIn />} /> */}
        {/* <Route path="register" element={<Register />} /> */}
        {/* we want to protect these routes */}
        
        <Route element={<PersistLogin />}>
          <Route path="signin" element={<SignIn />} />
        </Route>

          <Route element={<RequireAuth />}>
            <Route path="/adminpanel" element={<AdminPage />} />
          </Route>

          <Route element={<RequireAuth />}>
            <Route path="/home" element={<SidebarWithHeader />} />
          </Route>

        {/* catch all */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </main>
  );
}

export default App;

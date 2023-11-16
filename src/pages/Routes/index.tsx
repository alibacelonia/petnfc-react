import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../../Provider/authProvider";
import { ProtectedRoute } from "../Routes/ProtectedRoute";
import Root from "../Landing/Root/Views";
import SignIn from "../Signin/Views";
import HomePage from "../Home/Views";

const Routes = () => {
  const { token } = useAuth();

  // Define public routes accessible to all users
  const routesForPublic = [
    {
      path: "/",
      element: <Root />,
    },
    {
      path: "/signin",
      element: <SignIn/>,
    },
  ];

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
      children: [
        {
          path: "/home",
          element: <HomePage/>,
        },
        {
          path: "/profile",
          element: <div>profile</div>,
        },
      ],
    },
  ];

  // Define routes accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly = [
    {
      path: "/",
      element: <Root />,
    },
    {
      path: "/signin",
      element: <SignIn/>,
    },
  ];

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    ...routesForPublic,
    ...(!token ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;
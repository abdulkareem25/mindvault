import { createBrowserRouter } from "react-router-dom";
import Protected from "../features/auth/components/Protected";
import AlreadyVerified from "../features/auth/pages/AlreadyVerified";
import Login from "../features/auth/pages/Login";
import Signup from "../features/auth/pages/Signup";
import VerifyEmail from "../features/auth/pages/VerifyEmail";
import VerifySuccess from "../features/auth/pages/VerifySuccess";
import Dashboard from "../features/chat/pages/Dashboard";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  }, {
    path: "/signup",
    element: <Signup />,
  }, {
    path: "/verify-email",
    element: <VerifyEmail />,
  }, {
    path: "/verify-success",
    element: <VerifySuccess />,
  }, {
    path: "/already-verified",
    element: <AlreadyVerified />,
  }, {
    path: "/dashboard",
    element: <Protected>
      <Dashboard />
    </Protected>
  }
]);

export default router;
import { createBrowserRouter } from "react-router-dom";
import Protected from "../features/auth/components/Protected";
import AlreadyVerified from "../features/auth/pages/AlreadyVerified";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import Login from "../features/auth/pages/Login";
import ResetPassword from "../features/auth/pages/ResetPassword";
import Signup from "../features/auth/pages/Signup";
import VerifyEmail from "../features/auth/pages/VerifyEmail";
import VerifySuccess from "../features/auth/pages/VerifySuccess";
import ChatPage from "../features/chat/pages/ChatPage";
import Dashboard from "../features/chat/pages/Dashboard";
import DigestArchivePage from "../features/digest/pages/DigestArchivePage";
import VaultPage from "../features/vault/components/VaultPage";
import { AppLayout } from "../shared/components/layout/AppLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Protected>
        <AppLayout>
          <Dashboard />
        </AppLayout>
      </Protected>
    )
  },
  {
    path: "/chats/:id",
    element: (
      <Protected>
        <AppLayout>
          <ChatPage />
        </AppLayout>
      </Protected>
    )
  },
  {
    path: "/vault",
    element: (
      <Protected>
        <AppLayout>
          <VaultPage />
        </AppLayout>
      </Protected>
    )
  },
  {
    path: "/digests",
    element: (
      <Protected>
        <AppLayout>
          <DigestArchivePage />
        </AppLayout>
      </Protected>
    )
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },
  {
    path: "/verify-success",
    element: <VerifySuccess />,
  },
  {
    path: "/already-verified",
    element: <AlreadyVerified />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
]);


export default router;
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './App.css'

import { SignIn, SignUp, Home, ConfirmSignUp } from './pages'

const router = createBrowserRouter([
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/confirm-sign-up",
    element: <ConfirmSignUp />,
  },
  {
    path: "/",
    element: <Home />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App

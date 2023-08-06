import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { SignIn, SignUp, Home, ConfirmSignUp, List } from './pages'

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
    element: <Home />
  },
  {
    path: "/lists/:listId",
    element: <List />,
  }
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App

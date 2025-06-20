import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App.jsx"
import PaginaError from "./pages/PaginaError.jsx";
import PaginaChat from "./pages/PaginaChat.jsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/pokemones" replace />,
    },
    {
       path: "/pokemones",
       Component: App,
    },
    {
       path: "/chat/:pokemon_nombre",
       Component: PaginaChat,
    },
    {
        path: '*',
        element: <PaginaError />
    }
])
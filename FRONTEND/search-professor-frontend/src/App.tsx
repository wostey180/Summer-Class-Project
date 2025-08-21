import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import AboutUsPage from "./pages/AboutUsPage";
import ProfilePage from "./pages/ProfilePage";
import Navbar from "./components/Navbar";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import CreateQuestionSetPage from "./pages/QuestionSet/CreateQuestionSetPage";
import { jwtDecode } from "jwt-decode";
import ListQuestionSetPage from "./pages/QuestionSet/ListQuestionSetPage";
import AttemptQuizPage from "./pages/QuestionSet/AttemptQuizPage";

export interface IAuthState {
  isAuth: boolean;
  role: "guest" | "admin" | "professional";
}
export interface IAuthContext extends IAuthState {
  setAuthState: React.Dispatch<React.SetStateAction<IAuthState>>;
}

export interface JWTData {
  id: string;
  role: "admin" | "professional";
}

export const AuthContext = createContext<IAuthContext>({
  isAuth: false,
  role: "guest",
  setAuthState: () => {},
});

function App() {
  const [authState, setAuthState] = useState<IAuthState>({
    isAuth: false,
    role: "guest",
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  console.log("auth => ", authState);
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    async function fetchData() {
      axios
        .get("http://localhost:3000/api/verify/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          const { role }: JWTData = jwtDecode(accessToken as string);

          setAuthState((prev) => ({
            ...prev,
            isAuth: true,
            role,
          }));
          setIsLoading(false);
        })
        .catch((error) => {
          localStorage.removeItem("accessToken");
          setIsLoading(false);
        });
    }

    fetchData();
  }, []);

  if (isLoading) {
    return <p>Loading Data......</p>;
  }

  return (
    <>
      <AuthContext.Provider
        value={{
          isAuth: authState.isAuth,
          role: authState.role,
          setAuthState: setAuthState,
        }}
      >
        <Navbar />
        <Routes>
          {/* unauth */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUsPage />} />
          {authState.isAuth && (
            <Route path="/profile" element={<ProfilePage />} />
          )}
          {authState?.role === "guest" && (
            <>
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
            </>
          )}

          {/* auth routes */}
          {authState?.isAuth && (
            <>
              <Route
                path="/questionset/list"
                element={<ListQuestionSetPage />}
              />
              <Route
                path="/questionset/:id/attempt"
                element={<AttemptQuizPage />}
              />
            </>
          )}

          {/* admin routes */}
          {authState?.role === "admin" && (
            <>
              <Route
                path="/admin/questionset/create"
                element={<CreateQuestionSetPage />}
              />
            </>
          )}
          <Route path="*" element={<p>Page Not Found</p>} />
        </Routes>
      </AuthContext.Provider>
    </>
  );
}

export default App;

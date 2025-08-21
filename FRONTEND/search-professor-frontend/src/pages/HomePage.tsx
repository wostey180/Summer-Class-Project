import { Link } from "react-router-dom";
import AuthHomePage from "../components/HomePage/AuthHomePage";

function HomePage() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "2rem",
      fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
      background: "linear-gradient(135deg, #6c63ff, #00c6ff)",
      color: "#fff",
      textAlign: "center",
    }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Welcome to QuizMaster</h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "2rem", maxWidth: "600px" }}>
        Your place to take fun and educational quizzes. Login or Register to start taking quizzes 
        and challenge your knowledge!
      </p>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "3rem" }}>
        <Link 
          to="/login" 
          style={{
            padding: "0.8rem 1.5rem",
            background: "#fff",
            color: "#6c63ff",
            fontWeight: 600,
            borderRadius: "10px",
            textDecoration: "none",
            transition: "all 0.3s ease",
          }}
        >
          Login
        </Link>

        <Link 
          to="/register" 
          style={{
            padding: "0.8rem 1.5rem",
            background: "#fff",
            color: "#6c63ff",
            fontWeight: 600,
            borderRadius: "10px",
            textDecoration: "none",
            transition: "all 0.3s ease",
          }}
        >
          Register
        </Link>

        <Link 
          to="/questionset/list" 
          style={{
            padding: "0.8rem 1.5rem",
            background: "#fff",
            color: "#6c63ff",
            fontWeight: 600,
            borderRadius: "10px",
            textDecoration: "none",
            transition: "all 0.3s ease",
          }}
        >
          View Quizzes
        </Link>
      </div>

      {/* Authenticated homepage component */}
      <AuthHomePage />
    </div>
  );
}

export default HomePage;

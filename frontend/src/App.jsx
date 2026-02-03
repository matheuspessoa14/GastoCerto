import { useEffect, useState } from "react";
import api from "./services/api";
import Login from "./pages/login";
import Register from "./pages/register";
import Gastos from "./pages/gastos";
import Dashboard from "./pages/dashboard";
import Navbar from "./components/navbar";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [logado, setLogado] = useState(false);

  // navegação interna do app (sem router)
  const [pagina, setPagina] = useState("gastos"); // "gastos" | "dashboard"

  // tela de autenticação (login/register)
  const [authTela, setAuthTela] = useState("login"); // "login" | "register"

  async function checarSessao() {
    try {
      await api.get("/api/auth/me");
      setLogado(true);
    } catch {
      setLogado(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checarSessao();
  }, []);

  async function handleLogout() {
    try {
      await api.post("/api/auth/logout");
    } finally {
      setLogado(false);
      setPagina("gastos");
      setAuthTela("login");
    }
  }

  if (loading) return <p className="container">Carregando...</p>;

  // Não logado: alterna entre Login e Register
  if (!logado) {
    return authTela === "login" ? (
      <Login
        onLoginOk={() => setLogado(true)}
        onGoRegister={() => setAuthTela("register")}
      />
    ) : (
      <Register
        onGoLogin={() => setAuthTela("login")}
        onRegisterOk={() => setAuthTela("login")}
      />
    );
  }

  // Logado: mostra navbar + página
  return (
    <div>
      <Navbar onNavigate={setPagina} onLogout={handleLogout} />

      {pagina === "gastos" ? <Gastos /> : <Dashboard />}
    </div>
  );
}

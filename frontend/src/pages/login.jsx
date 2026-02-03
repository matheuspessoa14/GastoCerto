// PÁGINA DE LOGIN

import { useState } from "react";
import api from "../services/api";
import logo from "../assets/logo.png";

export default function Login({ onLoginOk, onGoRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const res = await api.post("/api/auth/login", { username, password });
      setMsg(res.data?.msg || "Login realizado!");
      onLoginOk();
    } catch (err) {
      const apiMsg = err.response?.data?.erro;
      setMsg(apiMsg || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 520 }}>
      <div className="header" style={{ justifyContent: "center" }}>
        <div className="brand">
          <img src={logo} alt="Logo GastoCerto" className="logo-img" />
          <div>
            <h2 className="title" style={{ margin: 0 }}>
              GastoCerto
            </h2>
            <p className="subtitle">
              Entre para controlar seus gastos com clareza
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="row-between" style={{ marginBottom: 10 }}>
          <div>
            <p className="title" style={{ margin: 0, fontSize: "1.05rem" }}>
              Acessar conta
            </p>
            <p className="subtitle" style={{ marginTop: 6 }}>
              Use seu usuário e senha para entrar.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 10 }}>
            <div className="label" style={{ marginBottom: 6 }}>
              Usuário
            </div>
            <input
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ex: matheus"
              autoComplete="username"
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <div className="label" style={{ marginBottom: 6 }}>
              Senha
            </div>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <div className="spacer" />

          <div className="row" style={{ gap: 10 }}>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>

            <button
              className="btn btn-ghost"
              type="button"
              onClick={onGoRegister}
            >
              Criar conta
            </button>
          </div>

          <p className="muted small" style={{ margin: 0 }}>
            Dica: se você não tiver usuário ainda, entre com o seguinte usuário:
            (user = matheus | senha = 123456)
          </p>
        </form>
      </div>
    </div>
  );
}

// PÁGINA DE CADASTRO - REGISTRO

import { useState } from "react";
import api from "../services/api";

export default function Register({ onGoLogin, onRegisterOk }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const res = await api.post("/api/auth/register", { username, password });
      setMsg(res.data?.msg || "Conta criada com sucesso!");
      if (onRegisterOk) onRegisterOk(); // opcional: voltar pro login automaticamente
    } catch (err) {
      const apiMsg = err.response?.data?.erro;
      setMsg(apiMsg || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 520 }}>
      <div className="header" style={{ justifyContent: "center" }}>
        <div className="brand">
          <div className="logo" />
          <div>
            <h2 className="title" style={{ margin: 0 }}>GastoCerto</h2>
            <p className="subtitle">Crie sua conta em segundos</p>
          </div>
        </div>
      </div>

      <div className="card">
        <p className="title" style={{ margin: 0, fontSize: "1.05rem" }}>
          Criar conta
        </p>
        <p className="subtitle" style={{ marginTop: 6 }}>
          Escolha um usuário e uma senha.
        </p>

        <div className="spacer" />

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 10 }}>
            <div className="label" style={{ marginBottom: 6 }}>Usuário</div>
            <input
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ex: matheus"
              autoComplete="username"
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <div className="label" style={{ marginBottom: 6 }}>Senha</div>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>

          <div className="row" style={{ gap: 10 }}>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar conta"}
            </button>

            <button className="btn btn-ghost" type="button" onClick={onGoLogin}>
              Voltar
            </button>
          </div>

          {msg && <div className="msg">{msg}</div>}

          <div className="spacer" />

          <p className="muted small" style={{ margin: 0 }}>
            Dica: se aparecer “Usuário já existe”, tente outro username.
          </p>
        </form>
      </div>
    </div>
  );
}

// PÁGINA DE DASHBOARD

import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

export default function Dashboard() {
  const hoje = new Date();
  const [month, setMonth] = useState(hoje.getMonth() + 1); // 1-12
  const [year, setYear] = useState(hoje.getFullYear());

  const [resumo, setResumo] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function carregarResumo() {
    setMsg("");
    setLoading(true);

    try {
      const res = await api.get(`/api/gastos/summary?month=${month}&year=${year}`);
      setResumo(res.data);
    } catch (err) {
      setResumo(null);
      setMsg(err.response?.data?.erro || "Erro ao carregar resumo");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarResumo();
  }, []);

  const topCategorias = useMemo(() => {
    if (!resumo?.by_category) return [];
    return resumo.by_category.slice(0, 3);
  }, [resumo]);

  const maiorCategoria = useMemo(() => {
    if (!resumo?.by_category || resumo.by_category.length === 0) return null;
    return resumo.by_category[0];
  }, [resumo]);

  function formatBRL(v) {
    try {
      return Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    } catch {
      return `R$ ${v}`;
    }
  }

  return (
    <div className="container">
      <div className="header">
        <div>
          <h2 className="title">Dashboard</h2>
          <p className="subtitle">Resumo do período com insights rápidos</p>
        </div>
        <span className="badge">
          {Number(month)}/{Number(year)}
        </span>
      </div>

      {/* Filtro */}
      <div className="card">
        <div className="row-wrap">
          <span className="label">Mês</span>
          <input
            className="input"
            type="number"
            min="1"
            max="12"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            style={{ maxWidth: 120 }}
          />

          <span className="label">Ano</span>
          <input
            className="input"
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            style={{ maxWidth: 160 }}
          />

          <button className="btn btn-primary" type="button" onClick={carregarResumo}>
            {loading ? "Atualizando..." : "Atualizar"}
          </button>

          <span className="muted" style={{ marginLeft: "auto" }}>
            Dica: compare meses para ver padrões
          </span>
        </div>

        {msg && <div className="msg">{msg}</div>}
      </div>

      {/* Cards principais */}
      <div className="row-wrap" style={{ marginTop: 14 }}>
        <div className="card" style={{ flex: 1, minWidth: 260 }}>
          <p className="label" style={{ marginTop: 0 }}>Total do período</p>
          <p className="title" style={{ margin: 0, fontSize: "1.6rem" }}>
            {resumo ? formatBRL(resumo.total) : loading ? "..." : "--"}
          </p>
          <p className="subtitle" style={{ marginTop: 8 }}>
            Soma de todos os gastos no mês selecionado.
          </p>
        </div>

        <div className="card" style={{ flex: 1, minWidth: 260 }}>
          <p className="label" style={{ marginTop: 0 }}>Insight</p>

          {maiorCategoria ? (
            <>
              <p className="title" style={{ margin: 0, fontSize: "1.1rem" }}>
                Você gastou mais em <span style={{ color: "var(--primary)" }}>{maiorCategoria.categoria}</span>
              </p>
              <p className="subtitle" style={{ marginTop: 8 }}>
                Total nessa categoria: <strong>{formatBRL(maiorCategoria.total)}</strong>
              </p>
            </>
          ) : (
            <p className="muted" style={{ margin: 0 }}>
              {loading ? "Carregando..." : "Sem gastos no período para gerar insight."}
            </p>
          )}

          <p className="subtitle" style={{ marginTop: 10 }}>
            Dica: tente reduzir a maior categoria e acompanhe mês a mês.
          </p>
        </div>
      </div>

      {/* Top categorias */}
      <div className="card" style={{ marginTop: 14 }}>
        <div className="row-between" style={{ marginBottom: 10 }}>
          <p className="title" style={{ margin: 0, fontSize: "1.05rem" }}>
            Top categorias
          </p>
          <span className="muted">{resumo?.by_category?.length || 0} categoria(s)</span>
        </div>

        {loading && !resumo ? (
          <p className="muted">Carregando...</p>
        ) : !resumo || resumo.by_category.length === 0 ? (
          <p className="muted">Nenhum gasto nesse período.</p>
        ) : (
          <ul className="list">
            {topCategorias.map((c) => (
              <li className="item" key={c.categoria}>
                <div>
                  <div className="item-title">{c.categoria}</div>
                  <div className="muted small">Total no período</div>
                </div>

                <div className="row">
                  <span className="badge">{formatBRL(c.total)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}

        {resumo?.by_category?.length > 3 && (
          <p className="muted small" style={{ marginTop: 10 }}>
            Mostrando as 3 maiores. As demais continuam no backend (podemos exibir depois).
          </p>
        )}
      </div>
    </div>
  );
}

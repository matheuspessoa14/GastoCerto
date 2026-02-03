// PÁGINA DE GASTOS MENSAIS

import { useEffect, useState } from "react";
import api from "../services/api";

export default function Gastos() {
  const hoje = new Date();

  const [gastos, setGastos] = useState([]);
  const [msg, setMsg] = useState("");

  // filtro mês/ano (começa no mês atual)
  const [month, setMonth] = useState(hoje.getMonth() + 1); // 1-12
  const [year, setYear] = useState(hoje.getFullYear());

  // form
  const [form, setForm] = useState({ valor: "", categoria: "", descricao: "" });

  // edição
  const [editId, setEditId] = useState(null);

  async function carregar() {
    const m = Number(month);
    const y = Number(year);
    if (!m || !y) return;

    const res = await api.get("/api/gastos", {
      params: { month: m, year: y },
    });
    setGastos(res.data);
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function limparForm() {
    setEditId(null);
    setForm({ valor: "", categoria: "", descricao: "" });
  }

  function iniciarEdicao(g) {
    setMsg("");
    setEditId(g.id);
    setForm({
      valor: String(g.valor ?? ""),
      categoria: g.categoria ?? "",
      descricao: g.descricao ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function aplicarFiltro() {
    setMsg("");
    const m = Number(month);
    const y = Number(year);

    if (!m || m < 1 || m > 12 || !y) {
      setMsg("Informe um mês (1–12) e um ano válido.");
      return;
    }

    await carregar();
    limparForm();
  }

  async function salvar(e) {
    e.preventDefault();
    setMsg("");

    const v = parseFloat(form.valor);
    const c = form.categoria.trim();
    const d = form.descricao.trim() || null;

    if (!c || Number.isNaN(v)) {
      setMsg("Preencha um valor válido e uma categoria.");
      return;
    }

    try {
      if (editId) {
        await api.put(`/api/gastos/${editId}`, {
          valor: v,
          categoria: c,
          descricao: d,
        });
        setMsg("Gasto atualizado!");
      } else {
        await api.post("/api/gastos", { valor: v, categoria: c, descricao: d });
        setMsg("Gasto criado!");
      }

      await carregar(); // recarrega com filtro atual
      limparForm();
    } catch (err) {
      console.log(
        "Erro ao salvar:",
        err.response?.status,
        err.response?.data || err.message,
      );
      setMsg(err.response?.data?.erro || "Erro ao salvar gasto");
    }
  }

  async function excluir(id) {
    setMsg("");

    const ok = window.confirm("Tem certeza que deseja excluir este gasto?");
    if (!ok) return;

    try {
      await api.delete(`/api/gastos/${id}`);
      await carregar();
      setMsg("Gasto removido!");
      if (editId === id) limparForm();
    } catch (err) {
      console.log(
        "Erro ao excluir:",
        err.response?.status,
        err.response?.data || err.message,
      );
      setMsg(err.response?.data?.erro || "Erro ao remover gasto");
    }
  }

  return (
    <div className="container">
      <div className="header">
        <div>
          <h2 className="title">Gastos</h2>
          <p className="subtitle">
            Gerencie seus lançamentos e filtre por período
          </p>
        </div>
        <span className="badge">
          {Number(month)}/{Number(year)}
        </span>
      </div>

      {/* FILTRO */}
      <div className="card">
        <div className="row-wrap">
          <span className="label">Mês</span>
          <input
            className="input"
            type="number"
            min="1"
            max="12"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            style={{ maxWidth: 120 }}
          />

          <span className="label">Ano</span>
          <input
            className="input"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={{ maxWidth: 160 }}
          />

          <button
            className="btn btn-primary"
            type="button"
            onClick={aplicarFiltro}
          >
            Filtrar
          </button>

          <span className="muted" style={{ marginLeft: "auto" }}>
            Dica: crie um gasto no mês atual para aparecer no filtro
          </span>
        </div>

        {msg && <div className="msg">{msg}</div>}
      </div>

      {/* FORM */}
      <div className="card">
        <div className="row-between">
          <div>
            <p className="title" style={{ margin: 0, fontSize: "1.05rem" }}>
              {editId ? "Editando gasto" : "Adicionar gasto"}
            </p>
            <p className="subtitle" style={{ marginTop: 6 }}>
              {editId
                ? "Altere os campos e salve."
                : "Registre um novo lançamento."}
            </p>
          </div>

          {editId && (
            <button
              className="btn btn-ghost"
              type="button"
              onClick={limparForm}
            >
              Cancelar edição
            </button>
          )}
        </div>

        <div className="spacer" />

        <form onSubmit={salvar}>
          <div className="row-wrap">
            <div style={{ flex: 1, minWidth: 180 }}>
              <div className="label" style={{ marginBottom: 6 }}>
                Valor
              </div>
              <input
                className="input"
                value={form.valor}
                onChange={(e) => setForm({ ...form, valor: e.target.value })}
                placeholder="Ex: 52.90"
              />
            </div>

            <div style={{ flex: 1, minWidth: 180 }}>
              <div className="label" style={{ marginBottom: 6 }}>
                Categoria
              </div>
              <input
                className="input"
                value={form.categoria}
                onChange={(e) =>
                  setForm({ ...form, categoria: e.target.value })
                }
                placeholder="Ex: Alimentação"
              />
            </div>

            <div style={{ flex: 2, minWidth: 240 }}>
              <div className="label" style={{ marginBottom: 6 }}>
                Descrição (opcional)
              </div>
              <input
                className="input"
                value={form.descricao}
                onChange={(e) =>
                  setForm({ ...form, descricao: e.target.value })
                }
                placeholder="Ex: Lanche / Uber / Mercado..."
              />
            </div>

            <button className="btn btn-primary" type="submit">
              {editId ? "Salvar" : "Adicionar"}
            </button>
          </div>
        </form>
      </div>

      {/* LISTA */}
      <div className="card">
        <div className="row-between" style={{ marginBottom: 10 }}>
          <p className="title" style={{ margin: 0, fontSize: "1.05rem" }}>
            Lançamentos
          </p>
          <span className="muted">{gastos.length} item(ns)</span>
        </div>

        {gastos.length === 0 ? (
          <p className="muted">Nenhum gasto nesse período.</p>
        ) : (
          <ul className="list">
            {gastos.map((g) => (
              <li className="item" key={g.id}>
                <div>
                  <div className="item-title">
                    R$ {g.valor} <span className="muted">•</span> {g.categoria}
                  </div>
                  <div className="muted small">
                    {g.descricao ? g.descricao : "Sem descrição"} • {g.data}
                  </div>
                </div>

                <div className="row">
                  <button
                    className="btn btn-ghost"
                    type="button"
                    onClick={() => iniciarEdicao(g)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={() => excluir(g.id)}
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function GastoForm({
  form,
  setForm,
  editId,
  onSubmit,
  onCancel,
  msg,
}) {
  return (
    <form onSubmit={onSubmit} style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input
          value={form.valor}
          onChange={(e) => setForm({ ...form, valor: e.target.value })}
          placeholder="Valor (ex: 52.90)"
          style={{ flex: 1, padding: 8 }}
        />
        <input
          value={form.categoria}
          onChange={(e) => setForm({ ...form, categoria: e.target.value })}
          placeholder="Categoria"
          style={{ flex: 1, padding: 8 }}
        />
      </div>

      <input
        value={form.descricao}
        onChange={(e) => setForm({ ...form, descricao: e.target.value })}
        placeholder="Descrição (opcional)"
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
      />

      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit" style={{ padding: "8px 12px" }}>
          {editId ? "Salvar" : "Adicionar gasto"}
        </button>

        {editId && (
          <button
            type="button"
            onClick={onCancel}
            style={{ padding: "8px 12px" }}
          >
            Cancelar
          </button>
        )}
      </div>

      {msg && <p style={{ marginTop: 8 }}>{msg}</p>}
    </form>
  );
}

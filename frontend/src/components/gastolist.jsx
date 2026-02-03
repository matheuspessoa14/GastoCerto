export default function GastoList({ 
    gastos, 
    onEdit, 
    onDelete 
}) {
  return (
    <>
      <h3>Seus gastos</h3>

      {gastos.length === 0 ? (
        <p>Nenhum gasto ainda.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {gastos.map((g) => (
            <li
              key={g.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 12px",
                border: "1px solid #333",
                borderRadius: 8,
                marginBottom: 8,
                gap: 10,
              }}
            >
              <div>
                <strong>R$ {g.valor}</strong> — {g.categoria}{" "}
                {g.descricao ? `(${g.descricao})` : ""} — {g.data}
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button type="button" onClick={() => onEdit(g)}>
                  Editar
                </button>
                <button type="button" onClick={() => onDelete(g.id)}>
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

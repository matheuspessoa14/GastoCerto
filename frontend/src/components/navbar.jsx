import logo from "../assets/logo.png";

export default function Navbar({ onNavigate, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Marca */}
        <div className="brand">
          <img src={logo} alt="GastoCerto" className="logo-img" />
          <span className="brand-name">GastoCerto</span>
        </div>

        {/* Ações */}
        <div className="row" style={{ gap: 8 }}>
          <button className="btn" onClick={() => onNavigate("gastos")}>
            Gastos
          </button>

          <button className="btn" onClick={() => onNavigate("dashboard")}>
            Dashboard
          </button>

          <button className="btn btn-danger" onClick={onLogout}>
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
}

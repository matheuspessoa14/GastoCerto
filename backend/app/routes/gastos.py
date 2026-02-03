# Rotas de gerenciamento de gastos

from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from sqlalchemy import func

from app.extensions import db
from app.models import Gasto

gastos_bp = Blueprint("gastos", __name__, url_prefix="/api/gastos")


def _parse_date(date_str: str | None):
    """Aceita 'YYYY-MM-DD'. Se vier vazio, retorna None."""
    if not date_str:
        return None
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        return "invalid"


@gastos_bp.route("", methods=["POST"])
@login_required
def criar_gasto():
    dados = request.get_json(silent=True) or {}

    valor = dados.get("valor")
    categoria = dados.get("categoria")
    descricao = dados.get("descricao")
    data_str = dados.get("data")

    if valor is None or categoria is None:
        return jsonify({"erro": "Campos obrigatórios: valor, categoria"}), 400

    data_parsed = _parse_date(data_str)
    if data_parsed == "invalid":
        return jsonify({"erro": "Formato de data inválido. Use YYYY-MM-DD"}), 400

    gasto = Gasto(
        valor=float(valor),
        categoria=str(categoria).strip(),
        descricao=str(descricao).strip() if descricao else None,
        data=data_parsed if data_parsed else None,  # se None, usa default (hoje)
        user_id=current_user.id
    )

    db.session.add(gasto)
    db.session.commit()

    return jsonify({"msg": "Gasto criado com sucesso", "id": gasto.id}), 201


@gastos_bp.route("", methods=["GET"])
@login_required
def listar_gastos():
    # filtros opcionais: ?month=2&year=2026&category=Alimentação
    month = request.args.get("month", type=int)
    year = request.args.get("year", type=int)
    category = request.args.get("category")

    query = Gasto.query.filter_by(user_id=current_user.id)

    if category:
        query = query.filter(Gasto.categoria == category)

    if month and year:
        # filtra por intervalo do mês (simples, sem libs externas)
        start = datetime(year, month, 1).date()
        if month == 12:
            end = datetime(year + 1, 1, 1).date()
        else:
            end = datetime(year, month + 1, 1).date()
        query = query.filter(Gasto.data >= start, Gasto.data < end)

    gastos = query.order_by(Gasto.data.desc(), Gasto.id.desc()).all()

    return jsonify([
        {
            "id": g.id,
            "valor": g.valor,
            "categoria": g.categoria,
            "descricao": g.descricao,
            "data": g.data.isoformat(),
        }
        for g in gastos
    ]), 200


@gastos_bp.route("/<int:gasto_id>", methods=["PUT"])
@login_required
def atualizar_gasto(gasto_id):
    gasto = Gasto.query.filter_by(id=gasto_id, user_id=current_user.id).first()
    if not gasto:
        return jsonify({"erro": "Gasto não encontrado"}), 404

    dados = request.get_json(silent=True) or {}

    if "valor" in dados:
        gasto.valor = float(dados["valor"])
    if "categoria" in dados:
        gasto.categoria = str(dados["categoria"]).strip()
    if "descricao" in dados:
        gasto.descricao = str(dados["descricao"]).strip() if dados["descricao"] else None
    if "data" in dados:
        data_parsed = _parse_date(dados["data"])
        if data_parsed == "invalid":
            return jsonify({"erro": "Formato de data inválido. Use YYYY-MM-DD"}), 400
        if data_parsed:
            gasto.data = data_parsed

    db.session.commit()
    return jsonify({"msg": "Gasto atualizado com sucesso"}), 200


@gastos_bp.route("/<int:gasto_id>", methods=["DELETE"])
@login_required
def deletar_gasto(gasto_id):
    gasto = Gasto.query.filter_by(id=gasto_id, user_id=current_user.id).first()
    if not gasto:
        return jsonify({"erro": "Gasto não encontrado"}), 404

    db.session.delete(gasto)
    db.session.commit()
    return jsonify({"msg": "Gasto removido com sucesso"}), 200

@gastos_bp.route("/summary", methods=["GET"])
@login_required
def resumo_mensal():
    month = request.args.get("month", type=int)
    year = request.args.get("year", type=int)

    if not month or not year:
        return jsonify({"erro": "Informe month e year. Ex: ?month=2&year=2026"}), 400

    # intervalo do mês
    start = datetime(year, month, 1).date()
    if month == 12:
        end = datetime(year + 1, 1, 1).date()
    else:
        end = datetime(year, month + 1, 1).date()

    base = (
        Gasto.query
        .filter(Gasto.user_id == current_user.id)
        .filter(Gasto.data >= start, Gasto.data < end)
    )

    # Total do mês
    total_mes = base.with_entities(func.coalesce(func.sum(Gasto.valor), 0.0)).scalar()

    # Totais por categoria
    por_categoria = (
        base.with_entities(Gasto.categoria, func.sum(Gasto.valor))
        .group_by(Gasto.categoria)
        .order_by(func.sum(Gasto.valor).desc())
        .all()
    )

    return jsonify({
        "month": month,
        "year": year,
        "total": float(total_mes),
        "by_category": [
            {"categoria": cat, "total": float(total)}
            for cat, total in por_categoria
        ]
    }), 200

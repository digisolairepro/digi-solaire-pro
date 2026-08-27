import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/db";

function versDevis(ligne: any) {
  return {
    id: ligne.id,
    dimensionnementId: ligne.dimensionnement_id,
    statut: ligne.statut,
    dateCreation: ligne.date_creation,
    lignes: ligne.lignes,
  };
}

export async function GET() {
  const resultat = await pool.query(
    "SELECT * FROM devis ORDER BY date_creation DESC"
  );

  return NextResponse.json(resultat.rows.map(versDevis));
}

export async function POST(request: NextRequest) {
  const d = await request.json();

  const resultat = await pool.query(
    "INSERT INTO devis (dimensionnement_id, statut, lignes) VALUES ($1, $2, $3) RETURNING *",
    [d.dimensionnementId, d.statut, JSON.stringify(d.lignes)]
  );

  return NextResponse.json(versDevis(resultat.rows[0]));
}
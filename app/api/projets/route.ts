import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/db";

function versProjet(ligne: any) {
  return {
    id: ligne.id,
    nom: ligne.nom,
    clientId: ligne.client_id,
    dimensionnementId: ligne.dimensionnement_id || "",
    statut: ligne.statut,
    dateCreation: ligne.date_creation,
  };
}

export async function GET() {
  const resultat = await pool.query(
    "SELECT * FROM projets ORDER BY date_creation DESC"
  );

  return NextResponse.json(resultat.rows.map(versProjet));
}

export async function POST(request: NextRequest) {
  const p = await request.json();

  const resultat = await pool.query(
    "INSERT INTO projets (nom, client_id, dimensionnement_id, statut) VALUES ($1, $2, $3, $4) RETURNING *",
    [p.nom, p.clientId, p.dimensionnementId || null, p.statut]
  );

  return NextResponse.json(versProjet(resultat.rows[0]));
}
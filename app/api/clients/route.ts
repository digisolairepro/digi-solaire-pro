import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/db";
import { getUtilisateurIdConnecte } from "../../../lib/auth";

export async function GET() {
  const utilisateurId = await getUtilisateurIdConnecte();

  if (!utilisateurId) {
    return NextResponse.json({ erreur: "Non authentifié." }, { status: 401 });
  }

  const resultat = await pool.query(
    "SELECT id, nom, telephone, ville FROM clients WHERE utilisateur_id = $1 ORDER BY date_creation DESC",
    [utilisateurId]
  );

  return NextResponse.json(resultat.rows);
}

export async function POST(request: NextRequest) {
  const utilisateurId = await getUtilisateurIdConnecte();

  if (!utilisateurId) {
    return NextResponse.json({ erreur: "Non authentifié." }, { status: 401 });
  }

  const corps = await request.json();
  const { nom, telephone, ville } = corps;

  const resultat = await pool.query(
    "INSERT INTO clients (nom, telephone, ville, utilisateur_id) VALUES ($1, $2, $3, $4) RETURNING id, nom, telephone, ville",
    [nom, telephone, ville, utilisateurId]
  );

  return NextResponse.json(resultat.rows[0]);
}
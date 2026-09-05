import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/db";
import { getUtilisateurIdConnecte } from "../../../lib/auth";

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
  const utilisateurId = await getUtilisateurIdConnecte();

  if (!utilisateurId) {
    return NextResponse.json({ erreur: "Non authentifié." }, { status: 401 });
  }

  const resultat = await pool.query(
    "SELECT * FROM devis WHERE utilisateur_id = $1 ORDER BY date_creation DESC",
    [utilisateurId]
  );

  return NextResponse.json(resultat.rows.map(versDevis));
}

export async function POST(request: NextRequest) {
  const utilisateurId = await getUtilisateurIdConnecte();

  if (!utilisateurId) {
    return NextResponse.json({ erreur: "Non authentifié." }, { status: 401 });
  }

  const d = await request.json();

  const resultat = await pool.query(
    "INSERT INTO devis (dimensionnement_id, statut, lignes, utilisateur_id) VALUES ($1, $2, $3, $4) RETURNING *",
    [d.dimensionnementId, d.statut, JSON.stringify(d.lignes), utilisateurId]
  );

  return NextResponse.json(versDevis(resultat.rows[0]));
}
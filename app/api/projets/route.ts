import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/db";
import { getUtilisateurIdConnecte } from "../../../lib/auth";

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
  const utilisateurId = await getUtilisateurIdConnecte();

  if (!utilisateurId) {
    return NextResponse.json({ erreur: "Non authentifié." }, { status: 401 });
  }

  const resultat = await pool.query(
    "SELECT * FROM projets WHERE utilisateur_id = $1 ORDER BY date_creation DESC",
    [utilisateurId]
  );

  return NextResponse.json(resultat.rows.map(versProjet));
}

export async function POST(request: NextRequest) {
  const utilisateurId = await getUtilisateurIdConnecte();

  if (!utilisateurId) {
    return NextResponse.json({ erreur: "Non authentifié." }, { status: 401 });
  }

  const p = await request.json();

  const resultat = await pool.query(
    "INSERT INTO projets (nom, client_id, dimensionnement_id, statut, utilisateur_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [p.nom, p.clientId, p.dimensionnementId || null, p.statut, utilisateurId]
  );

  return NextResponse.json(versProjet(resultat.rows[0]));
}
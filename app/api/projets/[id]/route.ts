import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../lib/db";
import { getUtilisateurIdConnecte } from "../../../../lib/auth";

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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const utilisateurId = await getUtilisateurIdConnecte();

  if (!utilisateurId) {
    return NextResponse.json({ erreur: "Non authentifié." }, { status: 401 });
  }

  const { id } = await params;
  const p = await request.json();

  const resultat = await pool.query(
    "UPDATE projets SET nom = $1, client_id = $2, dimensionnement_id = $3, statut = $4 WHERE id = $5 AND utilisateur_id = $6 RETURNING *",
    [p.nom, p.clientId, p.dimensionnementId || null, p.statut, id, utilisateurId]
  );

  return NextResponse.json(versProjet(resultat.rows[0]));
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const utilisateurId = await getUtilisateurIdConnecte();

  if (!utilisateurId) {
    return NextResponse.json({ erreur: "Non authentifié." }, { status: 401 });
  }

  const { id } = await params;

  await pool.query(
    "DELETE FROM projets WHERE id = $1 AND utilisateur_id = $2",
    [id, utilisateurId]
  );

  return NextResponse.json({ succes: true });
}
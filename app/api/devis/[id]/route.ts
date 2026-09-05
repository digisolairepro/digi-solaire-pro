import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../lib/db";
import { getUtilisateurIdConnecte } from "../../../../lib/auth";

function versDevis(ligne: any) {
  return {
    id: ligne.id,
    dimensionnementId: ligne.dimensionnement_id,
    statut: ligne.statut,
    dateCreation: ligne.date_creation,
    lignes: ligne.lignes,
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
  const d = await request.json();

  const resultat = await pool.query(
    "UPDATE devis SET dimensionnement_id = $1, statut = $2, lignes = $3 WHERE id = $4 AND utilisateur_id = $5 RETURNING *",
    [d.dimensionnementId, d.statut, JSON.stringify(d.lignes), id, utilisateurId]
  );

  return NextResponse.json(versDevis(resultat.rows[0]));
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
    "DELETE FROM devis WHERE id = $1 AND utilisateur_id = $2",
    [id, utilisateurId]
  );

  return NextResponse.json({ succes: true });
}
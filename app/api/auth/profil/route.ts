import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../lib/db";
import { getUtilisateurIdConnecte } from "../../../../lib/auth";

export async function PUT(request: NextRequest) {
  const utilisateurId = await getUtilisateurIdConnecte();

  if (!utilisateurId) {
    return NextResponse.json({ erreur: "Non authentifié." }, { status: 401 });
  }

  const { nomEntreprise, telephone, adresse, nineaRccm } = await request.json();

  if (!nomEntreprise) {
    return NextResponse.json(
      { erreur: "Le nom de l'entreprise est obligatoire." },
      { status: 400 }
    );
  }

  await pool.query(
    "UPDATE utilisateurs SET nom_entreprise = $1, telephone = $2, adresse = $3, ninea_rccm = $4 WHERE id = $5",
    [nomEntreprise, telephone, adresse, nineaRccm, utilisateurId]
  );

  return NextResponse.json({ succes: true });
}
import { NextResponse } from "next/server";
import pool from "../../../../lib/db";
import { getUtilisateurIdConnecte } from "../../../../lib/auth";

export async function GET() {
  const utilisateurId = await getUtilisateurIdConnecte();

  if (!utilisateurId) {
    return NextResponse.json({ connecte: false });
  }

  const resultat = await pool.query(
    "SELECT id, email, nom_entreprise, statut_abonnement FROM utilisateurs WHERE id = $1",
    [utilisateurId]
  );

  if (resultat.rows.length === 0) {
    return NextResponse.json({ connecte: false });
  }

  const u = resultat.rows[0];

  return NextResponse.json({
    connecte: true,
    id: u.id,
    email: u.email,
    nomEntreprise: u.nom_entreprise,
    statutAbonnement: u.statut_abonnement,
  });
}
import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../lib/db";
import { hacherMotDePasse, creerJeton } from "../../../../lib/auth";

export async function POST(request: NextRequest) {
  const { email, motDePasse, nomEntreprise } = await request.json();

  if (!email || !motDePasse || !nomEntreprise) {
    return NextResponse.json(
      { erreur: "Tous les champs sont obligatoires." },
      { status: 400 }
    );
  }

  const utilisateurExistant = await pool.query(
    "SELECT id FROM utilisateurs WHERE email = $1",
    [email]
  );

  if (utilisateurExistant.rows.length > 0) {
    return NextResponse.json(
      { erreur: "Un compte existe déjà avec cet email." },
      { status: 409 }
    );
  }

  const motDePasseHash = await hacherMotDePasse(motDePasse);

  const resultat = await pool.query(
    "INSERT INTO utilisateurs (email, mot_de_passe_hash, nom_entreprise) VALUES ($1, $2, $3) RETURNING id",
    [email, motDePasseHash, nomEntreprise]
  );

  const nouvelUtilisateurId = resultat.rows[0].id;
  const jeton = creerJeton(nouvelUtilisateurId);

  const reponse = NextResponse.json({ succes: true });

  reponse.cookies.set("digisolaire_session", jeton, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return reponse;
}
import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../lib/db";
import { verifierMotDePasse, creerJeton } from "../../../../lib/auth";

export async function POST(request: NextRequest) {
  const { email, motDePasse } = await request.json();

  if (!email || !motDePasse) {
    return NextResponse.json(
      { erreur: "Email et mot de passe requis." },
      { status: 400 }
    );
  }

  const resultat = await pool.query(
    "SELECT id, mot_de_passe_hash FROM utilisateurs WHERE email = $1",
    [email]
  );

  if (resultat.rows.length === 0) {
    return NextResponse.json(
      { erreur: "Email ou mot de passe incorrect." },
      { status: 401 }
    );
  }

  const utilisateur = resultat.rows[0];
  const motDePasseValide = await verifierMotDePasse(
    motDePasse,
    utilisateur.mot_de_passe_hash
  );

  if (!motDePasseValide) {
    return NextResponse.json(
      { erreur: "Email ou mot de passe incorrect." },
      { status: 401 }
    );
  }

  const jeton = creerJeton(utilisateur.id);

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
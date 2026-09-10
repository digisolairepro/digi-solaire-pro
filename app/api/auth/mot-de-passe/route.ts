import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../lib/db";
import {
  getUtilisateurIdConnecte,
  verifierMotDePasse,
  hacherMotDePasse,
} from "../../../../lib/auth";

export async function PUT(request: NextRequest) {
  const utilisateurId = await getUtilisateurIdConnecte();

  if (!utilisateurId) {
    return NextResponse.json({ erreur: "Non authentifié." }, { status: 401 });
  }

  const { ancienMotDePasse, nouveauMotDePasse } = await request.json();

  if (!ancienMotDePasse || !nouveauMotDePasse) {
    return NextResponse.json(
      { erreur: "Tous les champs sont obligatoires." },
      { status: 400 }
    );
  }

  if (nouveauMotDePasse.length < 6) {
    return NextResponse.json(
      { erreur: "Le nouveau mot de passe doit contenir au moins 6 caractères." },
      { status: 400 }
    );
  }

  const resultat = await pool.query(
    "SELECT mot_de_passe_hash FROM utilisateurs WHERE id = $1",
    [utilisateurId]
  );

  const motDePasseValide = await verifierMotDePasse(
    ancienMotDePasse,
    resultat.rows[0].mot_de_passe_hash
  );

  if (!motDePasseValide) {
    return NextResponse.json(
      { erreur: "L'ancien mot de passe est incorrect." },
      { status: 401 }
    );
  }

  const nouveauHash = await hacherMotDePasse(nouveauMotDePasse);

  await pool.query(
    "UPDATE utilisateurs SET mot_de_passe_hash = $1 WHERE id = $2",
    [nouveauHash, utilisateurId]
  );

  return NextResponse.json({ succes: true });
}
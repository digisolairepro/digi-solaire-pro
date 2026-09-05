import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function hacherMotDePasse(motDePasse: string) {
  return bcrypt.hash(motDePasse, 10);
}

export async function verifierMotDePasse(motDePasse: string, hash: string) {
  return bcrypt.compare(motDePasse, hash);
}

export function creerJeton(utilisateurId: string) {
  return jwt.sign({ utilisateurId }, JWT_SECRET, { expiresIn: "30d" });
}

export function verifierJeton(jeton: string): { utilisateurId: string } | null {
  try {
    return jwt.verify(jeton, JWT_SECRET) as { utilisateurId: string };
  } catch {
    return null;
  }
}

export async function getUtilisateurIdConnecte(): Promise<string | null> {
  const cookieStore = await cookies();
  const jeton = cookieStore.get("digisolaire_session")?.value;

  if (!jeton) {
    return null;
  }

  const donnees = verifierJeton(jeton);
  return donnees ? donnees.utilisateurId : null;
}
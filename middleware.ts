import { NextRequest, NextResponse } from "next/server";

const CHEMINS_PROTEGES = [
  "/tableau-de-bord",
  "/clients",
  "/projets",
  "/dimensionnement",
  "/dimensionnements",
  "/devis",
  "/parametres",
];

export function middleware(request: NextRequest) {
  const jeton = request.cookies.get("digisolaire_session");

  const cheminActuel = request.nextUrl.pathname;
  const estProtege = CHEMINS_PROTEGES.some((chemin) =>
    cheminActuel.startsWith(chemin)
  );

  if (estProtege && !jeton) {
    return NextResponse.redirect(new URL("/connexion", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/tableau-de-bord/:path*",
    "/clients/:path*",
    "/projets/:path*",
    "/dimensionnement/:path*",
    "/dimensionnements/:path*",
    "/devis/:path*",
    "/parametres/:path*",
  ],
};
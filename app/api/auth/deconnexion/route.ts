import { NextResponse } from "next/server";

export async function POST() {
  const reponse = NextResponse.json({ succes: true });

  reponse.cookies.set("digisolaire_session", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return reponse;
}
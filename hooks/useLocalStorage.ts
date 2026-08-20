"use client";

import { useEffect, useState } from "react";

/**
 * Hook générique pour sauvegarder une donnée dans le localStorage
 * du navigateur, afin qu'elle survive à un rafraîchissement de page.
 *
 * Fonctionne comme useState, mais lit/écrit aussi dans localStorage.
 *
 * Important : la lecture du localStorage se fait uniquement après
 * le premier rendu (dans un useEffect), pour que le rendu serveur
 * et le premier rendu client soient identiques. Cela évite les
 * erreurs d'hydratation React.
 */
export function useLocalStorage<T>(cle: string, valeurInitiale: T) {
  const [valeur, setValeur] = useState<T>(valeurInitiale);
  const [estCharge, setEstCharge] = useState(false);

  // Chargement depuis localStorage au montage du composant
  useEffect(() => {
    try {
      const donneesSauvegardees = window.localStorage.getItem(cle);

      if (donneesSauvegardees !== null) {
        setValeur(JSON.parse(donneesSauvegardees));
      }
    } catch (erreur) {
      console.error(
        `Impossible de lire "${cle}" depuis localStorage :`,
        erreur
      );
    }

    setEstCharge(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cle]);

  // Sauvegarde dans localStorage à chaque changement de valeur
  useEffect(() => {
    if (!estCharge) {
      return;
    }

    try {
      window.localStorage.setItem(cle, JSON.stringify(valeur));
    } catch (erreur) {
      console.error(
        `Impossible d'écrire "${cle}" dans localStorage :`,
        erreur
      );
    }
  }, [cle, valeur, estCharge]);

  return [valeur, setValeur, estCharge] as const;
}
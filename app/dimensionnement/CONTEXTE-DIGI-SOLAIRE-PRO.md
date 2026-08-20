# CONTEXTE — DIGI SOLAIRE PRO

## 1. Présentation du projet

Digi Solaire Pro est une plateforme professionnelle destinée aux professionnels et techniciens du solaire.

L'objectif est de faciliter :
- la gestion des clients ;
- la gestion des projets solaires ;
- le dimensionnement des installations photovoltaïques ;
- la création de devis ;
- le suivi des projets.

Le projet doit progressivement devenir un véritable outil professionnel de travail.

---

## 2. Technologies utilisées

- Next.js
- TypeScript
- React
- Tailwind CSS
- Node.js
- Git / GitHub

Le projet est développé localement sur un MacBook.

---

## 3. Projet actuel

Nom du projet :

Digi Solaire Pro

Nom du dossier :

digi-solaire-pro

Framework :

Next.js

---

## 4. Architecture actuelle

Le projet contient notamment :

- app/
- components/
- public/
- package.json
- next.config.ts
- tsconfig.json
- postcss.config.mjs

---

## 5. Interface actuelle

L'application possède actuellement une interface de type tableau de bord.

Les principales sections prévues sont :

- Tableau de bord
- Clients
- Projets
- Dimensionnement
- Devis
- Paramètres

---

## 6. Composants déjà créés

### Header

Fichier :

components/Header.tsx

Le Header contient notamment :

- le nom Digi Solaire Pro ;
- une présentation de la plateforme ;
- le profil utilisateur.

### Sidebar

Fichier :

components/Sidebar.tsx

La Sidebar contient la navigation principale :

- Tableau de bord
- Clients
- Projets
- Dimensionnement
- Devis
- Paramètres

---

## 7. Tableau de bord

Le tableau de bord doit permettre d'avoir une vision rapide de l'activité.

Les informations prévues comprennent notamment :

- nombre de clients ;
- nombre de projets ;
- nombre de dimensionnements ;
- nombre de devis.

---

## 8. Gestion des clients

Une section "Clients" doit permettre de :

- créer un client ;
- consulter les clients ;
- modifier les informations d'un client ;
- supprimer un client ;
- consulter les projets associés à un client.

---

## 9. Gestion des projets

Une section "Projets" doit permettre de gérer les différents projets solaires des clients.

Un projet pourra notamment être associé à :

- un client ;
- un type d'installation ;
- une consommation ;
- un dimensionnement ;
- un devis ;
- un statut.

---

## 10. Module de dimensionnement solaire

Le dimensionnement solaire est une fonctionnalité centrale de Digi Solaire Pro.

L'objectif est de créer progressivement un assistant permettant de déterminer les besoins d'une installation solaire.

Le module devra notamment pouvoir prendre en compte :

- les appareils électriques ;
- leur quantité ;
- leur puissance ;
- leur durée d'utilisation ;
- la consommation quotidienne ;
- la consommation en kWh ;
- les besoins énergétiques ;
- les panneaux solaires ;
- les batteries ;
- l'onduleur ;
- les autres éléments nécessaires au dimensionnement.

---

## 11. Module de devis

Un module de génération de devis est prévu.

Il devra permettre de :

- créer un devis ;
- sélectionner les équipements ;
- calculer les quantités ;
- calculer les prix ;
- obtenir le montant total ;
- associer le devis à un client ;
- associer le devis à un projet.

---

## 12. Base de données

Une base de données sera progressivement mise en place.

Les principales tables envisagées sont :

- clients
- projets
- appareils
- dimensionnements
- équipements
- devis
- utilisateurs

La structure définitive devra être déterminée avant la mise en place complète de la base de données.

---

## 13. Objectif du MVP

La première version professionnelle doit rester simple.

Les fonctionnalités prioritaires sont :

1. Gestion des clients
2. Gestion des projets
3. Assistant de dimensionnement solaire
4. Génération de devis
5. Gestion des informations nécessaires au suivi des clients

Les fonctionnalités secondaires seront développées progressivement.

---

## 14. Règles de développement

Lors du développement :

- privilégier une interface simple et professionnelle ;
- utiliser le français dans l'interface ;
- expliquer les modifications étape par étape ;
- éviter de modifier inutilement plusieurs fichiers à la fois ;
- tester chaque fonctionnalité avant de passer à la suivante ;
- conserver une architecture claire ;
- éviter de complexifier prématurément le projet.

---

## 15. État du projet

Projet actuellement en développement.

Une première interface a été créée avec :

- un tableau de bord ;
- un Header ;
- une Sidebar ;
- les principales sections de navigation.

---

## 16. Dernier problème rencontré

La navigation vers la page "Clients" ne fonctionnait pas correctement lorsque l'utilisateur cliquait sur "Clients" dans la Sidebar.

Ce problème doit être vérifié et corrigé avant de poursuivre le développement des autres fonctionnalités.

---

## 17. Prochaine étape

Priorité immédiate :

Corriger et tester la navigation vers la page Clients.

Ensuite :

1. finaliser la page Clients ;
2. créer la gestion des clients ;
3. créer la page Projets ;
4. préparer la structure du module Dimensionnement ;
5. préparer la base de données ;
6. développer progressivement le système de devis.

---

## 18. Principe important

Digi Solaire Pro doit être développé progressivement.

Il ne faut pas chercher à construire toutes les fonctionnalités en même temps.

Chaque module doit être :

- conçu ;
- développé ;
- testé ;
- corrigé ;
- puis validé avant de passer au suivant.

---

## 19. Historique de développement

Le projet a été créé avec Next.js.

Le serveur de développement fonctionne localement avec :

npm run dev

Le projet est actuellement destiné à être développé et testé localement avant son déploiement.

---

## 20. Note pour une nouvelle session ChatGPT

Si ce fichier est fourni à un nouveau compte ChatGPT, celui-ci doit considérer ce document comme le contexte de référence du projet Digi Solaire Pro.

Il doit d'abord analyser l'état réel du code fourni avant de proposer des modifications.

Il ne doit pas reconstruire le projet depuis zéro.

Il doit continuer le développement à partir de l'état existant.
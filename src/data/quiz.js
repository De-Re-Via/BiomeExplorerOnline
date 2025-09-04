// src/data/quiz.js
// 10 questions "quiz" à choix avec effets mesurés sur les 6 axes.
// NB: les effets sont intentionnellement modestes pour garder l'équilibre.

export default [
  {
    title: 'Quiz — Rénovation énergétique',
    description: 'Quelle action réduit le plus durablement la conso d’énergie dans le bâti ?',
    choices: [
      { label: 'Isoler les bâtiments (murs/toitures)', effect: { energy: +5, resilience: +2 } },
      { label: 'Remplacer toutes les lampes par LED', effect: { energy: +2 } },
      { label: 'Installer des compteurs “intelligents” sans travaux', effect: { energy: +1, tech: +1 } },
    ],
  },
  {
    title: 'Quiz — Mobilité',
    description: 'Pour diminuer émissions et congestion à l’échelle d’une ville, le levier le plus structurant est :',
    choices: [
      { label: 'Investir dans les transports collectifs + rabattement vélo/marche', effect: { energy: +3, social: +2, resilience: +2 } },
      { label: 'Construire de nouvelles voies routières', effect: { energy: -2, biodiv: -2 } },
      { label: 'Subventionner uniquement les voitures électriques', effect: { energy: +2, tech: +2, biodiv: -1 } },
    ],
  },
  {
    title: 'Quiz — Agricultures',
    description: 'Quelle pratique concilie le mieux rendement et biodiversité à moyen terme ?',
    choices: [
      { label: 'Agroécologie (rotations, couverts, haies)', effect: { food: +3, biodiv: +3, resilience: +2 } },
      { label: 'Intensification via engrais/produits de synthèse', effect: { food: +3, energy: -2, biodiv: -3 } },
      { label: 'Irrigation massive sans pilotage', effect: { food: +2, resilience: -3, energy: -2 } },
    ],
  },
  {
    title: 'Quiz — Zones humides',
    description: 'La restauration de zones humides a principalement pour effet :',
    choices: [
      { label: 'Augmenter biodiversité et stockage d’eau', effect: { biodiv: +5, resilience: +3 } },
      { label: 'Réduire la production agricole à long terme', effect: { food: -1 } },
      { label: 'Augmenter l’érosion des berges', effect: { resilience: -2 } },
    ],
  },
  {
    title: 'Quiz — Chauffage',
    description: 'Quel choix abaisse le plus les émissions unitaires pour le chauffage domestique (mix électrique décarboné) ?',
    choices: [
      { label: 'Pompe à chaleur performante', effect: { energy: +4, tech: +2, resilience: +1 } },
      { label: 'Chaudière gaz récente', effect: { energy: +1 } },
      { label: 'Biomasse sans filtration fine', effect: { energy: +2, biodiv: -1 } },
    ],
  },
  {
    title: 'Quiz — Électricité & réseau',
    description: 'Pour intégrer + d’énergies variables (solaire/éolien), la priorité c’est :',
    choices: [
      { label: 'Stockage + pilotage de la demande', effect: { energy: +3, resilience: +3, tech: +2 } },
      { label: 'Augmenter la réserve thermique fossile', effect: { energy: +1, resilience: +1, biodiv: -1 } },
      { label: 'Ajouter des microcentrales isolées sans réseau', effect: { resilience: -1 } },
    ],
  },
  {
    title: 'Quiz — Villes & chaleur',
    description: 'Quel aménagement réduit le plus l’îlot de chaleur urbain ?',
    choices: [
      { label: 'Végétalisation/arbres + sols perméables', effect: { biodiv: +3, resilience: +3, social: +1 } },
      { label: 'Climatisation partout', effect: { energy: -3, social: +1 } },
      { label: 'Peinture foncée des toitures', effect: { resilience: -1 } },
    ],
  },
  {
    title: 'Quiz — Déchets alimentaires',
    description: 'Quel levier réduit le plus l’empreinte “alimentation” à court terme ?',
    choices: [
      { label: 'Réduction du gaspillage (logistique + foyers)', effect: { food: +4, energy: +1, social: +1 } },
      { label: 'Interdire la restauration collective', effect: { social: -2 } },
      { label: 'Planter uniquement des cultures exotiques', effect: { resilience: -2 } },
    ],
  },
  {
    title: 'Quiz — Forêt',
    description: 'Pour stocker du carbone ET préserver les services écosystémiques :',
    choices: [
      { label: 'Gestion durable + mélange d’essences + âges variés', effect: { biodiv: +3, resilience: +3 } },
      { label: 'Monoculture à rotation rapide', effect: { food: +1, biodiv: -3, resilience: -2 } },
      { label: 'Abandon total sans surveillance du risque feu', effect: { biodiv: +1, resilience: -2 } },
    ],
  },
  {
    title: 'Quiz — Numérique',
    description: 'Mesure utile pour limiter l’empreinte énergétique des data centers :',
    choices: [
      { label: 'Refroidissement efficient + réutilisation de chaleur', effect: { energy: +3, tech: +2, resilience: +1 } },
      { label: 'Multiplier les sauvegardes redondantes inutiles', effect: { energy: -2 } },
      { label: 'Aucune mesure — coût marginal faible', effect: { energy: -1 } },
    ],
  },
];

// src/data/dilemme.js
// 10 dilemmes avec arbitrages clairs (gains/pertes par axe).

export default [
  {
    title: 'Dilemme — Forêt ou panneaux ?',
    description: 'Convertir une lisière forestière en ferme solaire.',
    choices: [
      { label: 'Installer la ferme', effect: { energy: +5, biodiv: -4 } },
      { label: 'Préserver la forêt', effect: { biodiv: +3, resilience: +1 } },
    ],
  },
  {
    title: 'Dilemme — Barrage & continuité',
    description: 'Un petit barrage améliorerait la réserve d’eau mais coupe la migration des poissons.',
    choices: [
      { label: 'Construire + passes à poissons', effect: { resilience: +3, tech: +1, biodiv: -1 } },
      { label: 'Renoncer, restaurer la rivière', effect: { biodiv: +3, resilience: +1 } },
    ],
  },
  {
    title: 'Dilemme — Aéroport ou TGV',
    description: 'Élargir l’aéroport régional ou renforcer l’offre ferroviaire ?',
    choices: [
      { label: 'Extension aéroport', effect: { social: +1, tech: +1, energy: -3, biodiv: -2 } },
      { label: 'Priorité TGV/rail', effect: { energy: +2, social: +1, resilience: +1 } },
    ],
  },
  {
    title: 'Dilemme — Métaux critiques',
    description: 'Autoriser une mine (métaux pour énergies propres) dans une zone sensible.',
    choices: [
      { label: 'Autoriser avec normes strictes', effect: { tech: +3, energy: +1, biodiv: -3 } },
      { label: 'Refuser et importer', effect: { tech: +1, resilience: -1 } },
    ],
  },
  {
    title: 'Dilemme — Recul stratégique',
    description: 'Face à la montée des eaux, construire une digue ou planifier un repli organisé ?',
    choices: [
      { label: 'Digue & pompes', effect: { resilience: +2, energy: -2, tech: +1 } },
      { label: 'Recul planifié', effect: { resilience: +3, social: +1 } },
    ],
  },
  {
    title: 'Dilemme — Agrocarburants',
    description: 'Cultures dédiées aux biocarburants vs cultures alimentaires.',
    choices: [
      { label: 'Favoriser les biocarburants', effect: { energy: +2, food: -2, biodiv: -2 } },
      { label: 'Prioriser l’alimentaire', effect: { food: +2, resilience: +1 } },
    ],
  },
  {
    title: 'Dilemme — Éolien en mer',
    description: 'Parc offshore à haut potentiel mais couloir migratoire d’oiseaux.',
    choices: [
      { label: 'Implanter avec bridage saisonnier', effect: { energy: +4, tech: +1, biodiv: -1 } },
      { label: 'Déplacer le projet (coût/retard)', effect: { biodiv: +2, energy: -1, tech: -1 } },
    ],
  },
  {
    title: 'Dilemme — Densifier ou étendre',
    description: 'Ville compacte vs étalement pavillonnaire.',
    choices: [
      { label: 'Densifier avec espaces verts', effect: { energy: +2, social: +1, biodiv: +1 } },
      { label: 'Étendre en périphérie', effect: { social: +1, energy: -2, biodiv: -2, resilience: -1 } },
    ],
  },
  {
    title: 'Dilemme — Data center',
    description: 'Accueillir un data center (emplois) mais forte consommation d’eau/énergie.',
    choices: [
      { label: 'Accepter avec récupération de chaleur & eau', effect: { tech: +3, energy: +1, resilience: +1 } },
      { label: 'Refuser / délocaliser', effect: { resilience: +1 } },
    ],
  },
  {
    title: 'Dilemme — Pâturage vs réensauvagement',
    description: 'Libérer des parcelles pour corridors écologiques ou maintenir pâturage extensif.',
    choices: [
      { label: 'Créer un corridor', effect: { biodiv: +3, resilience: +2, food: -1 } },
      { label: 'Maintenir le pâturage', effect: { food: +2, biodiv: +1 } },
    ],
  },
];

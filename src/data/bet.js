// src/data/bet.js
// 10 situations de pari : option risquée (gain plus fort mais fragilité possible)
// vs option prudente (effet moindre mais stable).

export default [
  {
    title: 'Pari — Pluie attendue',
    description: 'Miser sur une pluie proche qui sauverait les cultures ?',
    choices: [
      { label: 'Oui, on mise', effect: { food: +3, resilience: +1, tech: -1 } },
      { label: 'Non, on sécurise l’irrigation minimale', effect: { food: +1, energy: -1, resilience: +1 } },
    ],
  },
  {
    title: 'Pari — Prix du blé',
    description: 'Vendre tout de suite ou attendre une hausse possible ?',
    choices: [
      { label: 'Attendre (risque de baisse)', effect: { food: +2, resilience: -1 } },
      { label: 'Vendre maintenant (prix correct)', effect: { food: +1 } },
    ],
  },
  {
    title: 'Pari — Pic de vent',
    description: 'Reporter la maintenance éolienne pour capter un pic de production météo ?',
    choices: [
      { label: 'On reporte (machine plus sollicitée)', effect: { energy: +3, resilience: -1 } },
      { label: 'On maintient le planning', effect: { energy: +1, resilience: +1 } },
    ],
  },
  {
    title: 'Pari — Ravageurs',
    description: 'Traiter préventivement (coût/impact) ou surveiller et intervenir ciblé ?',
    choices: [
      { label: 'Surveillance + intervention ciblée', effect: { biodiv: +2, resilience: +2, food: +1 } },
      { label: 'Traitement large préventif', effect: { food: +2, biodiv: -2 } },
    ],
  },
  {
    title: 'Pari — Innovation pilote',
    description: 'Déployer une techno pilote (stockage local) pas encore éprouvée ?',
    choices: [
      { label: 'Oui (apprentissage rapide)', effect: { tech: +3, resilience: +1, energy: +1 } },
      { label: 'Non (attendre maturité)', effect: { tech: +1 } },
    ],
  },
  {
    title: 'Pari — Tourisme',
    description: 'Ouvrir la réserve naturelle à un éco-tourisme encadré ?',
    choices: [
      { label: 'Oui (recettes + pédagogie)', effect: { social: +2, resilience: +1, biodiv: -1 } },
      { label: 'Non (priorité quiétude)', effect: { biodiv: +1 } },
    ],
  },
  {
    title: 'Pari — Marché carbone',
    description: 'Vendre des crédits d’un projet forestier avant vérification finale ?',
    choices: [
      { label: 'Vendre maintenant', effect: { tech: +1, social: -1 } },
      { label: 'Attendre la vérification', effect: { resilience: +1 } },
    ],
  },
  {
    title: 'Pari — Réutilisation des eaux',
    description: 'Accélérer une unité de réutilisation d’eaux traitées ?',
    choices: [
      { label: 'Lancer vite (apprentissage en live)', effect: { resilience: +2, tech: +2, energy: -1 } },
      { label: 'Pilote limité d’abord', effect: { tech: +1, resilience: +1 } },
    ],
  },
  {
    title: 'Pari — Pâturage précoce',
    description: 'Pâturer plus tôt pour éviter l’achat d’aliments ?',
    choices: [
      { label: 'Oui (risque de tassement/repousse)', effect: { food: +2, biodiv: -1, resilience: -1 } },
      { label: 'Non (préserver la repousse)', effect: { resilience: +1 } },
    ],
  },
  {
    title: 'Pari — Densification urbaine',
    description: 'Autoriser une surélévation rapide avec exigences allégées ?',
    choices: [
      { label: 'Oui (logement vite, risques qualité)', effect: { social: +2, resilience: -1 } },
      { label: 'Non (qualité/efficacité d’abord)', effect: { energy: +1, resilience: +1 } },
    ],
  },
];

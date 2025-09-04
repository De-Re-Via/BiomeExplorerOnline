// src/data/urgency.js
// 10 situations d'urgence. Chaque choix applique des effets rapides et crédibles.

export default [
  {
    title: 'Urgence — Sécheresse',
    description: 'Répartir l’eau vers les zones critiques.',
    choices: [
      { label: 'Priorité agriculture', effect: { food: +4, social: -1, biodiv: -2 } },
      { label: 'Priorité écosystèmes', effect: { biodiv: +4, food: -1, resilience: +1 } },
    ],
  },
  {
    title: 'Urgence — Feux de forêt',
    description: 'Un front se rapproche de zones habitées.',
    choices: [
      { label: 'Évacuer + coupe-feu d’urgence', effect: { resilience: +3, social: -1 } },
      { label: 'Concentrer tous les moyens sur l’extinction', effect: { resilience: +2, biodiv: -1 } },
    ],
  },
  {
    title: 'Urgence — Crue éclair',
    description: 'Rivière en débordement imminent.',
    choices: [
      { label: 'Ouvrir zones d’expansion de crue', effect: { resilience: +3, food: -1 } },
      { label: 'Protéger le centre urbain en priorité', effect: { social: +1, resilience: +2, biodiv: -1 } },
    ],
  },
  {
    title: 'Urgence — Rupture d’approvisionnement électrique',
    description: 'Pic de demande + indisponibilité production.',
    choices: [
      { label: 'Effacement ciblé (industriel/tertiaire)', effect: { energy: +3, tech: +1, social: -1 } },
      { label: 'Groupes diesel temporaires', effect: { energy: +2, biodiv: -1 } },
    ],
  },
  {
    title: 'Urgence — Marée verte',
    description: 'Prolifération d’algues sur la côte.',
    choices: [
      { label: 'Ramassage + filière de valorisation', effect: { resilience: +1, tech: +1 } },
      { label: 'Interdictions temporaires d’accès', effect: { social: -1, resilience: +1 } },
    ],
  },
  {
    title: 'Urgence — Espèce invasive',
    description: 'Propagation rapide d’une espèce envahissante.',
    choices: [
      { label: 'Arrachage ciblé + quarantaine', effect: { biodiv: +3, social: -1 } },
      { label: 'Laisser faire (risque système)', effect: { biodiv: -3, resilience: -2 } },
    ],
  },
  {
    title: 'Urgence — Pollution accidentelle',
    description: 'Déversement chimique près d’un cours d’eau.',
    choices: [
      { label: 'Barrages flottants + pompage', effect: { resilience: +2, tech: +1 } },
      { label: 'Dilution naturelle (attendre)', effect: { biodiv: -3 } },
    ],
  },
  {
    title: 'Urgence — Canicule urbaine',
    description: 'Vigilance chaleur, population fragile exposée.',
    choices: [
      { label: 'Ouvrir des îlots fraîcheur + visites', effect: { social: +3, energy: -1, resilience: +1 } },
      { label: 'Communication minimale uniquement', effect: { social: -1 } },
    ],
  },
  {
    title: 'Urgence — Effondrement des pollinisateurs',
    description: 'Baisse brutale d’abeilles & auxiliaires.',
    choices: [
      { label: 'Arrêt temporaire des pesticides + bandes fleuries', effect: { biodiv: +4, food: +1 } },
      { label: 'Substituer par pollinisation manuelle', effect: { tech: +1, food: +1, social: -1 } },
    ],
  },
  {
    title: 'Urgence — Rupture d’eau potable',
    description: 'Réservoir principal hors service.',
    choices: [
      { label: 'Citerne mobile + priorisation hôpitaux', effect: { social: +2, resilience: +1, energy: -1 } },
      { label: 'Rationnement général sans priorités', effect: { social: -2, resilience: +1 } },
    ],
  },
];

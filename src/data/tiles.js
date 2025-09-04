// src/data/tiles.js
// IMPORTANT : la clé `texture` est le nom du PNG sans extension dans assets/tiles/
const tiles = [
  { id: 'city_center',  label: 'Centre-ville',  texture: 'city_center',  effects:{ energy:-3,biodiv:-5,food:-2,social:+6,resilience:+1,tech:+4 } },
  { id: 'farm',         label: 'Ferme',         texture: 'farm',         effects:{ energy:-1,biodiv:+1,food:+8,social:+1,resilience:+2,tech:0 } },
  { id: 'forest',       label: 'Forêt',         texture: 'forest',       effects:{ energy:-2,biodiv:+8,food:+1,social:+1,resilience:+4,tech:-1 } },
  { id: 'grassland',    label: 'Prairie',       texture: 'grassland',    effects:{ energy:0,biodiv:+3,food:+2,social:0,resilience:+2,tech:0 } },
  { id: 'industrial',   label: 'Industriel',    texture: 'industrial',   effects:{ energy:+6,biodiv:-6,food:-3,social:-2,resilience:-2,tech:+5 } },
  { id: 'lake',         label: 'Lac',           texture: 'lake',         effects:{ energy:0,biodiv:+5,food:+2,social:+1,resilience:+5,tech:0 } },
  { id: 'research_lab', label: 'Lab. recherche',texture: 'research_lab', effects:{ energy:-1,biodiv:-1,food:0,social:+2,resilience:+1,tech:+8 } },
  { id: 'solar_farm',   label: 'Ferme solaire', texture: 'solar_farm',   effects:{ energy:+7,biodiv:-1,food:0,social:+1,resilience:+2,tech:+2 } },
  { id: 'suburb',       label: 'Banlieue',      texture: 'suburb',       effects:{ energy:-2,biodiv:-3,food:-1,social:+4,resilience:0,tech:+1 } },
  { id: 'wetland',      label: 'Zone humide',   texture: 'wetland',      effects:{ energy:-1,biodiv:+7,food:+1,social:0,resilience:+6,tech:-1 } },
];

export default tiles;

export const tutorialLevel = (offset: number) => [
  {
    type: "platform-section",
    position: [0, offset + 6, 0],
    scale: [15, 0.3, 1],
    rotation: [0, 0, 0, "XYZ"],
    oneWay: true,
  },
  {
    type: "coin",
    position: [-2, offset + 10, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0, "XYZ"],
  },
  {
    type: "coin",
    position: [0, offset + 10, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0, "XYZ"],
  },
  {
    type: "coin",
    position: [2, offset + 10, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0, "XYZ"],
  },
  {
    type: "platform-section",
    position: [0, offset + 16, 0],
    scale: [15, 0.3, 1],
    rotation: [0, 0, 0, "XYZ"],
    oneWay: true,
  },
  {
    type: "platform",
    position: [-5, offset + 20, 0],
    scale: [5, 1, 1],
    rotation: [0, 0, 0, "XYZ"],
  },
  {
    type: "coin",
    position: [-2, offset + 23, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0, "XYZ"],
  },
  {
    type: "coin",
    position: [2, offset + 24, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0, "XYZ"],
  },
  {
    type: "platform",
    position: [5, offset + 25, 0],
    scale: [5, 1, 1],
    rotation: [0, 0, 0, "XYZ"],
  },
];

export const testRoom = (offset: number) => [
  {
    type: "platform-section",
    position: [0, offset + 6, 0],
    scale: [15, 0.3, 1],
    rotation: [0, 0, 0, "XYZ"],
    oneWay: true,
  },
  {
    position: [0, offset + 8, 0],
    type: "checkpoint",
    rotation: [0, 0, 0],
  },
  {
    type: "platform",
    position: [-3, offset + 33, 0],
    scale: [10, 1, 1],
    rotation: [0, 0, 0, "XYZ"],
  },
  {
    type: "platform",
    position: [3, offset + 28, 0],
    scale: [10, 1, 1],
    rotation: [0, 0, 0, "XYZ"],
  },
  {
    type: "platform",
    position: [-2.5, offset + 25, 0],
    scale: [1, 7, 1],
    rotation: [0, 0, 0, "XYZ"],
  },
  {
    position: [2.5, offset + 21, 0],
    scale: [1, 7, 1],
    type: "platform",
    rotation: [0, 0, 0],
  },
  {
    type: "platform",
    position: [2.4884993498917396, offset + 21, 0],
    scale: [1, 7, 1],
    rotation: [0, 0, 0, "XYZ"],
  },
  {
    type: "platform",
    position: [-3, offset + 18, 0],
    rotation: [0, 0, 0, "XYZ"],
    scale: [10, 1, 1],
  },
  {
    position: [-8, offset + 17, 0],
    scale: [1, 8, 1],
    type: "platform",
    rotation: [0, 0, 0],
  },
  {
    position: [8, 17, offset + 0],
    scale: [1, 8, 1],
    type: "platform",
    rotation: [0, 0, 0],
  },
  { position: [0, offset + 8, 0], type: "checkpoint", rotation: [0, 0, 0] },

  {
    position: [-8, offset + 36, 0],
    scale: [1, 8, 1],
    type: "platform",
    rotation: [0, 0, 0],
  },
  {
    position: [8, offset + 36, 0],
    scale: [1, 8, 1],
    type: "platform",
    rotation: [0, 0, 0],
  },
  {
    position: [0, offset + 40, 0],
    scale: [17, 1, 1],
    type: "platform",
    rotation: [0, 0, 0],
  },
  {
    type: "coin",
    position: [0, offset + 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  },
  {
    type: "coin",
    position: [0, offset + 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  },
  {
    type: "coin",
    position: [6.334105553800386, offset + 19.140670646376403, 0],
    rotation: [0, 0, 0, "XYZ"],
    scale: [1, 1, 1],
  },
  {
    type: "coin",
    position: [4.17174065792153, offset + 21.960711111259585, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0, "XYZ"],
  },
  {
    type: "coin",
    position: [6.4347520483937775, offset + 25.54424328312247, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0, "XYZ"],
  },
  {
    type: "coin",
    position: [1.0689853205850133, offset + 23.421620020742772, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0, "XYZ"],
  },
  {
    type: "coin",
    position: [1.0689853205850133, offset + 22.108369050358075, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0, "XYZ"],
  },
  {
    type: "coin",
    position: [1.0689853205850133, offset + 20.671369741516656, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0, "XYZ"],
  },
  {
    type: "coin",
    position: [-6.318758175010058, offset + 21.84891757312375, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0, "XYZ"],
  },
  {
    type: "coin",
    position: [-4.113008766175543, offset + 24.489604458533442, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0, "XYZ"],
  },
  {
    type: "coin",
    position: [-6.2429905891925594, offset + 26.90709051970327, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0, "XYZ"],
  },
  {
    type: "spiked-platform",
    position: [3.657565943595525, offset + 18.610904698125662, 0],
    rotation: [0, 0, 0, "XYZ"],
    scale: [1, 1, 1],
  },
  {
    type: "spiked-platform",
    position: [6.930039498793494, offset + 21.87964422088976, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
  },
  {
    type: "spiked-platform",
    position: [-1.4543244583749235, offset + 24.227214177141313, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0, "XYZ"],
  },
  {
    type: "spiked-platform",
    position: [-3.483852260802357, offset + 22.331462145388244, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0, "XYZ"],
  },
  {
    type: "spiked-platform",
    position: [-7.022253864986498, offset + 24.317642701735515, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0, "XYZ"],
  },
  {
    type: "spiked-platform",
    position: [-3.692146330917902, offset + 31.826457227779127, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0, "XYZ"],
  },
];

export const endLevel = (offset: number) => [
  {
    type: "square-platform",
    position: [0, offset + 8, 0],
    rotation: [0, 0, 0, "XYZ"],
    scale: [4, 4, 1],
  },
  {
    type: "trophy",
    position: [0, offset + 11, 0],
    scale: [2, 2, 1],
  },
];

export const firstLevel = (offset: number) => [
  {
    type: "spiked-platform",
    position: [0, offset + 3.75, 0],
    scale: [1, 1, 1],
    orientation: "up",
  },
  { position: [3, offset + 42, 0], scale: [1, 4, 1], type: "platform" },
  { position: [-3, offset + 46, 0], scale: [1, 4, 1], type: "platform" },
  { position: [3, offset + 50, 0], scale: [1, 4, 1], type: "platform" },
  {
    type: "spiked-platform",
    position: [7, offset + 15, 0],
    scale: [1, 1, 1],
    orientation: "left",
  },

  {
    type: "spiked-platform",
    position: [0, offset + 28, 0],
    scale: [1, 1, 1],
    orientation: "down",
  },
  {
    type: "snake",
    position: [-3.891601556343022, offset + 8.893988830074525, 0],
    rotation: [0, 0, 0, "XYZ"],
    scale: [4, 3, 1],
  },
  {
    type: "snake",
    position: [4.119998203503693, offset + 8.893988830074525, 0],
    scale: [4, 3, 1],
    rotation: [0, 0, 0, "XYZ"],
  },
  {
    type: "coin",
    position: [-0.02221057895379186, offset + 6.497300460656101, 0],
    rotation: [0, 0, 0, "XYZ"],
    scale: [1, 1, 1],
  },
  {
    type: "coin",
    position: [4.559074388601773, offset + 13.685183026470849, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0, "XYZ"],
  },
  {
    type: "coin",
    position: [4.559074388601773, offset + 17.74111719010204, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0, "XYZ"],
  },
  {
    type: "coin",
    position: [-0.02221057895379186, offset + 10.353211028853721, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0, "XYZ"],
  },
  {
    type: "coin",
    position: [-0.08390797218855028, offset + 21.849417803831358, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0, "XYZ"],
  },
  {
    type: "coin",
    position: [-2.0659296234159097, offset + 29.710784076978296, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0, "XYZ"],
  },
  {
    type: "coin",
    position: [1.8419104059598934, offset + 26.14319634068337, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0, "XYZ"],
  },
  {
    type: "vertical-platform",
    position: [-3.452178695683413, offset + 27.65106647242851, 0],
    rotation: [0, 0, 0, "XYZ"],
    scale: [1, 6, 1],
  },
  {
    type: "vertical-platform",
    position: [3.0779681057399877, offset + 27.65106647242851, 0],
    scale: [1, 6, 1],
    rotation: [0, 0, 0, "XYZ"],
  },
  {
    type: "square-platform",
    position: [-0.06645426104332186, offset + 15.276031419509122, 0],
    rotation: [0, 0, 0, "XYZ"],
    scale: [4, 4, 1],
  },
  {
    type: "coin",
    position: [-0.02221057895379186, offset + 8.45565694418315, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0, "XYZ"],
  },
  {
    type: "coin",
    position: [4.559074388601773, offset + 15.699383745062503, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0, "XYZ"],
  },
  { type: "enemy", position: [3.33, offset + 36.7, 0], scale: [1, 1, 1] },
  {
    type: "platform-section",
    position: [0, offset + 35.877653185562046, 0],
    scale: [15, 0.3, 1],
    rotation: [0, 0, 0, "XYZ"],
    oneWay: true,
  },
  {
    type: "platform-section",
    position: [0, offset + 19.797101295537235, 0],
    scale: [15, 0.3, 1],
    rotation: [0, 0, 0, "XYZ"],
    oneWay: true,
  },
  {
    type: "platform-section",
    position: [0, offset + 55.234174650312546, 0],
    scale: [15, 0.3, 1],
    rotation: [0, 0, 0, "XYZ"],
    oneWay: true,
  },
];

export const levelBlock1 = [
  // always start with platform with bottom platform (we'll spawn at 0, 0, 0)
  {
    position: [0, 0, 0],
    scale: [17, 1, 1],
    type: "platform",
    rotation: [0, 0, 0],
  },
];

export const levels = {
  first: firstLevel,
};

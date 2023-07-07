export const checkpointsTestLevel = [
  {
    position: [-8, -30, 0],
    scale: [1, 200, 1],
    type: "platform",
    rotation: [0, 0, 0],
  },
  {
    position: [8, -30, 0],
    scale: [1, 200, 1],
    type: "platform",
    rotation: [0, 0, 0],
  },
  {
    position: [8, -30, 0],
    scale: [1, 200, 1],
    type: "platform",
    rotation: [0, 0, 0],
  },
  {
    position: [0, -1, 0],
    scale: [17, 1, 1],
    type: "platform",
    rotation: [0, 0, 0],
  },
  {
    type: "platform-section",
    position: [0, 6, 0],
    scale: [15, 0.3, 1],
    rotation: [0, 0, 0, "XYZ"],
    oneWay: true,
  },
  {
    position: [0, 6, 0],
    // scale: [17, 1, 1],
    type: "checkpoint",
    rotation: [0, 0, 0],
  },
  {
    type: "platform-section",
    position: [0, 16, 0],
    scale: [15, 0.3, 1],
    rotation: [0, 0, 0, "XYZ"],
    oneWay: true,
  },
  {
    position: [0, 16, 0],
    // scale: [17, 1, 1],
    type: "checkpoint",
    rotation: [0, 0, 0],
  },
  {
    type: "platform-section",
    position: [0, 16, 0],
    scale: [15, 0.3, 1],
    rotation: [0, 0, 0, "XYZ"],
    oneWay: true,
  },
  {
    position: [0, 16, 0],
    // scale: [17, 1, 1],
    type: "checkpoint",
    rotation: [0, 0, 0],
  },
  {
    position: [0, 30, 0],
    scale: [1, 1, 1],
    type: "spiked-platform",
    orientation: "down",
  },
  {
    position: [0, 24, 0],
    scale: [1, 1, 1],
    type: "spiked-platform",
    orientation: "down",
  },
  {
    type: "platform-section",
    position: [0, 34, 0],
    scale: [15, 0.3, 1],
    rotation: [0, 0, 0, "XYZ"],
    oneWay: true,
  },
  {
    position: [0, 34, 0],
    // scale: [17, 1, 1],
    type: "checkpoint",
    rotation: [0, 0, 0],
  },
];

export const levels = {
  "checkpoint-test": checkpointsTestLevel,
};

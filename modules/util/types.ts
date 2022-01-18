export type Module = {
  default: {
    Start: () => void;
    Stop: () => void;
  };
};

export type Player = {
  world: string;
  armor: number;
  name: string;
  x: number;
  health: number;
  z: number;
  uuid: string;
  yaw: number;
};

export type Town = {
  name: string;
  mayor: string;
  assistants: string[];
  residents: string[];
  pvp: boolean;
  world: string;
  coords: Coords;
};

export type Coords = {
  x: number;
  z: number;
};

export type MarkerIconData = {

  "tooltip_anchor": {
      "z": number,
      "x": number
  },
  "popup": string,
  "size": {
      "z": number,
      "x": number
  },
  "anchor": {
      "z": number,
      "x": number
  },
  "tooltip": string,
  "icon": string,
  "type": "icon",
  "point": {
      "z": number,
      "x": number
  }
}
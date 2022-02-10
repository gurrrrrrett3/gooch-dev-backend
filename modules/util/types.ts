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

export interface Coords {
  x: number;
  z: number;
}

export interface Location extends Coords {
  world: string;
}

export type MarkerIconData = {
  tooltip_anchor: {
    z: number;
    x: number;
  };
  popup: string;
  size: {
    z: number;
    x: number;
  };
  anchor: {
    z: number;
    x: number;
  };
  tooltip: string;
  icon: string;
  type: "icon";
  point: {
    z: number;
    x: number;
  };
};

export interface MCServerStausData {
  debug: {
    animatedmotd: boolean;
    apiversion: number;
    cachetime: number;
    cnameinsrv: boolean;
    ipinsrv: boolean;
    ping: boolean;
    query: boolean;
    querymismatch: boolean;
    srv: boolean;
  };
  hostname: string;
  icon: string;
  ip: string;
  motd: {
    clean: [string, string];
    html: [string, string];
    raw: [string, string];
  };
  online: boolean;
  players: {
    max: number;
    online: number;
  };
  port: number;
  protocol: number;
  software: string;
  version: string;
}

export type GetDataOptions = GetTownDataOptions | GetPlayerDataOptions;

export type GetTownDataOptions = {
  type: "TOWN";
  value: GetDataTownValues;
  name?: string;
  timeFrame?: TimeFrameOptions;
};

export type GetPlayerDataOptions = GetPlayerDataOptionsByName | GetPlayerDataOptionsByUUID;

export type GetPlayerDataOptionsByName = {
  type: "PLAYER";
  dataType: "NAME";
  name: string;
  value: GetDataPlayerValues;
  timeFrame?: TimeFrameOptions;
};

export type GetPlayerDataOptionsByUUID = {
  type: "PLAYER";
  dataType: "UUID";
  uuid: string;
  value: GetDataPlayerValues;
  timeFrame?: TimeFrameOptions;
};

export type GetDataTownValues =
  | "assistantAdd"
  | "assistantRemove"
  | "mayorChange"
  | "memberJoin"
  | "memberLeave"
  | "pvpToggle"
  | "townCreate"
  | "townDelete";

export type TimeFrameOptions = {
  before?: number;
  after?: number;
};

export type GetDataPlayerValues = "playerJoin" | "playerLeave" | "playerTeleport";

export type GetDataError = {
  error: string;
  message: string;
  request: GetDataOptions;
};

export type LoadFileError = {
  error: string;
  message: string;
  request: GetDataPlayerValues | GetDataTownValues | GetPlayerDataOptions | GetTownDataOptions;
};

export type TownRiseReturn = {
  date: number;
  name: string;
  data: Town;
}[];

export type TownFallReturn = {
  date: number;
  name: string;
  data: Town;
}[];

export type PvpToggleReturn = {
  date: number;
  name: string;
  state: boolean;
}[];

export type ResidentJoinReturn = {
  date: number;
  name: string;
  residents: string[];
}[];

export type ResidentLeaveReturn = {
  date: number;
  name: string;
  residents: string[];
}[];

export type MayorChangeReturn = {
  date: number;
  name: string;
  oldMayor: string;
  newMayor: string;
}[];

export type AssistantAddReturn = {
  date: number;
  name: string;
  assistants: string[];
}[];

export type AssistantRemoveReturn = {
  date: number;
  name: string;
  assistants: string[];
}[];

export type PlayerJoinReturn = {
  date: number;
  name: string;
  location: Location;
}[];

export type PlayerLeaveReturn = {
  date: number;
  name: string;
  location: Location;
}[];

export type PlayerTeleportReturn = {
  date: number;
  uuid: string;
  oldPos: Location;
  newPos: Location;
  distance: number;
}[];

export type FileTypes =
  | TownRiseReturn
  | TownFallReturn
  | PvpToggleReturn
  | ResidentJoinReturn
  | ResidentLeaveReturn
  | MayorChangeReturn
  | AssistantAddReturn
  | AssistantRemoveReturn
  | PlayerJoinReturn
  | PlayerLeaveReturn
  | PlayerTeleportReturn;

export interface ActiveLogFile {
  global: ActiveLogGlobalData;
  data: ActiveLogFileData;
}

export interface ActiveLogGlobalData {
  firstDate: number;
  lastDate: number;
  logCount: number;
}

export type ActiveLogFileData = ActiveLogFrameData[];

export interface ActiveLogFrameData {
  date: number;
  serverOnline: boolean;
  playersOnline: number;
  playersMax: number;
}

export interface ActiveLogMapStats {
  total: number;
  worlds: {
    [key: string]: number;
  };
}

export type DeviceStatus = "online" | "offline";
export type Region = "North" | "South" | "East" | "West";

export interface Device {
  id: number;
  name: string;
  region: Region;
  status: DeviceStatus;
  batteryPct: number;
  tempC: number;
  lastSeen: number;
}

export type FeedEventType = "alert" | "info";

export interface FeedEvent {
  id: string;
  type: FeedEventType;
  message: string;
  timestamp: number;
}

export interface Presence {
  North: number;
  South: number;
  East: number;
  West: number;
  ALL: number;
  total: number;
}

export const REGIONS: Region[] = ["North", "South", "East", "West"];

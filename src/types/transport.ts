
export type TransportMode = "bus" | "train";

export interface Stop {
    id: string;
    name: string;
    city: string;
    lines: string[];
    mode: TransportMode;
}


export interface Departure {
    id: string;
    stopId: string;
    line: string;
    destination: string;
    scheduledTime: string;
}

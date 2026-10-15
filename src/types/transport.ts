
export type TransportMode = "bus" | "train";

export interface Stop {
    id: string;
    name: string;
    city: string;
    lines: string[];
    mode: TransportMode;
}

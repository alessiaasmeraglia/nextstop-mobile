
import type { Stop } from "../types/transport";

// Dati demo (non ufficiali)
export const stops: Stop[] = [
    {
        id: "1",
        name: "Trento Stazione FS",
        city: "Trento",
        lines: ["1", "3", "5"],
        mode: "bus",
    },
    {
        id: "2",
        name: "Trento Piazza Dante",
        city: "Trento",
        lines: ["2", "6", "10"],
        mode: "bus",
    },
    {
        id: "3",
        name: "Trento Università",
        city: "Trento",
        lines: ["5", "8"],
        mode: "bus",
    },
    {
        id: "4",
        name: "Rovereto Stazione FS",
        city: "Rovereto",
        lines: ["1", "2", "6"],
        mode: "bus",
    },
    {
        id: "5",
        name: "Rovereto Centro",
        city: "Rovereto",
        lines: ["3", "5"],
        mode: "bus",
    },
    {
        id: "6",
        name: "Trento Santa Chiara",
        city: "Trento",
        lines: ["3", "7"],
        mode: "bus",
    },
];

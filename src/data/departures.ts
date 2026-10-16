
import type { Departure } from "../types/transport";

// Demo data: fictional times and destinations.
export const departures: Departure[] = [
    {
        id: "d1",
        stopId: "1",
        line: "1",
        destination: "Povo",
        scheduledTime: "14:30",
    },
    {
        id: "d2",
        stopId: "1",
        line: "3",
        destination: "Gardolo",
        scheduledTime: "14:42",
    },
    {
        id: "d3",
        stopId: "1",
        line: "5",
        destination: "Ospedale",
        scheduledTime: "14:55",
    },
    {
        id: "d4",
        stopId: "2",
        line: "2",
        destination: "Trento Sud",
        scheduledTime: "15:10",
    },
    {
        id: "d5",
        stopId: "4",
        line: "1",
        destination: "Rovereto Centro",
        scheduledTime: "15:20",
    },
];

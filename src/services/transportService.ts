
import { departures } from "../data/departures";
import { stops } from "../data/stops";

import type {
    Departure,
    Stop,
} from "../types/transport";

export const transportService = {
    getStops(): Stop[] {
        return stops;
    },

    getStopById(id: string): Stop | undefined {
        return stops.find((stop) => stop.id === id);
    },

    searchStops(query: string): Stop[] {
        const normalizedQuery = query.trim().toLowerCase();

        if (!normalizedQuery) {
            return stops;
        }

        return stops.filter(
            (stop) =>
                stop.name.toLowerCase().includes(normalizedQuery) ||
                stop.city.toLowerCase().includes(normalizedQuery) ||
                stop.lines.some((line) =>
                    line.toLowerCase().includes(normalizedQuery)
                )
        );
    },

    getDeparturesByStopId(stopId: string): Departure[] {
        return departures
            .filter((departure) => departure.stopId === stopId)
            .sort((a, b) =>
                a.scheduledTime.localeCompare(b.scheduledTime)
            );
    },
};

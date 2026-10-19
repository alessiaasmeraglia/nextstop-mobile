import gtfsStops from "../data/gtfsStops.json";

import type {
    Departure,
    Stop,
} from "../types/transport";

const stops = gtfsStops as Stop[];

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

        return stops.filter((stop) =>
            stop.name.toLowerCase().includes(normalizedQuery) ||
            stop.city.toLowerCase().includes(normalizedQuery) ||
            stop.lines.some((line) =>
                line.toLowerCase().includes(normalizedQuery)
            )
        );
    },

    // Scheduled GTFS departures will be integrated next.
    getDeparturesByStopId(_stopId: string): Departure[] {
        return [];
    },
};

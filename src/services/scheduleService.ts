import rawGtfsData from "../data/gtfsDepartures.json";

import type { GTFSData } from "../types/gtfs";
import type { Departure } from "../types/transport";

const gtfsData = rawGtfsData as unknown as GTFSData;

const {
    services,
    exceptions,
    departuresByStop,
    feed,
} = gtfsData;

const SECONDS_PER_DAY = 24 * 60 * 60;

// Validate and parse a YYYY-MM-DD date.
function parseDate(date: string): Date {
    const parsed = new Date(`${date}T00:00:00Z`);

    if (
        !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        Number.isNaN(parsed.getTime()) ||
        parsed.toISOString().slice(0, 10) !== date
    ) {
        throw new Error(`Invalid date: ${date}`);
    }

    return parsed;
}

function addDays(date: string, days: number): string {
    const parsed = parseDate(date);
    parsed.setUTCDate(parsed.getUTCDate() + days);

    return parsed.toISOString().slice(0, 10);
}

function toGTFSDate(date: string): string {
    return date.replaceAll("-", "");
}

function isServiceActive(
    serviceId: string,
    date: string
): boolean {
    const dateKey = toGTFSDate(date);

    // The service day must be within the feed period.
    if (
        dateKey < feed.startDate ||
        dateKey > feed.endDate
    ) {
        return false;
    }

    // Explicit exceptions override the weekly calendar.
    const exception = exceptions[dateKey]?.[serviceId];

    if (exception === 1) return true;
    if (exception === 2) return false;

    const service = services[serviceId];

    if (!service) return false;

    if (
        dateKey < service.startDate ||
        dateKey > service.endDate
    ) {
        return false;
    }

    const dayOfWeek = parseDate(date).getUTCDay();

    // JavaScript: Sunday = 0
    // GTFS array: Monday = 0
    const dayIndex = (dayOfWeek + 6) % 7;

    return service.days[dayIndex] ?? false;
}

function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    return `${String(hours).padStart(2, "0")}:${String(
        minutes
    ).padStart(2, "0")}`;
}

export function getTodayInTrento(): string {
    const formatter = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Rome",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    const parts = formatter.formatToParts(new Date());

    const getPart = (type: string) =>
        parts.find((part) => part.type === type)?.value ?? "";

    return `${getPart("year")}-${getPart("month")}-${getPart("day")}`;
}


function getCurrentTimeInTrento(now: number): string {
    const formatter = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Rome",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
    });

    const parts = formatter.formatToParts(new Date(now));

    const hour = parts.find(
        (part) => part.type === "hour"
    )?.value ?? "00";

    const minute = parts.find(
        (part) => part.type === "minute"
    )?.value ?? "00";

    return `${hour}:${minute}`;

}

export const scheduleService = {

    getUpcomingDepartures(
        stopId: string,
        limit = 10,
        now = Date.now()
    ): Departure[] {
        const today = getTodayInTrento();

        const currentTime = getCurrentTimeInTrento(now);

        return this.getScheduledDepartures(stopId, today)
            .filter(
                (departure) =>
                    departure.scheduledTime >= currentTime
            )
            .slice(0, limit);
    },

    getScheduledDepartures(
        stopId: string,
        date: string
    ): Departure[] {
        parseDate(date);

        const allDepartures = departuresByStop[stopId] ?? [];

        const results: Array<
            Departure & { sortSeconds: number }
        > = [];

        for (const departure of allDepartures) {
            const dayOffset = Math.floor(
                departure.seconds / SECONDS_PER_DAY
            );

            // Example: 25:10 belongs to yesterday's
            // service but occurs today at 01:10.
            const serviceDate = addDays(date, -dayOffset);

            if (
                !isServiceActive(
                    departure.serviceId,
                    serviceDate
                )
            ) {
                continue;
            }

            const secondsInDay =
                departure.seconds % SECONDS_PER_DAY;

            results.push({
                id: `${serviceDate}-${departure.id}`,
                stopId,
                line: departure.line,
                destination: departure.destination,
                scheduledTime: formatTime(secondsInDay),
                sortSeconds: secondsInDay,
            });
        }

        return results
            .sort((a, b) => a.sortSeconds - b.sortSeconds)
            .map(({ sortSeconds, ...departure }) => departure);
    },

    getFeedInfo() {
        return feed;
    },
};

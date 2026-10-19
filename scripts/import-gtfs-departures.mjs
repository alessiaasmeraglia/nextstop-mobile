
import { parse } from "csv-parse/sync";
import fs from "node:fs";
import path from "node:path";

const sourceDir = path.resolve("data/gtfs/urbano");
const outputFile = path.resolve(
    "src/data/gtfsDepartures.json"
);

const stopsFile = path.resolve(
    "src/data/gtfsStops.json"
);

function readGTFS(filename) {
    const content = fs.readFileSync(
        path.join(sourceDir, filename),
        "utf8"
    );

    return parse(content, {
        columns: true,
        skip_empty_lines: true,
        bom: true,
        relax_quotes: true,
    });
}

function timeToSeconds(time) {
    const [hours, minutes, seconds] = time
        .split(":")
        .map(Number);

    if (
        !Number.isInteger(hours) ||
        !Number.isInteger(minutes) ||
        !Number.isInteger(seconds) ||
        hours < 0 ||
        minutes < 0 ||
        minutes > 59 ||
        seconds < 0 ||
        seconds > 59
    ) {
        throw new Error(`Invalid GTFS time: ${time}`);
    }

    return hours * 3600 + minutes * 60 + seconds;
}

// Stops already selected for NextStop Mobile.
const selectedStops = JSON.parse(
    fs.readFileSync(stopsFile, "utf8")
);

const selectedStopIds = new Set(
    selectedStops.map((stop) => stop.id)
);

const routes = readGTFS("routes.txt");
const trips = readGTFS("trips.txt");
const stopTimes = readGTFS("stop_times.txt");
const calendars = readGTFS("calendar.txt");
const calendarDates = readGTFS("calendar_dates.txt");
const feedInfo = readGTFS("feed_info.txt")[0];

const routeMap = new Map(
    routes.map((route) => [route.route_id, route])
);

const tripMap = new Map(
    trips.map((trip) => [trip.trip_id, trip])
);

// Service rules indexed by service ID.
const services = {};

for (const calendar of calendars) {
    services[calendar.service_id] = {
        days: [
            calendar.monday,
            calendar.tuesday,
            calendar.wednesday,
            calendar.thursday,
            calendar.friday,
            calendar.saturday,
            calendar.sunday,
        ].map((value) => value === "1"),
        startDate: calendar.start_date,
        endDate: calendar.end_date,
    };
}

// Date exceptions: 1 = added, 2 = removed.
const exceptions = {};

for (const item of calendarDates) {
    if (!exceptions[item.date]) {
        exceptions[item.date] = {};
    }

    exceptions[item.date][item.service_id] =
        Number(item.exception_type);
}

// Scheduled departures grouped by stop.
const departuresByStop = {};

for (const item of stopTimes) {
    if (!selectedStopIds.has(item.stop_id)) {
        continue;
    }

    const trip = tripMap.get(item.trip_id);
    if (!trip) continue;

    const route = routeMap.get(trip.route_id);

    if (!route || route.route_type !== "3") {
        continue;
    }

    const departure = {
        id: `${item.trip_id}-${item.stop_sequence}`,
        serviceId: trip.service_id,
        tripId: item.trip_id,
        line: route.route_short_name,
        destination: trip.trip_headsign,
        scheduledTime: item.departure_time,
        seconds: timeToSeconds(item.departure_time),
    };

    if (!departuresByStop[item.stop_id]) {
        departuresByStop[item.stop_id] = [];
    }

    departuresByStop[item.stop_id].push(departure);
}

for (const items of Object.values(departuresByStop)) {
    items.sort((a, b) => a.seconds - b.seconds);
}

const result = {
    feed: {
        publisher: feedInfo.feed_publisher_name,
        version: feedInfo.feed_version,
        startDate: feedInfo.feed_start_date,
        endDate: feedInfo.feed_end_date,
        timezone: "Europe/Rome",
    },
    services,
    exceptions,
    departuresByStop,
};

fs.writeFileSync(
    outputFile,
    JSON.stringify(result),
    "utf8"
);

const totalDepartures = Object.values(
    departuresByStop
).reduce((sum, items) => sum + items.length, 0);

console.log("GTFS departure import completed!");
console.log(`Stops: ${selectedStopIds.size}`);
console.log(`Departures: ${totalDepartures}`);
console.log(`Services: ${Object.keys(services).length}`);
console.log(`Output: ${outputFile}`);
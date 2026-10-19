
import { parse } from "csv-parse/sync";
import fs from "node:fs";
import path from "node:path";

const source = path.resolve("data/gtfs/urbano");
const output = path.resolve("src/data/gtfsStops.json");

function readGTFS(filename) {
    const content = fs.readFileSync(
        path.join(source, filename),
        "utf8"
    );

    return parse(content, {
        columns: true,
        skip_empty_lines: true,
        bom: true,
        relax_quotes: true,
    });
}

const stops = readGTFS("stops.txt");
const routes = readGTFS("routes.txt");
const trips = readGTFS("trips.txt");
const stopTimes = readGTFS("stop_times.txt");

// Route metadata by route ID
const routeMap = new Map(
    routes.map((route) => [route.route_id, route])
);

// Trip metadata by trip ID
const tripMap = new Map(
    trips.map((trip) => [trip.trip_id, trip])
);

// Associate stop IDs with their transit lines.
const linesByStop = new Map();

for (const time of stopTimes) {
    const trip = tripMap.get(time.trip_id);
    if (!trip) continue;

    const route = routeMap.get(trip.route_id);
    if (!route || route.route_type !== "3") continue;

    if (!linesByStop.has(time.stop_id)) {
        linesByStop.set(time.stop_id, new Set());
    }

    linesByStop
        .get(time.stop_id)
        .add(route.route_short_name);
}

// Initial geographic selection using GTFS zone IDs.
// These groups cover Trento and the Rovereto urban area.
const zoneCities = {
    "10110": "Trento",
    "10101": "Rovereto",
    "10121": "Rovereto",
};

const result = stops
    .filter((stop) => zoneCities[stop.zone_id])
    .filter((stop) => linesByStop.has(stop.stop_id))
    .map((stop) => ({
        id: stop.stop_id,
        name: stop.stop_name,
        city: zoneCities[stop.zone_id],
        lines: [...linesByStop.get(stop.stop_id)].sort(
            (a, b) => a.localeCompare(b, "it", { numeric: true })
        ),
        mode: "bus",
        latitude: Number(stop.stop_lat),
        longitude: Number(stop.stop_lon),
    }))
    .sort((a, b) =>
        a.name.localeCompare(b.name, "it")
    );

fs.mkdirSync(path.dirname(output), {
    recursive: true,
});

fs.writeFileSync(
    output,
    JSON.stringify(result, null, 2),
    "utf8"
);

console.log(`Imported ${result.length} stops.`);
console.log(`Output: ${output}`);
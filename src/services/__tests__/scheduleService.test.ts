
import { describe, expect, it } from "vitest";
import { scheduleService } from "../scheduleService";

describe("GTFS Schedule Service", () => {
    const stopId = "408";

    it("returns departures for a weekday", () => {
        const departures =
            scheduleService.getScheduledDepartures(
                stopId,
                "2026-10-19"
            );

        expect(departures).toHaveLength(147);
        expect(departures.every(
            (departure) => departure.stopId === stopId
        )).toBe(true);
    });

    it("applies holiday calendar exceptions", () => {
        const regularDay =
            scheduleService.getScheduledDepartures(
                stopId,
                "2026-12-09"
            );

        const holiday =
            scheduleService.getScheduledDepartures(
                stopId,
                "2026-12-08"
            );

        expect(regularDay).toHaveLength(147);
        expect(holiday).toHaveLength(35);
    });

    it("returns departures in chronological order", () => {
        const departures =
            scheduleService.getScheduledDepartures(
                stopId,
                "2026-10-19"
            );

        const times = departures.map(
            (departure) => departure.scheduledTime
        );

        expect(times).toEqual([...times].sort());
    });

    it("associates departures after midnight with the correct date", () => {
        // This trip belongs to Monday's service,
        // but stops here at 00:00 on Tuesday.
        const departures =
            scheduleService.getScheduledDepartures(
                "409",
                "2026-10-20"
            );

        expect(departures).toContainEqual(
            expect.objectContaining({
                id: "2026-10-19-0004529582026091020270608-20",
                stopId: "409",
                line: "4",
                destination: "Roncafort",
                scheduledTime: "00:00",
            })
        );
    });

    it("returns no departures outside feed validity", () => {
        const departures =
            scheduleService.getScheduledDepartures(
                stopId,
                "2028-01-01"
            );

        expect(departures).toHaveLength(0);
    });

    it("rejects invalid dates", () => {
        expect(() =>
            scheduleService.getScheduledDepartures(
                stopId,
                "2026-02-30"
            )
        ).toThrow("Invalid date");
    });
});

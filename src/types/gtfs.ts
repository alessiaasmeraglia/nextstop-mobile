
export interface GTFSServiceRule {
    days: boolean[];
    startDate: string;
    endDate: string;
}

export interface GTFSDeparture {
    id: string;
    serviceId: string;
    tripId: string;
    line: string;
    destination: string;
    scheduledTime: string;
    seconds: number;
}

export interface GTFSFeed {
    publisher: string;
    version: string;
    startDate: string;
    endDate: string;
    timezone: string;
}

export interface GTFSData {
    feed: GTFSFeed;
    services: Record<string, GTFSServiceRule>;
    exceptions: Record<string, Record<string, number>>;
    departuresByStop: Record<string, GTFSDeparture[]>;
}

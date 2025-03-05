export function convertUnitToSeconds(duration: string): number {
    const regex = /^(\d+)([smhd])$/; // Matches strings like "60m", "1h"
    const matches = duration.match(regex);

    if (!matches) {
        throw new Error("Invalid duration format");
    }

    const value = parseInt(matches[1], 10);
    const unit = matches[2];

    switch (unit) {
        case "s":
            return value; // seconds
        case "m":
            return value * 60; // minutes to seconds
        case "h":
            return value * 3600; // hours to seconds
        case "d":
            return value * 86400; // days to seconds
        default:
            throw new Error("Unknown time unit");
    }
}

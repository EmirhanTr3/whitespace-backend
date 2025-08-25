const epoch = 1723593600000;
let lastTimestamp = -1;

export function generateSnowflakeId(): string | undefined {
    let timestamp = Date.now();
    let sequence = 0;

    if (timestamp < lastTimestamp) return;

    if (timestamp === lastTimestamp) {
        sequence = (sequence + 1) & 4095;
        if (sequence === 0) {
            timestamp = waitNextMillis(lastTimestamp);
        }
    }

    lastTimestamp = timestamp;

    const id =
        (BigInt(timestamp - epoch) << 22n) |
        BigInt(sequence);

    return id.toString();
}

function waitNextMillis(lastTimestamp: number): number {
    let timestamp = Date.now();
    while (timestamp <= lastTimestamp) {
        timestamp = Date.now();
    }
    return timestamp;
}
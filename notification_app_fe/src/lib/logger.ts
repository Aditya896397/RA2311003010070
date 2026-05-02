export const VALID_LEVELS = ["debug", "info", "warn", "error", "fatal"];
export const VALID_PACKAGES = [
    "api", "component", "hook", "page", "state", "style", // frontend
    "auth", "config", "middleware", "utils" // shared
];

export async function Log(stack: string, level: string, pkg: string, message: string) {
    let tokenToUse = process.env.NEXT_PUBLIC_ACCESS_TOKEN;

    if (!tokenToUse) {
        console.warn("Logger: Access token not set.");
        return;
    }

    if (stack !== "frontend") {
        console.warn(`Logger: Invalid stack '${stack}'. Only 'frontend' is allowed for this track.`);
    }
    if (!VALID_LEVELS.includes(level)) {
        console.warn(`Logger: Invalid level '${level}'. Allowed: ${VALID_LEVELS.join(", ")}`);
    }
    if (!VALID_PACKAGES.includes(pkg)) {
        console.warn(`Logger: Invalid package '${pkg}'. Allowed packages: ${VALID_PACKAGES.join(", ")}`);
    }

    try {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/proxy/logs`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokenToUse}`
            },
            body: JSON.stringify({ stack, level, package: pkg, message })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error(`Logger: Failed to send log. Status: ${response.status}. Msg: ${errText}`);
        }
    } catch (error) {
        console.error("Logger: Network request failed:", error);
    }
}

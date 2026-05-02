let ACCESS_TOKEN = "";

/**
 * Initialize the logger with the bearer token.
 * For frontend applications, call this once at app initialization.
 * @param {string} token - The Authorization token (Bearer)
 */
export function initLogger(token) {
    ACCESS_TOKEN = token;
}

const VALID_LEVELS = ["debug", "info", "warn", "error", "fatal"];
const VALID_PACKAGES = [
    "api", "component", "hook", "page", "state", "style", // frontend
    "auth", "config", "middleware", "utils" // shared
];

/**
 * Log a message to the evaluation service.
 * @param {string} stack - 'frontend'
 * @param {string} level - 'debug', 'info', 'warn', 'error', 'fatal'
 * @param {string} pkg - The package/layer originating the log
 * @param {string} message - The actual log message
 */
export async function Log(stack, level, pkg, message) {
    let tokenToUse = ACCESS_TOKEN;

    if (!tokenToUse) {
        // Fallback to env variables if available (Node.js, Vite, Next.js)
        if (typeof process !== "undefined" && process.env && process.env.ACCESS_TOKEN) {
            tokenToUse = process.env.ACCESS_TOKEN;
        } else if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_ACCESS_TOKEN) {
            tokenToUse = import.meta.env.VITE_ACCESS_TOKEN;
        } else if (typeof process !== "undefined" && process.env && process.env.NEXT_PUBLIC_ACCESS_TOKEN) {
            tokenToUse = process.env.NEXT_PUBLIC_ACCESS_TOKEN;
        } else {
            console.warn("Logger: Access token not set. Call initLogger(token) first.");
            return;
        }
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
        const response = await fetch("http://20.207.122.201/evaluation-service/logs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokenToUse}`
            },
            body: JSON.stringify({
                stack: stack,
                level: level,
                package: pkg,
                message: message
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error(`Logger: Failed to send log. Status: ${response.status}. Msg: ${errText}`);
        }
    } catch (error) {
        console.error("Logger: Network request failed:", error);
    }
}

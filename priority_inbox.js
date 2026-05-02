import fs from 'fs';

// Read ACCESS_TOKEN from .env file
const envData = fs.readFileSync('.env', 'utf-8');
const tokenMatch = envData.match(/ACCESS_TOKEN=(.*)/);
if (!tokenMatch) {
    console.error("ACCESS_TOKEN not found in .env");
    process.exit(1);
}
const ACCESS_TOKEN = tokenMatch[1].trim();

// Weight mapping for priority
const TYPE_WEIGHTS = {
    'Placement': 3,
    'Result': 2,
    'Event': 1
};

// Compare function: returns true if A is "smaller" (lower priority) than B
// In our Min-Heap, the root should be the item with the LOWEST priority among the top N.
function isLowerPriority(a, b) {
    const weightA = TYPE_WEIGHTS[a.Type] || 0;
    const weightB = TYPE_WEIGHTS[b.Type] || 0;

    if (weightA !== weightB) {
        return weightA < weightB;
    }
    // If weights are equal, the older timestamp is lower priority
    return new Date(a.Timestamp).getTime() < new Date(b.Timestamp).getTime();
}

class MinHeap {
    constructor(maxSize) {
        this.heap = [];
        this.maxSize = maxSize;
    }

    push(item) {
        if (this.heap.length < this.maxSize) {
            this.heap.push(item);
            this._bubbleUp(this.heap.length - 1);
        } else if (isLowerPriority(this.heap[0], item)) {
            // If the new item is higher priority than the lowest-priority item in the heap
            this.heap[0] = item;
            this._bubbleDown(0);
        }
    }

    getSortedItems() {
        // Sort descending (highest priority first)
        return [...this.heap].sort((a, b) => isLowerPriority(a, b) ? 1 : -1);
    }

    _bubbleUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (isLowerPriority(this.heap[parentIndex], this.heap[index])) {
                break;
            }
            [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
            index = parentIndex;
        }
    }

    _bubbleDown(index) {
        const length = this.heap.length;
        while (true) {
            let leftChildIndex = 2 * index + 1;
            let rightChildIndex = 2 * index + 2;
            let smallest = index;

            if (leftChildIndex < length && isLowerPriority(this.heap[leftChildIndex], this.heap[smallest])) {
                smallest = leftChildIndex;
            }
            if (rightChildIndex < length && isLowerPriority(this.heap[rightChildIndex], this.heap[smallest])) {
                smallest = rightChildIndex;
            }
            if (smallest === index) break;

            [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
            index = smallest;
        }
    }
}

async function fetchAndProcessNotifications(n = 10) {
    console.log(`Fetching notifications and finding the top ${n} priority items...\n`);
    try {
        const response = await fetch("http://20.207.122.201/evaluation-service/notifications", {
            headers: {
                "Authorization": `Bearer ${ACCESS_TOKEN}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const notifications = data.notifications || [];

        // Maintain top N efficiently
        const priorityQueue = new MinHeap(n);
        for (const notif of notifications) {
            priorityQueue.push(notif);
        }

        const topNotifications = priorityQueue.getSortedItems();

        console.log("=== PRIORITY INBOX (TOP " + n + ") ===");
        topNotifications.forEach((notif, index) => {
            console.log(`[${index + 1}] Type: ${notif.Type.padEnd(10)} | Time: ${notif.Timestamp} | Msg: ${notif.Message}`);
        });

    } catch (err) {
        console.error("Error processing notifications:", err);
    }
}

// You can change 'n' to any number you prefer
fetchAndProcessNotifications(10);

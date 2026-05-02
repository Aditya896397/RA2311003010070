# Notification System Design

## Stage 1

### Approach: Priority Inbox
To efficiently maintain the top `n` unread notifications out of a potentially continuous stream of incoming notifications, I implemented a **Min-Heap (Priority Queue)** data structure. 

#### Priority Weighting
Priority is strictly evaluated based on two factors:
1. **Type Weight**: `Placement (3) > Result (2) > Event (1)`.
2. **Recency**: In the event of a tie in Type Weight, the notification with the newer (greater) `Timestamp` receives higher priority.

#### Algorithm Efficiency
Instead of sorting the entire list of incoming notifications (which would take $O(N \log N)$ time and become increasingly slow as data grows), the application uses a fixed-size Min-Heap of size `k` (where `k` is the top `n` notifications we want to display, e.g., 10). 

- **Insertion**: For every incoming notification, we compare its priority against the root of the Min-Heap (which represents the lowest priority item among our top `k`). 
- If the new notification has a higher priority than the root, we pop the root and push the new notification, restoring the heap property in $O(\log k)$ time. 
- **Time Complexity**: This approach guarantees that maintaining the top 10 notifications takes only $O(N \log k)$ time, which is highly optimal and scalable for continuous streaming data. Space complexity is tightly bounded to $O(k)$.

---

## Stage 2: Frontend & UI Enhancements

### 1. Application Architecture (Next.js & Material UI)
The frontend is built using **Next.js** to guarantee it runs strictly on port `3000` while natively solving CORS and proxy issues via API rewrites (`next.config.ts`). The interface is designed exclusively using **Material UI v6**.

### 2. Vibrant & Colorful UI
To ensure maximum user engagement, a highly colorful and premium aesthetic was implemented:
- **Gradient App Bar**: Uses a smooth linear gradient (`#6C63FF` to `#FF6584`) to create a vibrant first impression.
- **Micro-interactions**: Notification cards implement subtle `transform: translateY` hover effects and drop shadows to feel tactile and interactive.
- **Categorization Chips**: Notifications feature distinctly colored chips (Green for Placement, Orange for Result, Blue for Event) for instant visual scanning.

### 3. Viewed Notification Tracking (Local Storage)
To track read/unread states without a dedicated database, the application securely utilizes the browser's `localStorage`.
- Unread notifications appear bold with filled chips and a prominent purple border.
- Once clicked, the notification ID is logged, and the UI instantly dims the card, lowers the elevation shadow, and switches the chip to an outlined variant to distinctly visually separate it from unread items.

### 4. Custom Logging Middleware
Integrated the custom `logging_middleware` package into the Next.js application. Events (such as page loads, filter changes, and marking items as read) correctly dispatch logs to the remote evaluation server while strictly validating the `frontend` stack limitation.

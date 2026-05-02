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

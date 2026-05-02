"use client";

import { useEffect, useState } from "react";
import { fetchNotifications, Notification } from "@/lib/api";
import NotificationCard from "@/components/NotificationCard";
import { Box, CircularProgress, MenuItem, Select, Typography } from "@mui/material";
import { Log } from "@/lib/logger";
import { MinHeap } from "@/lib/priorityInbox";

export default function PriorityInbox() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [n, setN] = useState(10); // user's choice for top 'n'

  useEffect(() => {
    Log("frontend", "info", "page", `Loading Priority Inbox top ${n}`);
    loadPriorityNotifications();
  }, [n]);

  const loadPriorityNotifications = async () => {
    setLoading(true);
    try {
      // Fetching a large sample to determine top 'n' across them
      // In a real production system, this computation might happen backend,
      // but per Stage 1/2 instructions we run our Min-Heap on frontend here.
      const data = await fetchNotifications(1, 100, "All"); 
      
      const heap = new MinHeap(n);
      data.forEach(item => heap.push(item));
      
      const topPriority = heap.getSortedItems();
      setNotifications(topPriority);

      Log("frontend", "info", "component", `Successfully computed top ${n} priority notifications`);
    } catch (e) {
      Log("frontend", "error", "api", "Error computing priority notifications");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">Priority Inbox</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography>Top:</Typography>
          <Select
            value={n}
            size="small"
            onChange={(e) => {
              setN(Number(e.target.value));
              Log("frontend", "debug", "state", `Changed priority limit to ${e.target.value}`);
            }}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {notifications.map((notif) => (
            <NotificationCard key={notif.ID} notification={notif} />
          ))}
          {notifications.length === 0 && (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", mt: 4 }}>
              No notifications found.
            </Typography>
          )}
        </>
      )}
    </Box>
  );
}

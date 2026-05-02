"use client";

import { useEffect, useState } from "react";
import { fetchNotifications, Notification } from "@/lib/api";
import NotificationCard from "@/components/NotificationCard";
import { Box, Button, CircularProgress, MenuItem, Select, Typography } from "@mui/material";
import { Log } from "@/lib/logger";

export default function Home() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [type, setType] = useState("All");

  useEffect(() => {
    Log("frontend", "info", "page", `Loading All Notifications page ${page}`);
    loadNotifications();
  }, [page, limit, type]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await fetchNotifications(page, limit, type);
      setNotifications(data);
      Log("frontend", "info", "api", `Fetched ${data.length} notifications successfully`);
    } catch (e) {
      Log("frontend", "error", "api", "Error fetching notifications");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">All Notifications</Typography>
        <Select
          value={type}
          size="small"
          onChange={(e) => {
            setType(e.target.value);
            setPage(1); // reset to first page on filter change
            Log("frontend", "debug", "state", `Changed filter to ${e.target.value}`);
          }}
        >
          <MenuItem value="All">All Types</MenuItem>
          <MenuItem value="Placement">Placement</MenuItem>
          <MenuItem value="Result">Result</MenuItem>
          <MenuItem value="Event">Event</MenuItem>
        </Select>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {notifications.map((n) => (
            <NotificationCard key={n.ID} notification={n} />
          ))}
          {notifications.length === 0 && (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", mt: 4 }}>
              No notifications found.
            </Typography>
          )}
          
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 2, alignItems: "center" }}>
            <Button 
              variant="outlined" 
              disabled={page === 1} 
              onClick={() => setPage(p => p - 1)}
            >
              Previous
            </Button>
            <Typography>Page {page}</Typography>
            <Button 
              variant="outlined" 
              disabled={notifications.length < limit} 
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}

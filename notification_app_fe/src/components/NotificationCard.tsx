"use client";

import { Card, CardContent, Typography, Chip, Box, CardActionArea } from "@mui/material";
import { Notification } from "@/lib/api";
import { useEffect, useState } from "react";
import { Log } from "@/lib/logger";

interface Props {
  notification: Notification;
}

export default function NotificationCard({ notification }: Props) {
  const [isRead, setIsRead] = useState(false);

  useEffect(() => {
    const readItems = JSON.parse(localStorage.getItem("read_notifications") || "[]");
    if (readItems.includes(notification.ID)) {
      setIsRead(true);
    }
  }, [notification.ID]);

  const handleClick = () => {
    if (!isRead) {
      const readItems = JSON.parse(localStorage.getItem("read_notifications") || "[]");
      readItems.push(notification.ID);
      localStorage.setItem("read_notifications", JSON.stringify(readItems));
      setIsRead(true);
      Log("frontend", "debug", "state", `Marked notification ${notification.ID} as read`);
    }
  };

  const getColor = () => {
    switch (notification.Type) {
      case "Placement": return "success";
      case "Result": return "warning";
      case "Event": return "info";
      default: return "default";
    }
  };

  return (
    <Card 
      sx={{ 
        mb: 2, 
        opacity: isRead ? 0.7 : 1,
        borderLeft: isRead ? '4px solid #B0BEC5' : '4px solid #6C63FF',
        borderRadius: 2,
        boxShadow: isRead ? 1 : 3,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 6
        }
      }}
    >
      <CardActionArea onClick={handleClick} sx={{ p: 1 }}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
            <Chip 
              label={notification.Type} 
              color={getColor() as any} 
              size="small" 
              variant={isRead ? "outlined" : "filled"}
              sx={{ fontWeight: 'bold' }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
              {notification.Timestamp}
            </Typography>
          </Box>
          <Typography variant={isRead ? "body1" : "h6"} sx={{ fontWeight: isRead ? 'medium' : 'bold', color: isRead ? 'text.secondary' : 'text.primary' }}>
            {notification.Message}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

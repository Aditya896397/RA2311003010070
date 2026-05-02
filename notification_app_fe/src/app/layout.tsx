"use client";

import { ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import Link from 'next/link';
import { Log } from '@/lib/logger';
import './globals.css';

const vibrantTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#6C63FF' }, // Vibrant purple
    secondary: { main: '#FF6584' }, // Vibrant pink
    background: { default: '#F4F7FE', paper: '#FFFFFF' },
    success: { main: '#4CAF50' },
    warning: { main: '#FF9800' },
    info: { main: '#2196F3' }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #6C63FF 0%, #FF6584 100%)',
          color: 'white'
        }
      }
    }
  }
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const handleNavClick = (page: string) => {
    Log('frontend', 'info', 'page', `Navigated to ${page}`);
  };

  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={vibrantTheme}>
          <CssBaseline />
          <AppBar position="static" elevation={3}>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                AffordMed Notifications
              </Typography>
              <Button color="inherit" component={Link} href="/" onClick={() => handleNavClick('All Notifications')}>
                All Notifications
              </Button>
              <Button color="inherit" component={Link} href="/priority" onClick={() => handleNavClick('Priority Inbox')}>
                Priority Inbox
              </Button>
            </Toolbar>
          </AppBar>
          <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ minHeight: '80vh' }}>
              {children}
            </Box>
          </Container>
        </ThemeProvider>
      </body>
    </html>
  );
}

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Context Provider
import { AppProvider } from './context/AppContext';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Posts from './pages/Posts';
import Profile from './pages/Profile';
import Chats from './pages/Chats';
import Founders from './pages/Founders';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2E3B55',
    },
    secondary: {
      main: '#FFA500',
    },
    background: {
      default: '#f5f8fa',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
  },
});

// Navigation helper component to handle global events
const NavigationHelper = () => {
  const navigate = useNavigate();
  
  // Simplified navigation logic
  const handleNavigation = (e) => {
    let target = e.target;
    // Traverse up the DOM tree to find the element with data-nav-path
    while (target && target !== document.body) {
      if (target.hasAttribute('data-nav-path')) {
        const navPath = target.getAttribute('data-nav-path');
        if (navPath) {
          e.preventDefault();
          navigate(navPath);
          return;
        }
      }
      target = target.parentNode;
    }
  };

  // Add global event listener for navigation clicks
  useEffect(() => {
    document.body.addEventListener('click', handleNavigation, true);
    return () => {
      document.body.removeEventListener('click', handleNavigation, true);
    };
  }, [navigate]);
  
  return null;
};

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppProvider>
          <div className="App">
            <NavigationHelper />
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/posts" element={<Posts />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:userId" element={<Profile />} />
              <Route path="/chats" element={<Chats />} />
              <Route path="/chats/:groupId" element={<Chats />} />
              <Route path="/founders" element={<Founders />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </AppProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;

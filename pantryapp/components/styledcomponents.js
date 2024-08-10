import { styled } from "@mui/material/styles";
import { TableContainer, TableCell, Button, IconButton, createTheme } from "@mui/material";

const darkPalette = {
    primary: {
      main: "#bb86fc",
      light: "#e2b8ff",
      dark: "#8858c8",
    },
    secondary: {
      main: "#03dac6",
      light: "#66fff9",
      dark: "#00a896",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0b0b0",
    },
    error: {
      main: "#cf6679",
    },
  };
  
  const lightPalette = {
    primary: {
      main: "#6200ee",
      light: "#9c4dff",
      dark: "#3700b3",
    },
    secondary: {
      main: "#03dac6", 
      light: "#66fff9",
      dark: "#00a896",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    text: {
      primary: "#121212",
      secondary: "#6e6e6e",
    },
  };
  const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    background: theme.palette.background.paper,
  }));
  
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    borderBottom: `1px solid ${theme.palette.divider}`,
    color: theme.palette.text.primary,
  }));
  
  const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: 8,
    padding: "8px 16px",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    },
  }));
  
  const ActionButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  }));
  
  localStorage.getItem(darkMode);
  localStorage.setItem("darkMode", darkMode);

  const customTheme = createTheme({
    palette: darkMode ? darkPalette : lightPalette,
    typography: {
      fontFamily: '"Poppins", "Roboto", "Arial", sans-serif',
      h4: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 500,
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          },
        },
      },
    },
  });
  
  export { darkPalette, lightPalette, StyledTableContainer, StyledTableCell, StyledButton, ActionButton, customTheme };
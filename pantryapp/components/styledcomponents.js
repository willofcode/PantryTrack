import { styled } from "@mui/material/styles";
import { TableContainer, TableCell, Button, IconButton} from "@mui/material";
import SearchBar from "./searchbar";

const darkPalette = {
    primary: {
      main: "#0096FF",
      light: "#89CFF0",
      dark: "#6495ED",
    },
    secondary: {
      main: "#B6D0E2",
      light: "#0F52BA",
      dark: "#87CEEB",
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
      main: "#6495ED",
      light: "#87CEEB",
      dark: "#B6D0E2",
    },
    secondary: {
      main: "#4169E1", 
      light: "#0F52BA",
      dark: "#87CEEB",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    text: {
      primary: "#000000",
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

  const StyledSearch = styled(SearchBar)(({ theme }) => ({
    borderRadius: 8,
    padding: "8px 16px",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      backgroundColor: theme.palette.action.hover,
    },
  }));
  
  export { darkPalette, lightPalette, StyledTableContainer, StyledTableCell, StyledButton, ActionButton, StyledSearch };
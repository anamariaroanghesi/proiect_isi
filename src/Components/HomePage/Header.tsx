import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import PushPinIcon from "@mui/icons-material/PushPin";

function Header() {
  return (
    <div className="Header">
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <PushPinIcon fontSize="large" />
          <Typography variant="h4" noWrap component="div">
            BOOKING
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Header;

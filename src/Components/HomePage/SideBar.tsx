import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import { useNavigate } from "react-router-dom";
import { Menu } from "antd";
import { Button } from "@mui/material";
import AuthDetails from "../Login/AuthDetails";

const drawerWidth = 240;

const SideBar: React.FC = () => {
  const navigate = useNavigate();

  const handleMenuClick = (item: any) => {
    navigate(item.key);
  };
  const handleAddHotelClick = () => {
    navigate("/home/add_hotel");
  };
  const handleAddRoomClick = () => {
    navigate("/home/add_room");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Menu onClick={handleMenuClick} mode="vertical">
          <Menu.Item key="/home/acc_details">Account Details</Menu.Item>
          <Divider />
          <Menu.Item key="/home/hotels">Hotels</Menu.Item>
          <Menu.Item key="/home/rooms/a">Rooms</Menu.Item>
          <Divider />
          <Menu.Item key="/home/pending_reservations">
            Pending Reservations
          </Menu.Item>
          <Menu.Item key="/home/accepted_reservations">
            Accepted Reservations
          </Menu.Item>
          <Menu.Item key="/home/history">History</Menu.Item>
          <Menu.Item key="/home/map">
            Map
          </Menu.Item>
        </Menu>
        <Divider />
        <Button
          variant="contained"
          color="secondary"
          onClick={handleAddHotelClick}
          sx={{ margin: "16px", backgroundColor: "pink" }}
        >
          Add Hotel
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleAddRoomClick}
          sx={{ margin: "16px", backgroundColor: "pink" }}
        >
          Add Room
        </Button>
        <Divider />
        <Divider />
        <AuthDetails />
      </Drawer>
    </Box>
  );
};

export default SideBar;

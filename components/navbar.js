"use client";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link"; // Assuming you're using Next.js
import Image from "next/image";

import brandlogo from "../assets/brandlogo.jpg";
import SearchBox from "./searchbox/searchbox";

const Navbar = () => {
  return (
    <AppBar
      sx={{
        backgroundColor: "#FFFFF",
        color: "black",
        boxShadow: "none",
        borderBottom: "1px solid grey",
      }}
      position="static"
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 3 }}>
        {/* Logo Section */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Image
            src={brandlogo} // Replace with your logo path
            alt="Logo"
            style={{ height: 40, width: "auto" }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            component={Link}
            href="/login"
            sx={{
              borderColor: "black",
              color: "black",
              textTransform: "none",
              "&:hover": { backgroundColor: "black", color: "white" },
            }}
          >
            Login
          </Button>
          <Button
            variant="contained"
            component={Link}
            href="/signup"
            sx={{
              backgroundColor: "black",
              color: "white",
              textTransform: "none",
              "&:hover": { backgroundColor: "#444" },
            }}
          >
            Signup
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

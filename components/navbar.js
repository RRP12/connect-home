"use client";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import brandlogo from "../assets/brandlogo.jpg";
const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        {/* Logo Section */}
        <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
          <Image
            src={brandlogo} // Replace with your logo path
            alt="Logo"
            style={{ height: 40, width: "100px" }} // Adjust the height as needed
          />
        </Box>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/">Find Your Dream PG</Link>
        </Typography>

        <Button color="inherit" component={Link} href="/list-pg">
          List PG
        </Button>
        <Button color="inherit" component={Link} href="/login">
          Login
        </Button>
        <Button color="inherit" component={Link} href="/signup">
          Signup
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

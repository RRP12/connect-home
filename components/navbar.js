"use client";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import Link from "next/link";

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
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

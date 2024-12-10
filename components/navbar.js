import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Box from "@mui/material/Box"
import Image from "next/image"
import brandlogo from "../assets/brandlogo.jpg"
import AuthButtonServer from "../app/auth-button-server"
import Link from "next/link"

const Navbar = () => {
  return (
    <AppBar
      sx={{
        boxShadow: "none",
        borderBottom: "1px solid grey",
      }}
      position="static"
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          px: { xs: 2, sm: 3 }, // Padding for small and larger screens
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Image
            src={brandlogo} // Replace with your logo path
            alt="Logo"
            style={{ height: 40, width: "auto" }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "row", sm: "row" }, // Keep buttons in a row on all screen sizes
            alignItems: "center", // Keep the items centered in small and larger screens
          }}
        >
          <Link
            style={{
              border: "1px solid grey",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "red",
              padding: "10px",
              textAlign: "center",
              width: "auto", // Prevent full width for buttons on small screens
            }}
            href="/postproperty"
          >
            Post Property
          </Link>
          <AuthButtonServer />
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar

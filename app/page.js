import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButtonServer from "./auth-button-server";
import { redirect } from "next/navigation";
import { Container, Button, Typography, Grid } from "@mui/material";
import Head from "next/head";
import Navbar from "../components/navbar";
import LocationComponent from "../components/LocationComponent.js";
import SerchBar from "../components/serchBar";
import Link from "next/link";

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: tweets } = await supabase.from("tweets").select("*");

  return (
    <>
      <AuthButtonServer />
      <LocationComponent />
      <div>
        <Head>
          <title>Find Your Dream PG</title>
        </Head>

        <Navbar />

        <Container maxWidth="lg" sx={{ mt: 10 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h2" gutterBottom>
                Find Your Dream PG
              </Typography>
              <Typography variant="h5" component="h5" gutterBottom>
                Search, Connect, and Rent with Ease
              </Typography>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button variant="contained" size="large">
                  Find PG
                </Button>

                <Link href="/postproperty">
                  <button
                    style={{
                      position: "fixed",
                      bottom: "20px",
                      right: "20px",
                      padding: "15px 30px",
                      backgroundColor: "#ff5722",
                      color: "white",
                      border: "none",
                      borderRadius: "50px",
                      fontSize: "18px",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                      cursor: "pointer",
                    }}
                  >
                    Post a Property
                  </button>
                </Link>

                <SerchBar />
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <img src="/pg-image.jpg" alt="PG Image" width="100%" />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 5 }}>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" component="h5" gutterBottom>
                Popular Locations
              </Typography>
              <ul>
                <li>Mumbai</li>
                <li>Delhi</li>
                <li>Bangalore</li>
              </ul>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" component="h5" gutterBottom>
                Types of PG
              </Typography>
              <ul>
                <li>Shared Room</li>
                <li>Private Room</li>
                <li>Entire Flat</li>
              </ul>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" component="h5" gutterBottom>
                Testimonials
              </Typography>
              <blockquote>
                "Found my dream PG with this platform!" - John Doe
              </blockquote>
            </Grid>
          </Grid>
        </Container>
      </div>

      {/* <pre>{JSON.stringify(tweets)}</pre> */}

      {/* <ul>
        {tweets.map((tweet) => (
          <div key={tweet.title}>
            <p>{tweet.title}</p>
            <p>{tweet.user_id}</p>
          </div>
        ))}
      </ul> */}
    </>
  );
}

// Properties table
// id (primary key)
// title
// description
// price
// location (city, state, country)
// latitude
// longitude
// type (PG/rental flat)
// amenities
// images
// user_id (foreign key referencing Users table)

// Sharing Types Table
// id (primary key)
// property_id (foreign key referencing Properties table)
// sharing_type (single, double, triple, 4-sharing)
// price
// availability (yes/no)

// CREATE TYPE property_type AS ENUM (
//   'pg',
//   'rental_flat',
//   'shared_room',
//   'private_room',
//   'studio_apartment',
//   '1bhk',
//   '2bhk',
//   '3bhk'
// );

// {
//   "id": 1,
//   "title": "Mumbai PG",
//   "amenities": [
//     {"id": 1, "name": "Wi-Fi"},
//     {"id": 2, "name": "Laundry facilities"},
//     {"id": 3, "name": "Gym"}
//   ]
// }

// to configure
// [
//   {"id": 1, "name": "Wi-Fi"},
//   {"id": 2, "name": "Laundry facilities"}
// ]

// {
//   "id": 1,
//   "title": "Mumbai PG",
//   "images": [
//     "image1.jpg",
//     "image2.jpg",
//     "image3.jpg"
//   ]
// }

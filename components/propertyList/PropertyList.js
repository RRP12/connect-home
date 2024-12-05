import Grid from "@mui/material/Grid2";
import PropertyCard from "../FacebookPropertyListing";
import { Box } from "@mui/material";
import { fetchUsersPropeties } from "../../app/lib/data";
// import { useEffect, useState } from "react";
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
// import { useDebouncedCallback } from "use-debounce";
// import { Input, Space } from "antd";

export default async function PropertyList() {
  let data = await fetchUsersPropeties();
  // let supabase = createClientComponentClient();
  // const [PropertiesList, setPropertiesList] = useState([]);

  // const [query, setquery] = useState("");

  // useEffect(() => {
  //   async function fetchProperties() {
  //     let { data: properties } = await supabase
  //       .from("properties")
  //       .select("*")
  //       .like("area_name", `%${query}%`);

  //     console.log("properties", properties);

  //     setPropertiesList(properties);
  //   }

  //   fetchProperties();
  // }, [query, supabase]);

  // useEffect(() => {
  //   async function fetchProperties() {
  //     let { data: properties } = await supabase.from("properties").select("*");

  //     setPropertiesList(properties);
  //   }

  //   fetchProperties();
  // }, [supabase]);

  // //listen to realtime chnages

  // useEffect(() => {
  //   const channels = supabase
  //     .channel("custom-update-channel")
  //     .on(
  //       "postgres_changes",
  //       { event: "UPDATE", schema: "public", table: "properties" },
  //       (payload) => {
  //         setPropertiesList((prev) => {
  //           return prev.map((p) =>
  //             p.id === payload.new.id ? { ...p, ...payload.new } : p
  //           );
  //         });
  //       }
  //     )
  //     .subscribe();
  //   return () => {
  //     channels.unsubscribe();
  //   };
  // }, [supabase]);

  // useEffect(() => {
  //   const channels = supabase
  //     .channel("custom-delete-channel")
  //     .on(
  //       "postgres_changes",
  //       { event: "DELETE", schema: "public", table: "properties" },
  //       (payload) => {
  //         console.table("payload", payload);

  //         setPropertiesList((prev) =>
  //           prev.filter((p) => p?.id !== payload?.old?.id)
  //         );
  //       }
  //     )
  //     .subscribe();

  //   return () => {
  //     channels.unsubscribe();
  //   };
  // }, [supabase]);
  // const { Search } = Input;

  // const handelChanage = useDebouncedCallback((e) => {
  //   console.log(`Searching... ${e.target.value}`);
  //   setquery(e.target.value);
  // }, 300);

  return (
    <Grid container xs={8} spacing={4} sx={{ marginBottom: "10px" }}>
      {/* <Search
        placeholder="input search text"
        allowClear
        enterButton="Search"
        size="large"
        // onSearch={onSearch}
        onChange={handelChanage}
      /> */}
      <Box
        sx={{
          overflow: "auto",
          padding: "10px",
          height: "100vh",
        }}
      >
        {!data ? <>NO properties found in your region </> : null}
        {data?.map((p) => (
          <PropertyCard title={p.property_title} key={p.id} property={p} />
        ))}
      </Box>
    </Grid>
  );
}

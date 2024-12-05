"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

const { TextField, InputAdornment } = require("@mui/material");
const { SearchIcon } = require("lucide-react");

const SearchBox = () =>
  // { setPropertiesList }

  {
    const [query, setQuery] = useState("");

    let supabase = createClientComponentClient();

    useEffect(() => {
      async function fetchProperties() {
        let { data: properties, error } = await supabase
          .from("properties")
          .select("*")
          .like("area_name", `%${query}%`);

        console.log("properties filteres ", properties);

        // setPropertiesList(properties);
      }

      fetchProperties();
    }, [supabase, query]);
    const handleSearch = (event) => {
      if (event.key === "Enter" && query.trim()) {
        onSearch(query);
      }
    };

    return (
      <TextField
        fullWidth={true}
        variant="outlined"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    );
  };

export default SearchBox;

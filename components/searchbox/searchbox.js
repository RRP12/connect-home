"use client"

import { createClient } from "../../utils/supabase/client"
import { useEffect, useState } from "react"

const { TextField, InputAdornment } = require("@mui/material")
const { SearchIcon } = require("lucide-react")

const SearchBox = () => {
  let supabase = createClient()
  const [query, setQuery] = useState("")

  useEffect(() => {
    async function fetchProperties() {
      let { data: properties, error } = await supabase
        .from("properties")
        .select("*")
        .like("area_name", `%${query}%`)

      // setPropertiesList(properties)
    }

    fetchProperties()
  }, [supabase, query])
  const handleSearch = (event) => {
    if (event.key === "Enter" && query.trim()) {
      onSearch(query)
    }
  }

  return (
    <div className="flex items-center justify-center">
      <TextField
        className="w-[90%] sm:w-full  my-3"
        fullWidth={false}
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
    </div>
  )
}

export default SearchBox

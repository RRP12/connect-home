import PropertyCard from "../FacebookPropertyListing"
import { createClient } from "../../utils/supabase/server"
export default async function PropertyList() {
  let supabase = await createClient()
  let { data: properties } = await supabase.from("properties").select("*")

  // let supabase = createClientComponentClient()
  // const [PropertiesList, setPropertiesList] = useState([])

  // const [query, setquery] = useState("")

  // useEffect(() => {
  //   async function fetchProperties() {
  //     let { data: properties } = await supabase
  //       .from("properties")
  //       .select("*")
  //       .like("area_name", `%${query}%`)

  //     setPropertiesList(properties)
  //   }

  //   fetchProperties()
  // }, [query, supabase])

  // useEffect(() => {
  //   async function fetchProperties() {
  //     let { data: properties } = await supabase.from("properties").select("*")

  //     setPropertiesList(properties)
  //   }

  //   fetchProperties()
  // }, [supabase])

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
  //           )
  //         })
  //       }
  //     )
  //     .subscribe()
  //   return () => {
  //     channels.unsubscribe()
  //   }
  // }, [supabase])

  // useEffect(() => {
  //   const channels = supabase
  //     .channel("custom-delete-channel")
  //     .on(
  //       "postgres_changes",
  //       { event: "DELETE", schema: "public", table: "properties" },
  //       (payload) => {
  //         console.table("payload", payload)

  //         setPropertiesList((prev) =>
  //           prev.filter((p) => p?.id !== payload?.old?.id)
  //         )
  //       }
  //     )
  //     .subscribe()

  //   return () => {
  //     channels.unsubscribe()
  //   }
  // }, [supabase])
  // const { Search } = Input

  // const handelChanage = useDebouncedCallback((e) => {
  //   setquery(e.target.value)
  // }, 300)

  return (
    <div>
      {properties &&
        properties?.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
    </div>
  )
}

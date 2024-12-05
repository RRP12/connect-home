import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
export default async function PropertyPage({ params }) {
  const { id: propertyID } = params;
  const supabase = createServerComponentClient({ cookies });
  let { data: property, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", propertyID);

  if (error) {
    console.log("error", error);
  }


  // You can fetch and display the property here based on the `id`
  return (
    <>
      title : {property[0].title}
      <div>Property ID : {propertyID}</div>
    </>
  );
}

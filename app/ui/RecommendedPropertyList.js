"use client"
import { useChatContext } from "../../components/mainContext"
export function RecommendedPropertyList() {
  let { setTitles, titles } = useChatContext()

  console.log("titles in properties", titles)

  return (
    <div style={{ width: "100%" }}>
      {titles ? (
        titles?.map((title) => (
          <div key={title}>
            <h3>{title}</h3>
          </div>
        ))
      ) : (
        <>hello</>
      )}
    </div>
  )
}

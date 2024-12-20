import { promises as fs } from "fs"
import path from "path"

export async function GET() {
  try {
    // Define the path to the .txt file in the public directoryscrimba-info.txt
    const filePath = path.join(process.cwd(), "public", "scrimba-info.txt")

    // Read the content of the .txt file
    const text = await fs.readFile(filePath, "utf8")

    // Return the text content as a plain text response
    return new Response(text, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    })
  } catch (err) {
    // Handle any errors and return a 500 status code
    return new Response(
      JSON.stringify({ error: "Failed to read file", details: err.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  }
}

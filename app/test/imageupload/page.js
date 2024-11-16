// "use client";
// import React, { useState } from "react";
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
// import Cookies from "js-cookie";

// function UploadFile() {
//   const supabase = createClientComponentClient({ cookies: Cookies.get() });
//   const [selectedFile, setSelectedFile] = useState(null);

//   const handleFileChange = (event) => {
//     setSelectedFile(event.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) {
//       alert("Please select a file!");
//       return;
//     }

//     const uniqueFilePath = `images/${Date.now()}_${selectedFile.name}`;
//     try {
//       const { data: uploadData, error: uploadError } = await supabase.storage
//         .from("property-images")
//         .upload(uniqueFilePath, selectedFile);

//       if (uploadError) {
//         console.error("Upload error:", uploadError);
//         return;
//       }

//       if (uploadData) {
//         // Retrieve the public URL
//         const { data: publicData, error: urlError } = supabase.storage
//           .from("property-images")
//           .getPublicUrl(uniqueFilePath);

//         if (urlError) {
//           console.error("Error getting public URL:", urlError);
//           return;
//         }

//         const publicURL = publicData?.publicUrl;
//         if (publicURL) {
//           console.log("Public URL:", publicURL);
//           await insertIntoProperties(publicURL);
//         } else {
//           console.error("Public URL is undefined.");
//         }
//       } else {
//         console.error("No data returned from upload");
//       }
//     } catch (error) {
//       console.error("Error during upload:", error);
//     }
//   };

//   const insertIntoProperties = async (url) => {
//     console.log("url", url);

//     const { data, error } = await supabase
//       .from("properties")
//       .update({ images: { imageurl: url } })
//       .eq("id", "122a6404-224e-4901-ae68-01189aaa027d")
//       .select();

//     if (error) {
//       console.log("Error inserting into properties:", error);
//     } else {
//       console.log("Data inserted into properties:", data);
//     }
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleUpload}>Upload File</button>
//     </div>
//   );
// }

// export default UploadFile;
"use client";
"use client";
import React, { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Cookies from "js-cookie";

function UploadFiles() {
  const supabase = createClientComponentClient({ cookies: Cookies.get() });
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files)); // Store all selected files
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select files to upload!");
      return;
    }

    const urls = [];
    for (const file of selectedFiles) {
      const uniqueFilePath = `property-images/${Date.now()}_${file.name}`;

      try {
        // Upload file
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("property-images")
          .upload(uniqueFilePath, file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          continue; // Skip to the next file
        }

        // Get public URL
        const { data: publicUrlData, error: urlError } = await supabase.storage
          .from("property-images")
          .getPublicUrl(uniqueFilePath);

        if (urlError) {
          console.error("Error getting public URL:", urlError);
          continue; // Skip this file if URL retrieval fails
        }

        urls.push(publicUrlData.publicUrl); // Add valid public URL to array
        console.log("Generated Public URL:", publicUrlData.publicUrl);
      } catch (error) {
        console.error("Error during upload:", error);
      }
    }

    // Check if URLs array is populated correctly
    console.log("Final URLs array:", urls);

    // Update the database with the array of URLs
    if (urls.length > 0) {
      const { data: updateData, error: updateError } = await supabase
        .from("properties")
        .update({ images: urls }) // Assuming `images` column is set up to store JSON arrays
        .eq("id", "122a6404-224e-4901-ae68-01189aaa027d"); // Replace with the actual property ID

      if (updateError) {
        console.error("Error updating properties table:", updateError);
      } else {
        console.log("Successfully updated properties table:", updateData);
      }
    } else {
      console.log("No valid URLs to update.");
    }
  };

  return (
    <div>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Files</button>
    </div>
  );
}

export default UploadFiles;

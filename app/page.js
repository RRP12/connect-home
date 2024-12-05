import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButtonServer from "./auth-button-server";
import { redirect } from "next/navigation";
// import { Box, Container, Grid } from "@mui/material";
import { Container, Row, Col } from "react-bootstrap";
import LocationComponent from "../components/LocationComponent.js";
import PropertyFilters from "../components/PropertyFilter";
import PropertyList from "../components/propertyList/PropertyList";
// import SearchBox from "../components/searchbox/searchbox";
// import PropertyList from "../components/propertyList/PropertyList";
import { CiHome, CiBellOn, CiChat1, CiUser } from "react-icons/ci";
import SearchBox from "../components/searchbox/searchbox";
// import SerchBar from "../components/serchBar";
import { lusitana } from "./ui/fonts";
import clsx from "clsx";
import { Suspense } from "react";
import { TableRowSkeleton } from "./skeletons";

import {
  HarmCategory,
  HarmBlockThreshold,
  GoogleGenerativeAI,
} from "@google/generative-ai";
export default async function Home() {
  const apiKey = "AIzaSyDlUn4zOqjv7b-c43oS2kVapN_spHJ6V_0";
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  async function run() {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(
      "what is the capital of india"
    );

    console.log("result", result.response.text());
  }

  run();

  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  let user = await supabase.auth.getUser();
  console.log("user", user.data.user.id);

  // const { data: properties } = await supabase.from("properties").select("*");

  return (
    <main className="flex min-h-screen flex-col p-6">
      <AuthButtonServer />
      <div className="h-full flex flex-col w-10/12 mx-auto">
        <div className="flex flex-row justify-around  my-10 gap-4">
          <div className="border border-sky-100 h-full">
            <PropertyFilters />
          </div>
          <div className=" flex-2 h-full ">
            <div>
              <Suspense fallback={<TableRowSkeleton />}>
                <PropertyList />
              </Suspense>
            </div>
          </div>
          <div className=" h-full ">
            <Aside />
          </div>
        </div>
      </div>
    </main>
  );
}

const Aside = () => {
  const data = [
    { name: "Explore", icon: CiHome, status: "pending" },
    { name: "Notification", icon: CiBellOn, status: "pending" },
    { name: "Messages", icon: CiChat1, status: "pending" },
    { name: "Profile", icon: CiUser, status: "pending" },
  ];

  return (
    <div className="flex flex-col gap-10 w-full">
      <SearchBox />
      {data.map(({ name, icon: Icon, status }) => (
        <div key={name} className="flex gap-3 items-center">
          <Icon className="font-semibold size-5" />
          <h1
            className={clsx(
              "inline-flex items-center rounded-full px-2 py-1 text-sm",
              {
                "bg-gray-100 text-gray-500": status === "pending",
                "bg-green-500 text-white": status === "paid",
              }
            )}
          >
            {name}
          </h1>
        </div>
      ))}
    </div>
  );
};

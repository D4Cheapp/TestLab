import React from "react";
import { Authentication, Home } from "@/src/components";

function HomePage() {
  return (
   <Authentication isAdmin={false}>
     <Home/>
   </Authentication>
  )
}

export default HomePage;

import React from "react";
import { Authentication } from "@/src/components";

function Home() {
  return (
   <Authentication isAdmin={false}>
     <div>
       Home page
     </div>
   </Authentication>
  )
}

export default Home;
"use client";
import HomePage from "@/pages/HomePage";
import "@/app/globals.css"
function Home() {

  function handleClick() {
    console.log('increment like count');
  }
 
  return (
    <HomePage></HomePage>
  );
}

export default Home
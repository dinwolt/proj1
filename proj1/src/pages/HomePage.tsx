"use client";
import "@/app/globals.css"
import Link from "next/link";


function HomePage() {

  function handleClick() {
    //console.log('i work');
  }

  return (
    
    <div className="flex justify-center items-center space-x-4 flex-wrap h-screen">
    <Link href="/ProjectsPage">
      <button
        type="button"
        className="px-6 py-3 h-[200px] w-[200px] text-lg bg-blue-400 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
        onClick={handleClick}
        disabled={false}
      >
        프로젝트 이어하기
      </button>
    </Link>
  
    <Link href="/NewProjectPage">
      <button
        type="button"
        className="px-6 py-3 h-[200px] w-[200px] text-lg bg-blue-400 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
        onClick={handleClick}
        disabled={false}
      >
        새 프로젝트 생성
      </button>
    </Link>
  </div>
  

  );
}


export default HomePage
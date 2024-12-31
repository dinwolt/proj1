import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-white text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link href="/HomePage" className="text-xl font-bold  text-black">Everysim</Link>
        <div className="space-x-4">
          <Link href="/HomePage" className="text-black hover:text-blue-600">
            Home
          </Link>
          <Link href="/ProjectsPage" className="text-black hover:text-blue-600">
            Projects
          </Link>
          <Link href="/NewProjectPage" className="text-black hover:text-blue-600">
            New Project
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

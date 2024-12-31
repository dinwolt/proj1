const Footer = () => {
    return (
      <footer className="bg-customBlue text-white py-4 mt-8">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Everysim. All rights reserved.
          </p>
          <div className="mt-4">
            <a href="/" className="text-gray-400 hover:text-gray-300 mr-4">
              Privacy Policy
            </a>
            <a href="/" className="text-gray-400 hover:text-gray-300">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  
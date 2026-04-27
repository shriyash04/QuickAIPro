import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { ArrowRight } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import AdminNav from "./AdminNav";
import { useIsAdmin } from "../hooks/useIsAdmin";

const Navbar = () => {
  const navigate = useNavigate();

  const { user } = useUser();
  const { openSignIn } = useClerk();
  const { isAdmin } = useIsAdmin();

  return (
    <div className="fixed z-5 w-full backdrop-blur-2xl flex justify-between items-center h-20 px-4 sm:px-20 xl:px-32 cursor-pointer">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="logo"
        className="w-32 sm:w-44 cursor-pointer"
      />

      <div className="flex items-center gap-4">
        {/* Show Admin Nav if user is admin */}
        {user && isAdmin && <AdminNav />}

        {user ? (
          <UserButton />
        ) : (
          // <button
          //   onClick={openSignIn}
          //   className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-10 py-2.5"
          // >
          //   Get started <ArrowRight className="w-4 h-4" />
          // </button>
          <button
            onClick={openSignIn}
            className="group flex items-center gap-3 rounded-full bg-[#4F5DFF] hover:bg-[#3f4cff] text-white text-sm font-medium px-6 py-2.5 transition-all duration-200"
          >
            Get started

            <span className="flex items-center justify-center w-8 h-5 rounded-full bg-white/20 group-hover:bg-white/30 transition-all duration-200">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;

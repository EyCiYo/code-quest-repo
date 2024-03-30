import React from "react";
import { FiLogOut } from "react-icons/fi";
import { useSignOut } from "react-firebase-hooks/auth";
import { useRouter } from "next/router"; // Import useRouter
import { auth } from "@/firebase/firebase";

type LogoutProps = {};

const Logout: React.FC<LogoutProps> = () => {
    const router = useRouter(); // Initialize useRouter
    const [signOut, loading, error] = useSignOut(auth);
    
    const handleLogout = () => {
        signOut();
        router.push('/'); // Redirect to the home page after logout
    };
    
    return (
        <button
            className="bg-dark-fill-3 py-1.5 px-3 cursor-pointer rounded text-brand-orange"
            onClick={handleLogout}
        >
            <FiLogOut />
        </button>
    );
};

export default Logout;

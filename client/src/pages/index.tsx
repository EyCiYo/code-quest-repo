import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";
import { useEffect } from "react";
import { getUserData } from "@/utils/userDataFetch";
import { DBProblem, UserStruct } from "@/utils/types";
import Link from "next/link";
import { authModalState } from "@/atoms/authModalAtoms";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { useRouter } from "next/router";
import AuthModal from "@/components/Modals/AuthModal";

export default function Home() {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState<UserStruct | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const setAuthModalState = useSetRecoilState(authModalState); // Assuming UserStruct is defined somewhere
  const router = useRouter();
  const authModal = useRecoilValue(authModalState);

  useEffect(() => {
    if (user) {
      getUserData(user.uid)
        .then((data) => {
          setUserData(data);
        })
        .catch((error) => {
          console.error("Error getting user data:", error);
        });
    }
  }, [user]);

  const handleLoginButtonClick = () => {
    setShowLoginModal(true);
    setAuthModalState((prev) => ({
      ...prev,
      isOpen: true,
      type: "login",
    }));
  };

  return (
    <main className="bg-dark-layer-2 bg-gradient-to-b from-blue-900 to-black min-h-screen flex flex-col items-center justify-center">
      <img
        src="/logo.png"
        alt="Your Logo"
        className="max-w-full max-h-96 mb-8"
      />

      <div className="text-white text-center">
        <h1 className="text-3xl font-bold mb-4">
          A Personalized Coding Interview Preparation Tool
        </h1>
        {!user && (
          <div className="mt-8">
            <button
              onClick={handleLoginButtonClick}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
            >
              Login
            </button>
          </div>
        )}
        {user && (
          <div className="mt-10 flex flex-row justify-evenly">
            <Link
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              href="/dashboard"
            >
              Dashboard
            </Link>
            <Link
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              href="/recommendations"
            >
              Recommendations
            </Link>
            <Link
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              href="/problemtable"
            >
              Problems
            </Link>
          </div>
        )}
      </div>
      {authModal.isOpen && <AuthModal />}
    </main>
  );
}

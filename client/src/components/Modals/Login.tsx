import { authModalState } from "@/atoms/authModalAtoms";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import { useSetRecoilState } from "recoil";

type LoginProps = {};

const Login: React.FC<LoginProps> = () => {
  const setAuthModalState = useSetRecoilState(authModalState);
  const handleClick = (type: "register" | "forgotPassword") => {
    setAuthModalState((prev) => ({
      ...prev,
      type,
    }));
  };

  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const router = useRouter();
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    //console.log(inputs);
  };

  const handleLogIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputs.email || !inputs.password)
      return alert("Please fill all fields");
    try {
      const newuser = await signInWithEmailAndPassword(
        inputs.email,
        inputs.password
      );
      if (!newuser) return;
      setAuthModalState((prev) => ({
        ...prev,
        isOpen: false,
        type: "login",
      }));
      router.push("/");
    } catch (error: any) {
      toast.error(error.message, {
        theme: "dark",
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    if (error)
      toast.error(error.message, {
        theme: "dark",
        position: "top-center",
        autoClose: 3000,
      });
  }, [error]);

  return (
    <form className="px-6 pb-4 space-y-6" onSubmit={handleLogIn}>
      <h3 className="text-xl font-medium text-white">Sign In to CodeQuest</h3>
      <div>
        <label htmlFor="email" className="text-sm font-medium text-gray-300">
          Email Address
        </label>
        <input
          onChange={handleChangeInput}
          type="email"
          name="email"
          id="email"
          className="border-2 outline-none sm:text-sm rounded-lg focus:ring-gray-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
          placeholder="name@email.com"
        />
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-medium text-gray-300">
          Password
        </label>
        <input
          onChange={handleChangeInput}
          type="password"
          name="password"
          id="password"
          className="border-2 outline-none sm:text-sm rounded-lg focus:ring-gray-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
          placeholder="********"
        />
      </div>

      <button
        type="submit"
        className="w-full text-white focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-gray-500 hover:bg-gray-900"
      >
        {loading ? "Loading..." : "Log In"}
      </button>

      <button
        className="flex w-full justify-end"
        onClick={() => handleClick("forgotPassword")}
      >
        <a
          href="#"
          className="text-sm text-gray-300 hover:underline w-full text-right block"
        >
          Forgot Password
        </a>
      </button>

      <div className="text-sm font-medium text-gray-500">
        Not Registered?&nbsp;
        <a
          href="#"
          className="text-gray-300 hover:underline"
          onClick={() => handleClick("register")}
        >
          Create Account
        </a>
      </div>
    </form>
  );
};
export default Login;

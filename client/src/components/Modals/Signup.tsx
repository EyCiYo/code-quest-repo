import { authModalState } from "@/atoms/authModalAtoms";
import { auth } from "@/firebase/firebase";
import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { addUserToDB } from "@/utils/addUserToDB";

type SignupProps = {};

const Signup: React.FC<SignupProps> = () => {
  const router = useRouter();
  const setAuthModalState = useSetRecoilState(authModalState);
  const handleClick = (type: "login") => {
    setAuthModalState((prev) => ({
      ...prev,
      type,
    }));
  };

  const [inputs, setInputs] = useState({
    email: "",
    name: "",
    password: "",
  });

  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputs.email || !inputs.name || !inputs.password)
      return alert("Please fill all fields");
    try {
      const newuser = await createUserWithEmailAndPassword(
        inputs.email,
        inputs.password
      );
      if (!newuser) return;
      addUserToDB(inputs.email, inputs.name, newuser.user.uid);
      router.push("/");
    } catch (error: any) {
      alert(error.message);
    }
  };

  useEffect(() => {
    if (error) alert(error.message);
  }, [error]);

  return (
    <form className="px-6 pb-4 space-y-6" onSubmit={handleRegister}>
      <h3 className="text-xl font-medium text-white">Create an Account</h3>
      <div>
        <label htmlFor="email" className="text-sm font-medium text-gray-300">
          Email Address
        </label>
        <input
          onChange={handleChangeInput}
          type="email"
          name="email"
          id="email"
          className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
          placeholder="name@email.com"
        />
      </div>
      <div>
        <label htmlFor="name" className="text-sm font-medium text-gray-300">
          Display Name
        </label>
        <input
          onChange={handleChangeInput}
          type="text"
          name="name"
          id="name"
          className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
          placeholder="John Doe"
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
          className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
          placeholder="********"
        />
      </div>

      <button
        type="submit"
        className="w-full text-white focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-500 hover:bg-blue-900"
      >
        {loading ? "Creating account..." : "Sign Up"}
      </button>

      <div className="text-sm font-medium text-gray-500">
        Already have an account?&nbsp;
        <a
          href="#"
          className="text-blue-700 hover:underline"
          onClick={() => handleClick("login")}
        >
          Log In
        </a>
      </div>
    </form>
  );
};
export default Signup;

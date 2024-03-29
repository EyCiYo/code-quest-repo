import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import { RecoilRoot } from "recoil";
import "react-toastify/dist/ReactToastify.css";
import { firestore } from "@/firebase/firebase";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <RecoilRoot>
            <Head>
                <title>CodeQuest</title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                ></meta>
                <meta
                    name="description"
                    content="Personalised Coding Interview Preparation Platform"
                />
            </Head>
            <ToastContainer />
            <Component {...pageProps} />
        </RecoilRoot>
    );
}

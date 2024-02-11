import React, { useState } from "react";
import PreferenceNav from "./PreferenceNav/PreferenceNav";
import Split from "react-split";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { python } from "@codemirror/lang-python";
import {cpp } from "@codemirror/lang-cpp";
import EditorFooter from "./EditorFooter";
import { DBProblem } from "@/utils/types";

type PlaygroundProps = {
  questiondata: DBProblem | null;
};

const Playground: React.FC<PlaygroundProps> = ({questiondata}) => {
  const boilerPlate = atob(questiondata?.boilerplate_py as string);
  const driver = atob(questiondata?.driver_py as string);
  const header = "";
  const [sourceCode, setSourceCode] = useState<string>(boilerPlate);

  const handleRunButtonClick = async () => {
    // Perform actions with sourceCode, e.g., send API request
    try {
      const url =
        "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&fields=*";
      const code = header + sourceCode + driver;
      console.log(code);
      const encodedCode = btoa(code);

      const data = {
        source_code: encodedCode,
        language_id: 71,
        base64_encoded: true,
      };

      const options = {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "Content-Type": "application/json",
          "X-RapidAPI-Key": String(process.env.NEXT_PUBLIC_JUDGE0_API_KEY),
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
        body: JSON.stringify(data),
      };

      const response = await fetch(url, options);
      const responseData = await response.json();

      const submissionToken = responseData.token;
      console.log(submissionToken);

      const statusURL =
        "https://judge0-ce.p.rapidapi.com/submissions/" +
        submissionToken +
        "?base64_encoded=true&fields=stdout,stderr,status_id,language_id";
      const statusResponse = await fetch(statusURL, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          "Content-Type": "application/json",
          "X-RapidAPI-Key": String(process.env.NEXT_PUBLIC_JUDGE0_API_KEY),
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      });

      const statusData = await statusResponse.json();
      const result = atob(statusData.stdout);
      console.log(statusData);
      const resultArray = result.split("-");
      const passArray = resultArray.filter((testCase) => testCase === "1" || testCase === "0");
      var strRes:string= "";
      passArray.forEach((testCase, index) => {
        if (testCase === "1") {
          strRes += `Test case ${index + 1} passed`+ "\n";
        } else {
          strRes += `Test case ${index + 1} failed`+ "\n";
        }
      });
      alert(strRes);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex flex-col relative bg-dark-layer-1 overflow-x-hidden">
      <PreferenceNav />

      <Split
        className="h-[calc(100vh-94px)]"
        direction="vertical"
        sizes={[100, 0]}
        minSize={100}
      >
        <div className="w-full overflow-x-hidden">
          <CodeMirror
            value={sourceCode}
            theme={vscodeDark}
            extensions={[python(),EditorView.lineWrapping]}
            
            style={{ fontSize: 16 }}
            onChange={(value) => {
              setSourceCode(value as string);
            }}
          />
        </div>
        <div className="w-full px-5 overflow-auto">
          {/* testcase heading */}
          <div className="flex h-10 items-center space-x-6">
            <div className="relative flex h-full flex-col justify-center cursor-pointer">
              <div className="text-sm font-medium leading-5 text-white">
                Testcases
              </div>
              <hr className="absolute bottom-0 h-0.5 w-full rounded-full border-none bg-white" />
            </div>
          </div>

          {/* case 1*/}
          <div className="flex">
            <div className="mr-2 items-start mt-2 ">
              <div className="flex flex-wrap items-center gap-y-4">
                <div
                  className={`font-medium items-center transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap
						
									`}
                >
                  Case {0 + 1}
                </div>
              </div>
            </div>
          </div>
          <div className="font-semibold my-4">
            <p className="text-sm font-medium mt-4 text-white">Input:</p>
            <div className="w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2">
              input comes here
            </div>
            <p className="text-sm font-medium mt-4 text-white">Output:</p>
            <div className="w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2">
              ouput comes here
            </div>
          </div>
        </div>
      </Split>
      <EditorFooter onRunButtonClick={handleRunButtonClick} />
    </div>
  );
};
export default Playground;

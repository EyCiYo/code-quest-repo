import React, { useState, useEffect } from "react";
import PreferenceNav from "./PreferenceNav/PreferenceNav";
import Split from "react-split";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import EditorFooter from "./EditorFooter";
import { DBProblem } from "@/utils/types";
import https, { RequestOptions } from "https";
import { setInitialScore, setScoreOnSubmit } from '../../../../model.js';
import { getUserData } from "@/utils/userDataFetch";
import { toast } from "react-toastify";
import axios, { AxiosResponse } from 'axios';
import { Writable } from 'stream';

// interface Props {
//   sendDataToWS: (data: string) => void;
// }

type PlaygroundProps = {
	questiondata: DBProblem | null;
	sendDataToWS: (data: string) => void;
	userIdFromProblem: string;
	toggleFeedback: () => void;
};


const Playground: React.FC<PlaygroundProps> = ({questiondata,sendDataToWS,userIdFromProblem,toggleFeedback}) => {

  	const [selectedLanguage, setSelectedLanguage] = useState<string>("python");
	const displayTestCases = questiondata?.testcases.slice(0, 2);
  	const [boilerPlate, setBoilerPlate] = useState<string>(
    	atob(questiondata?.boilerplate_py as string)
  	);

  	const [driver, setDriver] = useState<string>(
    	atob(questiondata?.driver_py as string)
  	);
	const [beginnerValue, setBeginnerValue] = useState(true);
	const header = `
	#include <iostream>
	#include <vector>
	#include <string>
	#include <algorithm>
	#include <cmath>
	#include <unordered_map>
	#include <unordered_set>
	#include <queue>
	#include <stack>
	#include <utility>
	using namespace std;
	`;

	const [sourceCode, setSourceCode] = useState<string>(boilerPlate);
	const [testCaseIdx, setTestCaseIdx] = useState<number>(0);
	const codeMirrorExtensions = [EditorView.lineWrapping,selectedLanguage == 'python' ? python() : cpp()];
	const getScore = (feedback: string) =>{
		const last = '/10';
		const indexLast = feedback.indexOf(last);
		const first = 'Score is ';
		const indexFirst = feedback.indexOf(first);
		return parseInt(feedback.substring(indexFirst+first.length, indexLast))
	}

	const isBeginner = async (userId:string) =>{
		try{
			console.log("inside isBeginner function")
			let userInfo = await getUserData(userId);
			if(userInfo){
				return userInfo.is_beginner;  // initially true
			}else{
				console.log("could not get user data");
				return true;
			}
		}catch (error) {
			console.error('Error getting beginner status:', error);
			return true;
		}
	}

	const isQuestionSolved = async (questionId:string,userId:string) =>{
		try{
			let userInfo= await getUserData(userId);
			if(userInfo){
				let solvedQuestions = userInfo.question_solved;
				return solvedQuestions.includes(questionId);
			}else{
				console.log("could not get user data");
				return false;
			}
		}catch (error) {
			console.error('Error setting score:', error);
			return false;
		}
	}
	const handleCaseSelect = (index:number) => {
		setTestCaseIdx(index);
	}
	const handlePythonClick = () => {
		setSelectedLanguage("python");
	};

	const handleCppClick = () => {
		setSelectedLanguage("cpp");
	};
	console.log(codeMirrorExtensions);
	useEffect(() => {
		let newBoilerPlate;
		let newDriver;

		if (selectedLanguage === "python") {
		newBoilerPlate = atob(questiondata?.boilerplate_py as string);
		newDriver = atob(questiondata?.driver_py as string);
		} else {
		newBoilerPlate = atob(questiondata?.boilerplate_cpp as string);
		newDriver = atob(questiondata?.driver_cpp as string);
		}

		setBoilerPlate(newBoilerPlate);
		setDriver(newDriver);
		setSourceCode(newBoilerPlate);
	}, [selectedLanguage]);

	useEffect(() => {
		loadSubmitButton();
	}, [userIdFromProblem]);

	const loadSubmitButton = async () => {
		let beginner = await isBeginner(userIdFromProblem);
		// beginner=false;
		console.log("beginner value is",beginner);
		setBeginnerValue(beginner);
	}

	const handleStatusID = async (status_id: number) => {
		const url = 'https://judge0-ce.p.rapidapi.com/statuses';
		const options = {
			method: 'GET',
			headers: {
				'X-RapidAPI-Key': '8934217676msh2bd9a679b7e581cp1721f4jsnaea969da37df',
				'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
			}
		};
		
		try {
			const response = await fetch(url, options);
			const result = await response.json();
			for(var i=0;i<result.length;i++){
				if(result[i].id === status_id){
					console.log(result[i].description);
					toast.info(result[i].description, {
						theme: "dark",
						position: "top-center",
						autoClose: 3000,
					});
				}
			}
		} catch (error) {
			console.error(error);
		}
	}
	const handleRunButtonClick = async (questiondata:DBProblem|null) => {

		const getLanguageId = async (lang : string) => {				//get langugae id corresponding to the language selected
			const url = 'https://judge0-ce.p.rapidapi.com/languages';
			const options = {
				method: 'GET',
				headers: {
					'X-RapidAPI-Key': String(process.env.NEXT_PUBLIC_JUDGE0_API_KEY),
					'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
				}
			};
			const reqLang = lang === 'python' ? 'Python (3.8.1)' : 'C++ (GCC 8.3.0)';
			try {
				const response = await fetch(url, options);
				const result = await response.json();
				for(var i=0;i<result.length;i++){
					if(result[i].name === reqLang){
						console.log(result[i].id);
						return result[i].id as Number;
					}
				}
			} catch (error) {
				console.error(error);
			}
		}
		// Perform actions with sourceCode, e.g., send API request

		if(questiondata==null){
			return
		}
		const showTestcaseScore = !(await isQuestionSolved(questiondata.id,userIdFromProblem));
		if(!showTestcaseScore){
			console.log("Question already solved.");
			return;
		}
		let testcases=0;
		try {
		const url =
			"https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true&fields=*";
		const code =
			selectedLanguage === "python"
			? sourceCode + driver
			: header + sourceCode + driver;
		console.log(code);
		const encodedCode = btoa(code);

		const data = {
			source_code: encodedCode,
			language_id: await getLanguageId(selectedLanguage),
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
		//console.log("api key is ",String(process.env.NEXT_PUBLIC_JUDGE0_API_KEY));
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
		handleStatusID(statusData.status_id)
		if(statusData.stderr){
			toast.error(atob(statusData.stderr), {
				theme: "dark",
				position: "top-center",
				autoClose: 3000,
			});
			throw new Error("Error in code");
		}
		const result = atob(statusData.stdout);
		console.log(statusData);
		const resultArray = result.split("-");
		const passArray = resultArray.filter(
			(testCase) => testCase === "1" || testCase === "0"
		);
		console.log("testcase array is ",passArray);
		var strRes: string = "";
		
		passArray.forEach((testCase, index) => {
			if (testCase === "1") {
				testcases++;
				strRes += `Test case ${index + 1} passed` + "\n";
			} else {
				strRes += `Test case ${index + 1} failed` + "\n";
			}
		});
		showTestcaseScore && beginnerValue ? setInitialScore(questiondata,userIdFromProblem,testcases) : console.log("question already solved") ;
		alert(strRes);
		} catch (error) {
			console.error(error);
		}
	};

	const handleSubmit = async (questiondata:DBProblem|null) => {
		console.log("New Submit Logic");
		if (questiondata === null) {
			return;
		}
		const showFeedback = !(await isQuestionSolved(questiondata.id,userIdFromProblem));
		if(!showFeedback){
			console.log("question already solved.");
			return;
		}
		sendDataToWS(sourceCode);
		toggleFeedback();
	}

	const handleSubmitButtonClick = async (questiondata:DBProblem|null) => {
		console.log("Submit button clicked");
		if(questiondata==null){
			return;
		}
		const showFeedback = !(await isQuestionSolved(questiondata.id,userIdFromProblem));
		if(!showFeedback){
			console.log("question already solved.");
			return;
		}
		
		// const options: RequestOptions = {
		// method: "POST",
		// hostname: "api.deepseek.com",
		// path: "/v1/chat/completions",
		// headers: {
		// 	"Content-Type": "application/json",
		// 	Accept: "application/json",
		// 	Authorization:
		// 	"Bearer " + String(process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY),
		// },
		// };
		// const req = https.request(options, (res) => {
		// let chunks: Buffer[] = [];

		// res.on("data", (chunk: Buffer) => {
		// 	chunks.push(chunk);
		// });
		
		// res.on("end", () => {
			
		// 	let body = Buffer.concat(chunks);
		// 	let content = JSON.parse(body.toString());
		// 	//console.log(body);
		// 	// console.log(content)
		// 	let feedbackResponse = content.choices[0].message.content;
		// 	sendDataToWS(feedbackResponse);
		// 	showFeedback ? setScoreOnSubmit(questiondata,userIdFromProblem,getScore(feedbackResponse)): console.log("question already solved");
		// });

		// res.on("error", (error) => {
		// 	console.error(error);
		// });
		// });

		let postData = JSON.stringify({
		messages: [
			{
			content:
				"Evaluate this code and provide tips to improve the code considering this is a competitve coding environment where comments, try-catch and good variable names are not important. No need to provide a better code, just providing the tips would be enough. Provide the feedback in a professional manner without referencing yourself as I.Evaluate this code and at the end of your feedback in the next line give a score out of 10 in the format 'Score is 6/10' and there should not be anything after the score.",
			role: "system",
			},
			{
			content: sourceCode,

			role: "user",
			},
		],
		model: "deepseek-coder",
		frequency_penalty: 0,
		max_tokens: 2048,
		presence_penalty: 0,
		stop: null,
		stream: true,
		temperature: 0.2,
		top_p: 1,
		});

		// axios.post('https://api.deepseek.com/v1/chat/completions', postData, {
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 		'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY}`,
		// 	},
		// 	responseType: 'stream' // Enable streaming response
		// })
		// .then((response: AxiosResponse) => {
		// 	response.data.pipe(new Writable({
		// 		write(chunk, encoding, next) {
		// 			const content = JSON.parse(chunk.toString());
		// 			const feedbackResponse = content.choices[0].message.content;
		// 			sendDataToWS(feedbackResponse);
		// 			showFeedback ? setScoreOnSubmit(questiondata, userIdFromProblem, getScore(feedbackResponse)) : console.log("question already solved");
		// 			next();
		// 		}
		// 	}));
		// })
		// .catch((error: Error) => {
		// 	console.error(error);
		// });

		// req.write(postData);

		// req.end();
		// setScoreOnSubmit(questiondata);

	};
	return (
		<div className="flex flex-col relative bg-dark-layer-1 overflow-x-hidden">
		<PreferenceNav
			onPythonClick={handlePythonClick}
			onCppClick={handleCppClick}
		/>
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
				extensions={codeMirrorExtensions}
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

				{/* cases*/}
				<div className=" flex flex-row justify-start items-center gap-x-2">
					{displayTestCases?.map((testcase,index)=> (
					<div key={index}>	
						<div className="flex">
							<div className="mr-2 items-start mt-2 ">
								<div className="flex flex-wrap items-center gap-y-4">
									<button onClick={() => handleCaseSelect(index)}>
										<div
										className={`font-medium items-center transition-all inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap
										${index === testCaseIdx ? "border border-green-600 text-white" :""}`}
										>
										Case {index + 1}
										</div>
									</button>
								</div>
							</div>
						</div>
					</div>))}
				</div>
				<div className="font-semibold my-4">
					<p className="text-sm font-medium mt-4 text-white">Input:</p>
					<div className="w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2">
						{questiondata?.testcases[testCaseIdx].input}
					</div>
					<p className="text-sm font-medium mt-4 text-white">Output:</p>
					<div className="w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2">
						{questiondata?.testcases[testCaseIdx].output}
					</div>
				</div>
			</div>
		</Split>
		<EditorFooter
			onRunButtonClick={() => handleRunButtonClick(questiondata)}
			// onSubmitButtonClick={handleSubmitButtonClick}
			onSubmitButtonClick={() => handleSubmit(questiondata)}
			isBeginner = {beginnerValue}
		/>
		</div>
	);
};
export default Playground;

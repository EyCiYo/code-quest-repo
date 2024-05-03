// scoresArray should be stored in the database for each user and is retrieved whenever the user the solves a problem 
import { getUserData } from "@/utils/userDataFetch"
import { updateQuestionsSolved } from "@/utils/updateQuestionsSolved";
import { updateUserScore } from "@/utils/updateUserScore";
import { updateBeginnerStatus } from "@/utils/updateBeginnerStatus";
import { updateProblemCount } from "@/utils/updateProblemCount";
import { updateQuestionStatus } from "@/utils/updateQuestionStatus";
import {topicArray} from "@/utils/types";


// var scoresArray = {
//     "array": 10,
//     "math":20,
//     "string": 31,
//     "hash table":60,
//     "binary search":22,
//     "tree": 10,
//     "graph": 15,
//     "dynamic programming": 5
// }

// var scoresArray={}
var difficultyWeight = {
    "easy" : 1,
    "medium" : 2,
    "hard": 3
}

var topicWeight = {
    "array": 0.1,
    "hash table": 0.25,
    "string": 0.2,
    "sliding window": 0.2,
    "dynamic programming": 0.8,
    "recursion": 0.7,
    "math": 0.3,
    "bit manipulation": 0.45,
    "two pointers": 0.45,
    "greedy": 0.55,
    "sorting": 0.35,
    "stack": 0.45,
    "backtracking": 0.55,
    "binary search": 0.35,
    "matrix": 0.7,
    "simulation": 0.6,
    "divide and conquer": 0.7,
    "monotonic stack": 0.7,
    "union find": 0.6,
    "depth-first search": 0.7,
    "breadth-first search": 0.7,
    "trie": 0.45,
    "geometry": 0.55,
    "bucket sort": 0.45,
    "radix sort": 0.45,
    "rolling hash": 0.45,
    "hash function": 0.45,
    "shell": 0.35,
    "linked list": 0.35,
    "enumeration": 0.35,
    "number theory": 0.45,
    "graph": 0.7,
    "topological sort": 0.6,
    "quickselect": 0.6,
    "binary indexed tree": 0.6,
    "segment tree": 0.6,
    "line sweep": 0.6,
    "prefix sum": 0.5,
    "heap": 0.6,
    "ordered set": 0.5,
    "binary tree": 0.7,
    "binary search tree": 0.6,
    "monotonic queue": 0.6,
    "queue": 0.5,
    "interactive": 0.5,
    "database": 0.5
};


const totalInitialProblems=4;
// let topicList=[]
// let difficultyLevel="";
// let score=0;

//-----------------------------------------------------------------//
//function definitions

export function convertToScoresObject(keyValueArray) {
    var arrayOfScores = {};

    for (var i = 0; i < keyValueArray.length; i++) {
        var pair = keyValueArray[i];
        arrayOfScores[pair.name.toLowerCase()] = pair.score;
    }

    return arrayOfScores;
}
function convertToScoresArray(scoresObject) {
    var keyValueArray = [];
    for (var key in scoresObject)  {
            keyValueArray.push({ score: scoresObject[key], name: key });
        }
        return keyValueArray;
}

export async function setInitialScore(questionData,userId,testcases){
    console.log("inside setInitialScore");
    try{
        console.log("no. of testcases passed are",testcases);
        let userInfo= await getUserData(userId);
        if(userInfo){
            // let solvedQuestions=userInfo.question_solved;
            let userScoresAll=userInfo.scores;
            let initialProblemCount=userInfo.initial_problem_count; 
            let questionStatus = userInfo.question_stats;
            // console.log("old status is ",questionStatus);
            console.log('User data fetched at model.js:',userInfo);
            let scoresObject=convertToScoresObject(userScoresAll);
            let difficultyLevel=questionData.difficulty.toLowerCase();
            let topicList=questionData.topics.toLowerCase().split(",");
            scoresObject=intialScores(scoresObject,topicList,testcases,difficultyLevel);
            userScoresAll=convertToScoresArray(scoresObject) 
            questionStatus=changeQuestionsStatus(questionData.difficulty,questionStatus);
            console.log("new status is ",questionStatus);
            await updateUserScore(userId,userScoresAll);
            // solvedQuestions.push(questionData.id);  
            await updateQuestionsSolved(userId,questionData.id);
            // initialProblemCount++; 
            await updateProblemCount(userId,++initialProblemCount);

            await updateQuestionStatus(userId,questionStatus);

            if(initialProblemCount==totalInitialProblems){
                // let beginner = false;
                await updateBeginnerStatus(userId);
            }
        }else{
            console.log("could not get user data at model.js");
        }
    }catch (error) {
        console.error('Error setting score:', error);
    }
}

function changeQuestionsStatus(difficultyLevel,questionStatus){
    ++questionStatus[difficultyLevel.toLowerCase()]
    return questionStatus;
}

export async function setScoreOnSubmit(questionData,userId,feedbackScore,testcaseScore,isFullPass) {
    console.log("inside setScoreOnSubmit");
    try{
        let userInfo= await getUserData(userId);
        if(userInfo){
            let solvedQuestions=userInfo.question_solved;
            let userScoresAll=userInfo.scores;
            let questionStatus = userInfo.question_stats;
            console.log('User data fetched at model.js:',userInfo);
            let scoresObject=convertToScoresObject(userScoresAll);
            let difficultyLevel=questionData.difficulty.toLowerCase();
            let topicList=questionData.topics.toLowerCase().split(",");
            scoresObject=updateScores(scoresObject,feedbackScore,testcaseScore,topicList,difficultyLevel);
            let recommendQuestions=getRecommendQuestions(scoresObject);
            userScoresAll=convertToScoresArray(scoresObject);
            // questionStatus=updateQuestionsStatus(questionData.difficulty,questionStatus);
            questionStatus=changeQuestionsStatus(questionData.difficulty,questionStatus);
            await updateUserScore(userId,userScoresAll);
            await updateQuestionStatus(userId,questionStatus);
            if(isFullPass){
                await updateQuestionsSolved(userId,questionData.id); 
            }
        }else{
            console.log("could not get user data at model.js");
        }
    }catch (error) {
        console.error('Error setting score:', error);
    }
}

// initialScores using no. of testcases passed 
function intialScores(scoresArray,topicList,testcases,difficultyLevel){
    const totalTestCases=10;
    // console.log("topicList is ",topicList);
    topicList.forEach((topic)=>{
        scoresArray[topic]=Math.ceil(scoresArray[topic]+difficultyWeight[difficultyLevel]*topicWeight[topic]*(testcases/totalTestCases)*10)
    });
    return scoresArray;
}

function getScoreRate(prevScore) {
    const k=0.7;  // k increases, change decreases
    const checkpoint=80; // after 50, points gained decreases significantly
    const attemptLimit=7; // after which insignificant change in score
    // const attemptRate = attemptLimit/attempts; if you want this, return = return * attemptRate
    return  (1 / (1 + Math.exp(k * (prevScore - checkpoint))));
}

function updateScores(scoresArray,feedbackScore,testcaseScore,topicList,difficultyLevel) {
    topicList.forEach((topic)=>{
        const avgScore = (feedbackScore+testcaseScore)/2;
        const topicScoreIncrease = avgScore * topicWeight[topic] * difficultyWeight[difficultyLevel]; 
      	const scoreRate = getScoreRate(scoresArray[topic]);
        scoresArray[topic] = Math.round(scoresArray[topic]+ topicScoreIncrease * scoreRate );
    });
    return scoresArray;
}

export function getTestCaseScore(array,totalTestCases){
    console.log(`testcaseArray inside model is ${array}`);
    let score=0;
    const attempts=array.length;
    // const totalTestCases = 8; // update for each problem
    for(let i=0;i<attempts;i++){
        if(i==0){
          score+=array[i];
      }else{
        array[i]>=array[i-1] ? score+=array[i] : score-=array[i]*2;
      }
    }
    let tentativeScore = Math.round(score*10/Math.exp(0.4 * attempts));
    // console.log(`tentativeScore is ${tentativeScore}`);
    const maximumScore = Math.round(totalTestCases*10/Math.exp(0.4));
    // console.log(`maximumScore is ${maximumScore}`);
    const scoreForTests = Math.round(tentativeScore*totalTestCases/maximumScore);
    // console.log(`scoreForTest is ${scoreForTests}`);
    const scoreIn10 = (scoreForTests/totalTestCases)*10;
    return scoreIn10;
}

/**
 * @returns {topicArray} 
 */
export function getRecommendQuestions(scoresArray){
    let normalizedScores=[];
    let inverseSum=0;
    const values = Object.values(scoresArray);
    const keys = Object.keys(scoresArray);
    console.log(values);
    for(let i=0;i<values.length;i++){
        if(values[i]!=0){
            normalizedScores[i]=1/values[i];
        }else{
            normalizedScores[i]=0;
        }
        inverseSum+=normalizedScores[i];
    }
    const totalSlots=10;
    const scaleFactor = totalSlots / inverseSum;
    for(let i=0;i<normalizedScores.length;i++){
        normalizedScores[i]=Math.round(scaleFactor*normalizedScores[i]);
    }
    let questions = new Object;
    let i=0;
    for(let key in scoresArray){
        questions[key]=normalizedScores[i];
        i++;
    }
    return questions;
}
/**
 * @returns {topicArray} 
 */
export function getRecommendVideos(scoresArray){
    let normalizedScores=[];
    let inverseSum=0;
    const values = Object.values(scoresArray);
    const keys = Object.keys(scoresArray);
    console.log(values);
    for(let i=0;i<values.length;i++){
        if(values[i]!=0){
            normalizedScores[i]=1/values[i];
        }else{
            normalizedScores[i]=0;
        }
        inverseSum+=normalizedScores[i];
    }
    const totalSlots=10;
    const scaleFactor = totalSlots / inverseSum;
    for(let i=0;i<normalizedScores.length;i++){
        normalizedScores[i]=Math.round(scaleFactor*normalizedScores[i]);
    }
    let questions = new Object;
    let i=0;
    for(let key in scoresArray){
        questions[key]=normalizedScores[i];
        i++;
    }
    return questions;
}
// function getRecommendQuestions(scoresArray){
//     let normalizedScores = structuredClone(scoresArray);
//     let sum=0;
//     const totalQuestions=20;
//     for(let key in normalizedScores){
//         sum += normalizedScores[key]
//     }
//     for(let key in normalizedScores){
//         normalizedScores[key]=Math.round((normalizedScores[key]/sum)*totalQuestions);
//     }
//     return normalizedScores;
// }
// function recommendQuestions(scoresArray){
//     let normalizedScores=[];
//      let inverseSum=0;
//     const values = Object.values(scoresArray);
//     const keys = Object.keys(scoresArray);
//     console.log(values);
//     for(let i=0;i<values.length;i++){
//         if(values[i]!=0){
//             normalizedScores[i]=1/values[i];
//         }else{
//             normalizedScores[i]=0;
//         }
//         inverseSum+=normalizedScores[i];
//     }
//     const totalSlots=20;
//     const scaleFactor = totalSlots / inverseSum;
//     for(let i=0;i<normalizedScores.length;i++){
//         normalizedScores[i]=Math.round(scaleFactor*normalizedScores[i]);
//     }
//     let totalQuestions = normalizedScores.reduce((acc, score) => acc + score, 0);
//     let questionsTypes = new Object();
//     for(let i=0;i<normalizedScores.length;i++){
//         questionsTypes[i]=normalizedScores[i];
//     }
//     console.log(questionsTypes)
//      totalQuestions = normalizedScores.reduce((acc, score) => acc + score, 0);
//      console.log("total number of questions is ",totalQuestions);
//      console.log("Topic and No. of Questions recommended");
//      for(let i=0;i<normalizedScores.length;i++){
//         console.log(keys[i],normalizedScores[i]);
//      }
//     //return normalizedScores;
// }
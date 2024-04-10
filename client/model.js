// scoresArray should be stored in the database for each user and is retrieved whenever the user the solves a problem 
import { getUserData } from "@/utils/userDataFetch"
import { updateQuestionsSolved } from "@/utils/updateQuestionsSolved";
import { updateUserScore } from "@/utils/updateUserScore";
import { updateBeginnerStatus } from "@/utils/updateBeginnerStatus";
import { updateProblemCount } from "@/utils/updateProblemCount";

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
    "medium" : 2
}

var topicWeight = {
    "array": 0.1,
    "math":0.2,
    "string": 0.2,
    "hash table":0.3,
    "binary search":0.3,
    "tree": 0.6,
    "graph": 0.6,
    "dynamic programming": 0.7
}
const totalInitialProblems=3;
// let topicList=[]
// let difficultyLevel="";
// let score=0;

//-----------------------------------------------------------------//
//function definitions

function convertToScoresObject(keyValueArray) {
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
            console.log('User data fetched at model.js:',userInfo);
            let scoresObject=convertToScoresObject(userScoresAll);
            let difficultyLevel=questionData.difficulty.toLowerCase();
            let topicList=questionData.topics.toLowerCase().split(",");
            scoresObject=intialScores(scoresObject,topicList,testcases,difficultyLevel);

            userScoresAll=convertToScoresArray(scoresObject) 
            await updateUserScore(userId,userScoresAll);
            // solvedQuestions.push(questionData.id);  
            await updateQuestionsSolved(userId,questionData.id);
            // initialProblemCount++; 
            await updateProblemCount(userId,++initialProblemCount);
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

export async function setScoreOnSubmit(questionData,userId,feedbackScore,testcaseScore,isFullPass) {
    console.log("inside setScoreOnSubmit");
    try{
        let userInfo= await getUserData(userId);
        if(userInfo){
            let solvedQuestions=userInfo.question_solved;
            let userScoresAll=userInfo.scores;
            console.log('User data fetched at model.js:',userInfo);
            let scoresObject=convertToScoresObject(userScoresAll);
            let difficultyLevel=questionData.difficulty.toLowerCase();
            let topicList=questionData.topics.toLowerCase().split(",");
            scoresObject=updateScores(scoresObject,feedbackScore,testcaseScore,topicList,difficultyLevel);
            let recommendQuestions=getRecommendQuestions(scoresObject);
            userScoresAll=convertToScoresArray(scoresObject);
            await updateUserScore(userId,userScoresAll);
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
    console.log("topicList is ",topicList);
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

function getRecommendQuestions(scoresArray){
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
    const totalSlots=20;
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
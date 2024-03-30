// scoresArray should be stored in the database for each user and is retrieved whenever the user the solves a problem 
import { getUserData } from "@/utils/userDataFetch"

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

// let topicList=[]
// let difficultyLevel="";
// let score=0;

//-----------------------------------------------------------------//
//function definitions

function convertToScoresObject(keyValueArray) {
    var arrayOfScores = {};

    for (var i = 0; i < keyValueArray.length; i++) {
        var pair = keyValueArray[i];
        arrayOfScores[pair.name] = pair.score;
    }

    return arrayOfScores;
}
function convertToScoresArray(scoresObject) {
    var keyValueArray = [];
    for (var key in scoresObject) {
        if (scoresObject.hasOwnProperty(key)) {
            keyValueArray.push({ score: scoresObject[key], name: key });
        }
    }

}
export async function setScoreOnSubmit(questionData,userId,userScore) {
    console.log("inside setScoreOnSubmit");
    try{
        let userInfo= await getUserData(userId);
        if(userInfo){
            let solvedQuestions=userInfo.question_solved;
            let userScoresAll=userInfo.scores;
            console.log('User data fetched at model.js:',userInfo);
            let scoresObject=convertToScoresObject(userScoresAll);
            // console.log("inside the model.js file");
            let difficultyLevel=questionData.difficulty.toLowerCase();
            let topicList=questionData.topics.toLowerCase().split(",");
            let score=userScore;
            console.log(`score is ${score}`);
            scoresObject=updateScores(scoresObject,score,topicList,difficultyLevel);
            let recommendQuestions=getRecommendQuestions(scoresObject);

            userScoresAll=convertToScoresArray(scoresObject) // to be updated on database
            solvedQuestions.push(questionData.id);  // to be updated on database
            
        }else{
            console.log("could not get user data at model.js");
        }
    }catch (error) {
        console.error('Error setting score:', error);
    }
}

// initialScores using no. of testcases passed 
function intialScores(scoresArray,topicList,testcases,score){
    const totalTestCases=10;
    for(let i=0;i<topicList.length;i++){
        let currentTopic=topicList[i];
        scoresArray[currentTopic]=Math.round(scoresArray[currentTopic]+(score[currentTopic]*topicWeight[currentTopic]*(testcases/totalTestCases)));
    }
}

function getLearningRate(score) {
    const k=0.7;  // k increases, change decreases
    const checkpoint=50; // after 50, points gained decreases significantly
    return 1 / (1 + Math.exp(k * (score - checkpoint)));
}

function updateScores(scoresArray,score,topicList,difficultyLevel) {
    topicList.forEach((topic)=>{
        const topicScoreIncrease = score * topicWeight[topic] * difficultyWeight[difficultyLevel];
        scoresArray[topic] = (scoresArray[topic]+ topicScoreIncrease * getLearningRate(scoresArray[topic]) * 1);
    }) ;
    return scoresArray;
}

function getRecommendQuestions(scoresArray){
    let normalizedScores = structuredClone(scoresArray);
    let sum=0;
    const totalQuestions=20;
    for(let key in normalizedScores){
        sum += normalizedScores[key]
    }
    for(let key in normalizedScores){
        normalizedScores[key]=Math.round((normalizedScores[key]/sum)*totalQuestions);
    }
    return normalizedScores;
}
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
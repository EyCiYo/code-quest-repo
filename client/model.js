// scoreArray should be stored in the database for each user and is retrieved whenever the user the solves a problem 
var scoresArray = {
    "array": 0,
    "string": 0,
    "tree": 0,
    "graph": 0,
    "dynamic_programming": 0
}

var difficultyWeight = {
    "easy" : 0.1,
    "medium" : 0.2
}

var topicWeight = {
    "array": 0.1,
    "string": 0.2,
    "tree": 0.4,
    "graph": 0.5,
    "dynamic_programming": 0.7
}

var normalizedScores=[]


//-----------------------------------------------------------------//
//function definitions

// // initialScores using no. of testcases passed 
// function intialScores(scoresArray,topicList,testcases,score){
//     const totalTestCases=10;
//     for(let i=0;i<topicList.length;i++){
//         let currentTopic=topicList[i];
//         scoresArray[currentTopic]=Math.round(scoresArray[currentTopic]+(score[currentTopic]*topicWeight[currentTopic]*(testcases/totalTestCases)));
//     }
// }
// initialScores using weights of topics
function intialScores(scoresArray,score){
    for (var key of Object.keys(scoresArray)) {
        // console.log(key + " -> " + p[key])
        scoresArray[key]+=score*topicWeight[key]
    }
}

function recommendQuestions(scoresArray){
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

    let totalQuestions = normalizedScores.reduce((acc, score) => acc + score, 0);
    //  var differnce = totalSlots-totalQuestions;
    //  if(differnce>0){
    //     for(let i=0;i<normalizedScores.length;i++){
    //         normalizedScores[i]++;
    //         differnce--;
    //         if(differnce==0)
    //             break;
    //     }
    //  } 
    //  if(differnce<0){
    //     for(let i=0;i<normalizedScores.length;i++){
    //         normalizedScores[i]--;
    //         differnce++;
    //         if(differnce==0)
    //             break;
    //     }
    //  }
    let questionsTypes = new Object();
    for(let i=0;i<normalizedScores.length;i++){
        questionsTypes[i]=normalizedScores[i];
    }
    console.log(questionsTypes)
     totalQuestions = normalizedScores.reduce((acc, score) => acc + score, 0);
     console.log("total number of questions is ",totalQuestions);
     console.log("Topic and No. of Questions recommended");
     for(let i=0;i<normalizedScores.length;i++){
        console.log(keys[i],normalizedScores[i]);
     }
    //return normalizedScores;

}

function updateScores(scoresArray,topicList,difficultyLevel,score){
    for(let i=0;i<topicList.length;i++){
        let currentTopic=topicList[i];
        scoresArray[currentTopic]=Math.round(scoresArray[currentTopic]+score[currentTopic]*(topicWeight[currentTopic]+difficultyWeight[difficultyLevel]));
    }
}
//-----------------------------------------------------------------//

// Initially we provide a set a programs to evaluate the user's understanding of the data structures and algorithms

const firstScore = {
    "array":30,
    "string":25,
    "tree":14,
    "graph":40,
    "dynamic_programming":30
}
const firstTopicList = ['array','graph','string','tree','dynamic_programming'];

intialScores(scoresArray,firstTopicList,5,firstScore);
intialScores(scoresArray,firstTopicList,6,firstScore);

console.log("recommendation after initial tests");
recommendQuestions(scoresArray);

// User does a couple of problems related to array to improve
var newScore = {
    "array":30
}
var newTopicList = ["array"];
const difficultyLevel = "medium";

updateScores(scoresArray,newTopicList,difficultyLevel,newScore);
updateScores(scoresArray,newTopicList,difficultyLevel,newScore);
updateScores(scoresArray,newTopicList,difficultyLevel,newScore);



console.log("recommendation after solving a couple of problems");

recommendQuestions(scoresArray)
//console.log()
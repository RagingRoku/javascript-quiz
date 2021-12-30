function launchQuiz(){


    // using the backtick to add multi-line HTML/Bootstrap
    //render quiz card
    //added progress bar

    $("#contentArea").html(`
    <div class="d-flex justify-content-center my-2">

        <div class="card ui-widget-content" style="width: 25rem;">
            <div class="card-body">
                <h5 id="questionTitle" class="card-title text-center">Question Number</h5>

                <p id="questionPrompt" class="card-text text-center">Question prompt</p>

                <div id="questionChoices" class="d-flex justify-content-around">
                    <button id="choiceA" type="button" class="btn btn-primary btn-lg">Option A</button>
                    <button id="choiceB" type="button" class="btn btn-primary btn-lg">Option B</button>
                    <button id="choiceC" type="button" class="btn btn-primary btn-lg">Option C</button>
                </div>


            </div>
        </div>
    </div>
    <p id="scoreArea" class="h5 text-center"> Score :  </p>
    `)
    // add progress section to HTML
    $("#progressArea").prepend(
        `
        <p class="h5 text-center">Progress: </p>
        `
    )
    // add dialog box to let the user know if they were right or wrong

    //initialize score
    let userScore = 0;

    //greet user
    let userName = window.prompt("What is your name?");

    

    //update user score
    function renderScore(){
        // format ${} in order to access variables in template Strings (the backticks)
        $("#scoreArea").html(`
        <p id="scoreArea" class="h5 text-center"> ${userName}'s Score: ${userScore}</p>
        `)

    }

    //render progress bar
    function renderProgress(){

        $( "#quizProgressbar" ).progressbar(
            {
            value: 0,
            max: 100
        }
        ); // close progressbar() call
    } // close renderProgress

    //update progress bar
/*
    function updateProgress(currentProgress){
        $( "#progressbar" ).progressbar("value", currentProgress);
        console.log("currentProgress in updateProgress() was: " + currentProgress);

    }
*/
    //render curent question  
    function renderQuestion(QuestionNumber){  

        //question title (will be looped)
        $("#questionTitle").html(`
        <h5 id="questionTitle" class="card-title text-center">Question Number ${Number(QuestionNumber) + 1}</h5>
        `)

        //questions prompt (will have index replaced by loop)
        $("#questionPrompt").html(`
        <p id="questionPrompt" class="card-text text-center">${questions[QuestionNumber].prompt}</p>
        `
        )

        $("#questionChoices").html(`
            <div id="questionChoices" class="d-flex justify-content-around">
                <button id="choiceA" type="button" class="btn btn-primary btn-lg">${questions[QuestionNumber].choices[0]}</button>
                <button id="choiceB" type="button" class="btn btn-primary btn-lg">${questions[QuestionNumber].choices[1]}</button>
                <button id="choiceC" type="button" class="btn btn-primary btn-lg">${questions[QuestionNumber].choices[2]}</button>
            </div>
        `
        )
        if(Number(QuestionNumber+1) === 3){
            $("#contentArea").append(`
            <p class="h5 text-center"> Hint:  </p>
            <div class="d-flex justify-content-center">
                <p>Date: <input type="text" id="datepicker"></p>
            </div>
            `)
            
            $( function() {
                $( "#datepicker" ).datepicker({
                  showOn: "button",
                  buttonImage: "images/calendar.gif",
                  buttonImageOnly: true,
                  buttonText: "Select date"
                });
            });
        }


        //let the user enter an answer

        // data can only be passed as an object, then accessed in the function
        // usage $("selectorID_or_class").click({param1: "Hello", param2: "World"}, the_function);
        
        //arguments: choiceMade based on which button user clicks
        //          questions[QuestionNumber].correctChoice to compare in function since QuestionNumber is outside scope
        $("#choiceA").click({choiceMade: "A", answer: questions[QuestionNumber].correctChoice}, checkQuizChoice);
        $("#choiceB").click({choiceMade: "B", answer: questions[QuestionNumber].correctChoice}, checkQuizChoice);
        $("#choiceC").click({choiceMade: "C", answer: questions[QuestionNumber].correctChoice}, checkQuizChoice);  

        //listeners for progressbar
        $(".btn").click(
            function() {
                // increase the displayed progress
                let currentVal = $( "#quizProgressbar" ).progressbar( "option", "value" );
                currentVal = (Math.round((Number(QuestionNumber+1)/questions.length)*100));
                console.log( "currentVal for progressbar is: " + currentVal );
                console.log( "QuestionNumber progressbar is: " + (QuestionNumber+1) );
                console.log( "questions.length progressbar is: " + questions.length );


                if (currentVal > 100) {
                    currentVal = 100;
                    }
                $( "#quizProgressbar" ).progressbar( "option", "value", currentVal );

            }

        )

    }

    //local to launchQuiz()
    function checkQuizChoice(event){
        let userAnswer = event.data.choiceMade;
        let rightAnswer = event.data.answer;
        if (
            userAnswer === rightAnswer.toLowerCase() ||
            userAnswer === rightAnswer.toUpperCase()
            ){
//            window.alert("that's right!");
            $( "#dialogCorrect" ).dialog( "open" );

            userScore ++;
            }
        else{
            //window.alert("oh no! That's wrong! The answer was: " + rightAnswer);
            $( "#dialogWrong" ).html( "The correct answer was: " + rightAnswer);
            $( "#dialogWrong" ).dialog( "open" );
            }
        

        //update score
        //either way, move on to next question afterwards
        nextQuestion();
        renderScore();

    }

    let looper = 0;

    function nextQuestion(){
        if(looper < questions.length){

            //update percent finished

            //render question
            renderQuestion(looper);

            // increment loop
            looper++;
        }
        else{
            quizDone();
        }
    }


    //render first question and score
    nextQuestion();
    renderScore();
    renderProgress();
    //make the card draggable
    $( function() {
        $( ".card" ).draggable();
      } );


    function quizDone(){
        $("#contentArea").html(`
        <p class="h5 text-center"> That's it for the quiz!</p>
        <p id="scoreArea" class="h5 text-center"> Score :  </p>
        `)
        renderScore();
    }

}



// id startQuizButton
// click listener, can call function and pass data
// .click( [eventData ], handler )
// passes to buttonPressed()
/**
 * NOTE: when making the function call, DO NOT include empty () otherwise the event is run w/o clicking
 * Documentation shows function(), very confusing
 */
$("#startQuizButton").click(launchQuiz);



//questions JS Object array

let questions = [
    {
        prompt:"What was Harry Potter's last name?",
        choices: ["A: Smith", "B: Radcliffe", "C: Potter"],
        correctChoice: "C"
    },
    {
        prompt:"How many earth-shattering Tremor films are there?",
        choices: ["A: 5", "B: 7", "C: 3"],
        correctChoice: "B"
    },
    {
        prompt:"What year is it!?",
        choices: ["A: 2021?", "B: 2020?", "C: I don't know"],
        correctChoice: "A"
    }
    ]; /* end on array closing bracket instead of object closing curly*/
    


/** old testing code  */
/* function to execute when startQuizButton is pressed */
function buttonPressed(){
    console.log("That button was pressed alright!");
    $("#contentArea").append("Here is some new HTML content generated by the button!")

// using the backtick to add multi-line HTML/Bootstrap
    $("#contentArea").append(`
    <p class="h5 text-center">Getting fancy now </p>
    `)
}

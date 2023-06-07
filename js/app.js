// Pulse animation functions

const pulseAnimationOn = () => {
    const pulse = document.querySelector('.pulse');
    const pulseAnimation = pulse.querySelectorAll('span');

    pulseAnimation.forEach(span => {  
        span.classList.add('pulse-active');
    }); 
}

const pulseAnimationOff = () => {
    const pulse = document.querySelector('.pulse');
    const pulseAnimation = pulse.querySelectorAll('span');

    pulseAnimation.forEach(span => {
        span.classList.remove('pulse-active');    
    }); 
}

// function to turn on box shadow animation
function boxShadowAnimationOn() {
    const textToSpeechArea = document.querySelector('.text-to-speech-area');
    textToSpeechArea.classList.add('box-shadow');
}

// function to turn off box shadow animation
function boxShadowAnimationOff() {
    const textToSpeechArea = document.querySelector('.text-to-speech-area');
    textToSpeechArea.classList.remove('box-shadow');
}


// TEXT TO SPEECH function
const textToSpeech = (text) => {
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text)); 
}

// Speaker button functionality
function speakerFunctionality() {
    const speaker = document.querySelector('.speaker');

    speaker.addEventListener('click', () => {
        const aiResponse = document.querySelector('.ai-response'); 
        const text = aiResponse.textContent;
        textToSpeech(text);
}
)};

// Typewriter effect function
async function typeText(text) {
    const aiResponse = document.querySelector('.ai-response'); 
    aiResponse.innerHTML = "";
    return new Promise((resolve) => {
        let index = 0;
    
        let interval = setInterval(() => {
          if (index < text.length) {
            pulseAnimationOn(); // Indicate that the AI is speaking
            aiResponse.innerHTML += text.charAt(index);
            index++;
            aiResponse.scrollTop = aiResponse.scrollHeight; // Scroll to bottom of textarea automatically
          } else {
            speakerFunctionality(); // Once the AI is done speaking, allow the user to click the speaker icon to hear the response again
            pulseAnimationOff();
            clearInterval(interval);
            setTimeout(resolve, 2000); // Wait 2 seconds before resolving
          }
    }, 50);
    });
}

// Form validation makes sure at least one question is filled out before beginning the interview

function validateForm() {
    const form = document.querySelector('.question-form');
    const inputs = form.querySelectorAll('.questions-area');
    const beginInterviewButton = document.querySelector('.begin-interview');

    beginInterviewButton.addEventListener('click', (event) => {
        let isFilled = false;

        inputs.forEach((input) => {
            if (input.value.trim() !== '') {
            isFilled = true;
            }
        });

        if (!isFilled) {
            event.preventDefault();
            alert('Please fill at least one question before beginning the interview.');
        } else {
            beginInterview();   
        }
    });
}

const interviewQuestions = [];
var interviewAnswers;

// Begin interview button functionality
async function beginInterview() {

    //grab the data from the form
    const form = document.querySelector('.question-form');
    const inputs = form.querySelectorAll('.questions-area');
    const beginInterviewButton = document.querySelector('.begin-interview');
    const textToSpeechArea = document.querySelector('.text-to-speech');
    
    inputs.forEach((input) => {
        if (input.value.trim() !== '') {
            interviewQuestions.push(input.value);
        }
    });

    interviewAnswers = [interviewQuestions.length];

    //hide the form
    form.classList.add('hide');
    textToSpeechArea.classList.remove('hide');
    beginInterviewButton.classList.add('hide');

    var currentQuestionIndex = 0;
    console.log(interviewQuestions.length);
    while (currentQuestionIndex < interviewQuestions.length) {
        displayNextQuestion(currentQuestionIndex);
        var currentAnswer = await listenForUserResponse();
        interviewAnswers[currentQuestionIndex] = currentAnswer;
        currentQuestionIndex++;
    }

    console.log(interviewAnswers);
}



// This function listens for the user's response and auto updates the textarea
// It returns the user's response as a string
async function listenForUserResponse() {
    return new Promise((resolve, reject) => {

        const speechText = document.querySelector('.text-to-speech-area');
        const sumbitBtn = document.querySelector('.sumbit-ans-btn');

        var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        var recognition = new SpeechRecognition();
        recognition.continuous = true; // Allows the user to speak for as long as they want
        recognition.start();
        boxShadowAnimationOn();

        // Listen for user response and auto update the textarea
        var transcript;
        recognition.addEventListener('result', e => {
            transcript = Array.from(e.results)
            .map(result => result[0])
            .map(result => result.transcript);
            speechText.value = transcript;
            speechText.scrollTop = speechText.scrollHeight; // Scroll to bottom of textarea automatically
        })

        // Once the user clicks the submit button, stop listening and turn off the box shadow animation
        sumbitBtn.addEventListener('click', () => { 
           
            recognition.stop();
            boxShadowAnimationOff();
            let output = transcript.join(''); // Convert the transcript array into a string
            speechText.value = ""; // Clear the textarea
            resolve(output);
        });
      });
}

async function displayNextQuestion(currentQuestionIndex) {
    typeText(interviewQuestions[currentQuestionIndex]);
}




const startUp =  async () => {
    await typeText("Hello, welcome to InterviewMentor. "); // Please enter the questions you would like to practice! \nYou may add up to 5 questions below. When you are ready to begin, click the begin interview button.");

    
}

startUp();
validateForm();


/*
    while(there are still questions){
        display the first question
        then
        listen for the user's response and turn on the box shadow animation
        user will press the button to submit their response
    }
    
    display the next question




*/ 

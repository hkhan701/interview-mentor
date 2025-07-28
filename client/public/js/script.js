const aiResponse = document.querySelector('.ai-response');

// Pulse animation functions
const pulseAnimation = document.querySelector('.pulse').querySelectorAll('span');

const pulseAnimationOn = () => {
    pulseAnimation.forEach(span => {  
        span.classList.add('pulse-active');
    }); 
}

const pulseAnimationOff = () => {
    pulseAnimation.forEach(span => {
        span.classList.remove('pulse-active');    
    }); 
}

// box shadow animation functions
const textToSpeechArea = document.querySelector('.text-to-speech-area');
function boxShadowAnimationOn() {   
    textToSpeechArea.classList.add('box-shadow');
}
function boxShadowAnimationOff() {
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
        const text = aiResponse.textContent;
        textToSpeech(text);
    }
)};

// Typewriter effect function
async function typeText(text) {
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

// Accepts a question and answer and returns the AI's feedback
async function getAIFeedback(question, answer) {
    const response = await fetch('https://interview-mentor-backend.vercel.app/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: `Based on the interview question: ${question}, give feedback on the following answer and a score out of 10 (formatted as Feedback: \nScore:): ${answer}`
        })
    })

    if(response.ok){
        const data = await response.json();
        console.log(data.response);
        return data.response;
    } else {
        const err = await response.text();
        console.log(err);
        aiResponse.textValue = "Something went wrong";
    }
}

let interviewQuestions = [];
let interviewAnswers;

// Begin interview button functionality
async function beginInterview() {

    //grab the data from the form
    const form = document.querySelector('.question-form');
    const inputs = form.querySelectorAll('.questions-area');
    const beginInterviewButton = document.querySelector('.begin-interview');
    const textToSpeechArea = document.querySelector('.text-to-speech');
    const autofillButton = document.querySelector('.auto-fill');
    const submitBtn = document.querySelector('.sumbit-ans-btn');
    
    // Only add the questions that have been filled out to the interviewQuestions array
    inputs.forEach((input) => {
        if (input.value.trim() !== '') {
            interviewQuestions.push(input.value);
        }
    });

    //hide the form
    form.classList.add('hide');
    textToSpeechArea.classList.remove('hide');
    beginInterviewButton.classList.add('hide');
    autofillButton.classList.add('hide');

    var currentQuestionIndex = 0;
    interviewAnswers = [interviewQuestions.length];

    let finalFeedback = "";

    while (currentQuestionIndex < interviewQuestions.length) {
        await displayNextQuestion(currentQuestionIndex);
        let answer = await listenForUserResponse();
        
        // Update button text while getting AI feedback
        submitBtn.innerHTML = "Submitting, please wait...";
        submitBtn.disabled = true;
        
        let currentFeedback = await getAIFeedback(interviewQuestions[currentQuestionIndex], answer);
        
        // Reset button text
        submitBtn.innerHTML = "Submit Answer";
        submitBtn.disabled = false;
        
        finalFeedback += "\n\nQ" + (currentQuestionIndex+1) + ". \n" + interviewQuestions[currentQuestionIndex] + "\n\nA" + (currentQuestionIndex+1) + ". \n" + answer + "\n\n"
         +currentFeedback;
        console.log(currentQuestionIndex + ": " + answer);   
        interviewAnswers[currentQuestionIndex] = answer;
        currentQuestionIndex++;
    }

    // Final screen to display the AI's feedback
    const aiText = document.querySelector('.ai-text');
    aiText.setAttribute("style", "height: 30rem");
    textToSpeechArea.classList.add('hide');
    
    await typeText("Thank you for using InterviewMentor. Here are your results:\n" + finalFeedback);
}

// returns 5 random questions from the AI
async function getAutoFillQuestions() {
    const response = await fetch('https://interview-mentor-backend.vercel.app/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: `Generate 5 job interview questions. Ensure they are numbered 1 to 5.`
        })
    })

    if(response.ok){
        const data = await response.json();
        console.log(data.response);
        return data.response;
    } else {
        const err = await response.text();
        console.log(err);
        aiResponse.textValue = "Something went wrong";
    }
}

// Autofill button functionality
async function autofillQuestions() {
    const inputs = document.querySelectorAll('.questions-area');
    const autofillButton = document.querySelector('.auto-fill');

    autofillButton.addEventListener('click', async () => {
        //change the autofill button to say loading...
        autofillButton.innerHTML = "Loading...";
        let autofillQuestions = await getAutoFillQuestions();
        
        let arrayOfQuestions = autofillQuestions.split(/\d+\.\s+/).slice(1); // Split based on numbers followed by a dot and optional space
        autofillButton.innerHTML = "Auto-fill Questions";

        inputs.forEach((input, index) => {
            input.value = arrayOfQuestions[index];
        });
    });
}

// This function listens for the user's response and auto updates the textarea
// It returns the user's response as a string
async function listenForUserResponse() {
    return new Promise((resolve) => {

        const speechText = document.querySelector('.text-to-speech-area');
        speechText.value = "";
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
            let output = speechText.value;
            resolve(output);
        });
      });
}

async function displayNextQuestion(currentQuestionIndex) {
    await typeText(interviewQuestions[currentQuestionIndex]);
}

const startUp =  async () => {
    await typeText("Hello, welcome to InterviewMentor. Please enter the questions you would like to practice! \nYou may add up to 5 questions below. When you are ready to begin, click the begin interview button.");
}

startUp();
autofillQuestions();
validateForm();
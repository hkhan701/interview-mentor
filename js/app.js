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
function typeText(element, text) {
    element.innerHTML = "";
    return new Promise((resolve) => {
        let index = 0;
    
        let interval = setInterval(() => {
          if (index < text.length) {
            pulseAnimationOn(); // Indicate that the AI is speaking
            element.innerHTML += text.charAt(index);
            index++;
            element.scrollTop = element.scrollHeight; // Scroll to bottom of textarea automatically
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



const startUp =  async () => {
    const aiResponse = document.querySelector('.ai-response'); 
    await typeText(aiResponse, "Hello, welcome to InterviewMentor. Please enter the questions you would like to practice! \nYou may add up to 5 questions below. When you are ready to begin, click the begin interview button.");
}

startUp();
validateForm();

const questions = [];
// Begin interview button functionality
function beginInterview() {

    //grab the data from the form
    const form = document.querySelector('.question-form');
    const inputs = form.querySelectorAll('.questions-area');
    const beginInterviewButton = document.querySelector('.begin-interview');
    const textToSpeechArea = document.querySelector('.text-to-speech');
    const aiResponse = document.querySelector('.ai-response');
    const speechText = document.querySelector('.text-to-speech-area');
    
    inputs.forEach((input) => {
        if (input.value.trim() !== '') {
            questions.push(input.value);
        }
    });

    //hide the form
    form.classList.add('hide');
    textToSpeechArea.classList.remove('hide');
    beginInterviewButton.classList.add('hide');

    //display the first question
    typeText(aiResponse, questions[0]);

    var speech = true;
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.interimResults = true;

    recognition.addEventListener('result', e => {
        const transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript);
        speechText.value = transcript;
    })           

    if(speech){
        recognition.start();
    }


    console.log(questions);


}
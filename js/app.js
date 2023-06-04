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

const beginInterview = document.querySelector('.begin-interview');

beginInterview.addEventListener('click', () => {
    textToSpeech("Hello, welcome to InterviewMentor. Please enter the questions you would like to practice! You may add up to 5 questions below.");
});


// Mute button functionality

const muteFunctionality = () => {
const muteButton = document.querySelector('.pulse');
    muteButton.addEventListener('click', () => {

        if (muteButton.classList.contains('pulse-mute')) {

            muteButton.classList.remove('pulse-mute');
            pulseAnimationOff();

        } else {

            muteButton.classList.add('pulse-mute');
            window.speechSynthesis.cancel();  
            pulseAnimationOff();
            
        }
    });
}

// TEXT TO SPEECH function

const textToSpeech = (text) => {


    const muteButton = document.querySelector('.pulse');

    if (muteButton.classList.contains('pulse-mute')) { // if mute button is on, do not speak
        return;
    }

    pulseAnimationOn(); // pulse animation on

    // We output the text to the textarea
    const aiResponse = document.getElementById('response'); 
    aiResponse.value = text;

    // We speak the text
    const utterance = new SpeechSynthesisUtterance(text);  
    window.speechSynthesis.speak(utterance);

    utterance.onend = function (event) { // pulse animation off once speech ends
        pulseAnimationOff();
    };
}

textToSpeech("Hello, welcome to InterviewMentor. Please enter the questions you would like to practice! You may add up to 5 questions below.");
muteFunctionality();







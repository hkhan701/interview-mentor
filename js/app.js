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

function typeText(element, text) {
    element.innerHTML = "";
    return new Promise((resolve) => {
        let index = 0;
    
        let interval = setInterval(() => {
          if (index < text.length) {
            pulseAnimationOn();
            element.innerHTML += text.charAt(index);
            index++;
          } else {
            pulseAnimationOff();
            clearInterval(interval);
            setTimeout(resolve, 2000);
          }
    
    }, 50);
    });
}

const startUp =  async () => {
    const aiResponse = document.getElementById('response'); 
    await typeText(aiResponse, "Hello, welcome to InterviewMentor. Please enter the questions you would like to practice! You may add up to 5 questions below.");
    await typeText(aiResponse, "When you are ready to begin, click the begin interview button.");
}

startUp();

const beginInterview = document.querySelector('.begin-interview');

beginInterview.addEventListener('click', () => {
    
});

// Mute button functionality

// const muteFunctionality = () => {
//     const muteButton = document.querySelector('.pulse');
//     muteButton.addEventListener('click', () => {

//         if (muteButton.classList.contains('pulse-mute')) {
//             muteButton.classList.remove('pulse-mute');
//             pulseAnimationOff();

//         } else {

//             muteButton.classList.add('pulse-mute');
//             window.speechSynthesis.cancel();  
//             pulseAnimationOff();

//         }
//     });
// }


// const aiResponse = document.getElementById('response'); 
// typeText(aiResponse, "Hi, my name is Hassan.");




// TEXT TO SPEECH function

// const textToSpeech = (text) => {

//     const muteButton = document.querySelector('.pulse');
//     window.speechSynthesis.cancel();

//     // We output the text to the textarea
//     const aiResponse = document.getElementById('response'); 
//     typeText(aiResponse, text);

//     // if (aiResponse.value.trim() === "") {
//     //     return; // Exit the function if there is no text
//     // }

//     // We speak the text
//     const utterance = new SpeechSynthesisUtterance(text);  
//     if (!muteButton.classList.contains('pulse-mute')) { // if mute button is off,speak     
//         window.speechSynthesis.volume = 1; // 0 to 1
//     } 

//     window.speechSynthesis.speak(utterance); 
//     pulseAnimationOn();

//       utterance.onend = function (event) {
//         pulseAnimationOff();
//       };

//       return new Promise((resolve) => {
//         utterance.onend = resolve;
//       });
// }
const aiResponse = document.getElementById('response');
const btnArea = document.getElementById('btn');




const pulseAnimation = () => {

    const pulse = document.querySelector('.pulse');
    const pulseAnimation = pulse.querySelectorAll('span');

    pulse.addEventListener('click', () => {
        pulseAnimation.forEach(span => {
            span.classList.toggle('pulse-active');
        }); 
    });
}

pulseAnimation();


btnArea.addEventListener('click', () => {
    const utterance = new SpeechSynthesisUtterance(aiResponse.value);
    window.speechSynthesis.speak(utterance);
});

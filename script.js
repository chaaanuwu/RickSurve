document.addEventListener('DOMContentLoaded', function () {
    let currentQuestionIndex = 0;
    let questions = [];

    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questions = data.questions;
            loadQuestion(currentQuestionIndex);
        })
        .catch(error => console.error('Error loading questions:', error));

    function loadQuestion(index) {
        const questionContainer = document.getElementById("question-container");
        const nextBtn = document.getElementById("next-btn");

        const questionData = questions[index];

        questionContainer.innerHTML = ''; // Clear previous question content

        const questionHTML = `
    <div class="form-group">
        <label>${questionData.question}</label>
        ${questionData.options.map((option, i) => {
            const inputId = `q${index + 1}-${i + 1}`;
            return `
                <div class="radio-option">
                    <input type="radio" id="${inputId}" name="q${index + 1}" value="${i + 1}"><span class="radio-label">${option}</span>
                </div>
            `;
        }).join('')}
    </div>
`;


        questionContainer.innerHTML = questionHTML;

        // If it's the last question, change button to Submit
        if (index === questions.length - 1) {
            nextBtn.textContent = 'Submit';
            nextBtn.onclick = submitForm;
        } else {
            nextBtn.onclick = () => {
                currentQuestionIndex++;
                loadQuestion(currentQuestionIndex);
            };
        }
    }

    // Handle form submission
    function submitForm() {
        // Clear the form container
        const formContainer = document.getElementById("form-container");
        if (!formContainer) {
            console.error('Form container not found!');
            return;
        }

        formContainer.innerHTML = ''; // Clear previous content
        formContainer.style.position = 'fixed';
        formContainer.style.all = 'unset';  // Removes all styles

        // Create a new div for the thank you message
        const thankYouMessage = document.createElement('div');
        thankYouMessage.style.textAlign = 'center';
        thankYouMessage.style.position = 'fixed';
        thankYouMessage.style.top = 0;
        thankYouMessage.style.left = 0;
        thankYouMessage.style.width = '100%';
        thankYouMessage.style.height = '100%';
        thankYouMessage.style.zIndex = 9999;

        // Create the video element
        const videoElement = document.createElement('video');
        videoElement.autoplay = true;
        videoElement.loop = true;
        videoElement.playsInline = true;
        videoElement.muted = false;
        videoElement.controls = false;

        // Set the video to full-screen size
        videoElement.style.width = '100vw';
        videoElement.style.height = '100vh';
        videoElement.style.objectFit = 'cover';

        // Create the video source element
        const videoSource = document.createElement('source');
        videoSource.src = 'https://shattereddisk.github.io/rickroll/rickroll.mp4';
        videoSource.type = 'video/mp4';

        // Append the source to the video element
        videoElement.appendChild(videoSource);

        // If video cannot load, show an alternate message
        videoElement.onerror = function () {
            thankYouMessage.innerHTML = '<h1 style="display: flex; justify-content: center; align-items: center; height: 100%;">Thank you for your feedback!</h1>';
        };

        // Append the video element to the thank you message div
        thankYouMessage.appendChild(videoElement);

        // Append the thank you message div to the form container
        formContainer.appendChild(thankYouMessage);
    }
});
document.addEventListener("DOMContentLoaded", function() {

    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-cards");

    //check username is valid or not.
    function validateUsername(username){
        if(username.trim() === "") {
            alert("Please enter a valid username.");
            return false;
        }

        const regex = /^[a-zA-Z0-9_]{1,16}$/;
        const isMatching = regex.test(username);
        if(!isMatching){
            alert("Invalid Username");
        }

        return isMatching;
    }

    async function fetchUserDetails(username){
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;

        try{
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;

            const response = await fetch(url);
            if(!response.ok){
                throw new Error("Unable to fetch uer details");
            }
            const data = await response.json();
            //console.log("Logging data:", data);

            displayUserData(data);
        }
        catch(error){
            statsContainer.innerHTML = `<p>No Data found</p>`;
        }
        finally{
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    function updateProgress(solved, total, label, circle){
        const progressDegree = (solved / total) * 100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved} / ${total}`;

    }

    function displayUserData(data){
        const displayUsername = document.getElementById("display-username");
        displayUsername.textContent = `Stats for @${usernameInput.value}`;

        document.querySelector(".progress").style.display = "flex";

        const totalHardQuestions = data.totalHard;
        const totalMediumQuestions = data.totalMedium;
        const totalEasyQuestions = data.totalEasy;
        const easySolved = data.easySolved;
        const mediumSolved = data.mediumSolved;
        const hardSolved = data.hardSolved;
        const totalSolved = data.totalSolved;
        const totalQuestions = data.totalQuestions;
        const Rank = data.ranking;
        const AcceptanceRateOfSolution = data.acceptanceRate;

        updateProgress(easySolved, totalEasyQuestions, easyLabel, easyProgressCircle);
        updateProgress(mediumSolved, totalMediumQuestions, mediumLabel, mediumProgressCircle);
        updateProgress(hardSolved, totalHardQuestions, hardLabel, hardProgressCircle);

        const cardData = [
            {label: "Questions", value: `${totalSolved} / ${totalQuestions}`},
            {label: "Easy Level", value: `${easySolved} / ${totalEasyQuestions}`},
            {label: "Medium Level", value: `${mediumSolved} / ${totalMediumQuestions}`},
            {label: "Hard Level", value: `${hardSolved} / ${totalHardQuestions}`},
            {label: "World Rank", value: Rank},
            {label: "Acceptance Rate", value: AcceptanceRateOfSolution},
        ];

        //console.log("Card Data:", cardData);

        cardStatsContainer.innerHTML = cardData.map(
            data => {
                return `
                        <div class="card">
                         <h4>${data.label}</h4>
                         <p>${data.value}</p>
                        </div>`
            }
        ).join("");
    }

    //Adding click event to search button
    searchButton.addEventListener("click", function() {
        const username = usernameInput.value; 
        //console.log("Loggin Username:", username);
        
        if(validateUsername(username)){
            fetchUserDetails(username);
        }
    })
})
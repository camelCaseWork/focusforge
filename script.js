var weatherapiKey = '2109a286fa82450ea55102613250506';
var city = 'Bhopal'
function openCards() {
    let allelem = document.querySelectorAll('.elem');
    let fullelem = document.querySelectorAll(".fullelem");
    let back = document.querySelectorAll(".back");
    let nav = document.querySelector("nav"); // Select the nav bar
    let allelemsSection = document.querySelector(".allelems"); // Select the landing page section

    // Ensure landing page and nav are visible, and all fullelem sections are hidden on page load
    window.addEventListener('load', () => {
        allelemsSection.style.display = 'block'; // Show landing page
        nav.style.display = 'block'; // Show nav bar
        fullelem.forEach((elem) => {
            elem.style.display = 'none'; // Hide all inner pages
        });
    });

    allelem.forEach((elem) => {
        elem.addEventListener('click', () => {
            fullelem[elem.id].style.display = 'block'; // Show the inner page
            allelemsSection.style.display = 'none'; // Hide the landing page
            nav.style.display = 'none'; // Hide the nav bar
        });
    });

    back.forEach((btn) => {
        btn.addEventListener('click', () => {
            allelem.forEach((elem) => {
                fullelem[elem.id].style.display = 'none'; // Hide all inner pages
            });
            allelemsSection.style.display = 'block'; // Show the landing page
            nav.style.display = 'block'; // Show the nav bar
        });
    });
}
openCards();

function todoList() {
    let form = document.querySelector('.addtask form');
    let formInput = document.querySelector('.addtask form input');
    let textarea = document.querySelector('.addtask form textarea');
    let currentTask = [];

    try {
        const stored = localStorage.getItem('currentTask');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
                currentTask = parsed;
            } else {
                console.warn("Invalid data, resetting...");
                localStorage.removeItem('currentTask');
                currentTask = [];
            }
        }
    } catch (err) {
        console.error("Failed to parse localStorage data:", err);
        localStorage.removeItem('currentTask');
        currentTask = [];
    }
    renderTask();
    function renderTask() {
        let allTask = document.querySelector(".alltask");
        let sum = '';
        currentTask.forEach((elem, idx) => {
            sum += `<div class="task">
                    <div class="task-header">
                        <h5>${elem.task}</h5>
                        <button class="toggle-details" data-index="${idx}">
                            <i class="ri-arrow-down-s-line"></i>
                        </button>
                        <div class="details hidden" id="details-${idx}">
                            <p>${elem.details}</p>
                        </div>
                    </div>
                    <button class="complete" data-index="${idx}">Mark As Completed</button>
                </div>`;
        });
        allTask.innerHTML = sum;

        // Toggle detail buttons
        document.querySelectorAll(".toggle-details").forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = btn.dataset.index;
                const detailEl = document.getElementById(`details-${idx}`);
                detailEl.classList.toggle("hidden");
                btn.querySelector("i").classList.toggle("ri-arrow-down-s-line");
                btn.querySelector("i").classList.toggle("ri-arrow-up-s-line");
            });
        });

        // ✅ Mark as Completed buttons
        document.querySelectorAll(".complete").forEach(btn => {
            btn.addEventListener('click', () => {
                const index = btn.dataset.index;
                currentTask.splice(index, 1);
                localStorage.setItem('currentTask', JSON.stringify(currentTask));
                renderTask(); // Re-render the list
            });
        });
    }
    renderTask();
    form.addEventListener('submit', (dets) => {
        dets.preventDefault();
        currentTask.push({ task: formInput.value, details: textarea.value });
        localStorage.setItem('currentTask', JSON.stringify(currentTask))
        formInput.value = '';
        textarea.value = '';
        renderTask();
    })
}
todoList();

function dailyPlanner() {
    let hrs = Array.from({ length: 18 }, (elem, idx) => `${6 + idx}:00 - ${7 + idx}:00`);

    let dayPlanData = JSON.parse(localStorage.getItem('dayPlanData')) || {};
    let dayPlanner = document.querySelector('.dayPlanner');
    // let dayPlannerInput = document.querySelectorAll('.dayPlanner input');

    let wholeDaySum = '';

    hrs.forEach((elem, idx) => {
        let savedData = dayPlanData[idx] || "";
        wholeDaySum += `<div class="dayPlannerTime">
                    <p>${elem}</p>
                    <input id=${idx} type="text" placeholder="..." value=${savedData}>
                </div>`
    });


    dayPlanner.innerHTML = wholeDaySum;

    let dayPlannerInput = document.querySelectorAll('.dayPlanner input'); // move here

    dayPlannerInput.forEach((elem) => {
        elem.addEventListener('input', () => {
            dayPlanData[elem.id] = elem.value;
            localStorage.setItem('dayPlanData', JSON.stringify(dayPlanData));
        });
    });
}

dailyPlanner();

function motivation() {
    async function fetchQuote() {
        try {
            const response = await fetch("https://api.allorigins.win/raw?url=https://zenquotes.io/api/random");
            const data = await response.json();
            let quote = data[0].q;
            let author = data[0].a;
            document.querySelector(".motivation-2 h1").innerHTML = quote;
            document.querySelector(".motivation-3 h2").innerHTML = author;
        }
        catch (error) {
            console.error("Error fetching quote:", error);
        }
    }
    fetchQuote();
}
motivation();

function pomodoroTimer() {
    let currentTimer = 'pomodoro';
    let totalSeconds = 25 * 60;

    let timer1 = document.querySelector('.pomoTimer h1');
    let shortTimer1 = document.querySelector('.shortTimer h1');
    let longTimer1 = document.querySelector('.longTimer h1');

    let pomoTimer = document.querySelector('.pomoTimer');
    let shortTimer = document.querySelector('.shortTimer');
    let longTimer = document.querySelector('.longTimer');

    let pomobtn = document.querySelector('.pomodoroBtn');
    let shortbtn = document.querySelector('.shortBtn');
    let longbtn = document.querySelector('.longBtn');

    let intervalId = null;

    function updateTime() {
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;
        let timeString = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

        if (currentTimer === 'pomodoro') {
            timer1.innerHTML = timeString;
        } else if (currentTimer === 'short') {
            shortTimer1.innerHTML = timeString;
        } else if (currentTimer === 'long') {
            longTimer1.innerHTML = timeString;
        }
    }

    function timeInterval() {
        if (intervalId === null) {
            intervalId = setInterval(() => {
                if (totalSeconds > 0) {
                    totalSeconds--;
                    updateTime();
                } else {
                    clearInterval(intervalId);
                    intervalId = null;
                }
            }, 1000);
        }
    }

    function pauseInterval() {
        clearInterval(intervalId);
        intervalId = null;
    }

    function resetInterval() {
        clearInterval(intervalId);
        intervalId = null;

        if (currentTimer === 'pomodoro') {
            totalSeconds = 25 * 60;
        } else if (currentTimer === 'short') {
            totalSeconds = 5 * 60;
        } else if (currentTimer === 'long') {
            totalSeconds = 15 * 60;
        }

        updateTime();
    }

    // Button click delegation
    document.querySelector('.mainBox').addEventListener('click', (e) => {
        if (e.target.classList.contains('startTimer')) {
            timeInterval();
        } else if (e.target.classList.contains('pauseTimer')) {
            pauseInterval();
        } else if (e.target.classList.contains('resetTimer')) {
            resetInterval();
        }
    });

    // Mode switch buttons
    pomobtn.addEventListener('click', () => {
        clearInterval(intervalId);
        intervalId = null;
        currentTimer = 'pomodoro';
        totalSeconds = 25 * 60;
        updateTime();

        pomoTimer.style.display = 'block';
        shortTimer.style.display = 'none';
        longTimer.style.display = 'none';
    });

    shortbtn.addEventListener('click', () => {
        clearInterval(intervalId);
        intervalId = null;
        currentTimer = 'short';
        totalSeconds = 5 * 60;
        updateTime();

        pomoTimer.style.display = 'none';
        shortTimer.style.display = 'block';
        longTimer.style.display = 'none';
    });

    longbtn.addEventListener('click', () => {
        clearInterval(intervalId);
        intervalId = null;
        currentTimer = 'long';
        totalSeconds = 15 * 60;
        updateTime();

        pomoTimer.style.display = 'none';
        shortTimer.style.display = 'none';
        longTimer.style.display = 'block';
    });

    updateTime(); // Initialize
}

pomodoroTimer();

function dailyGoals() {
    document.addEventListener("DOMContentLoaded", () => {
        const goalInput = document.querySelector(".goal-input");
        const goalDate = document.querySelector(".goal-date");
        const goalNotes = document.querySelector(".goal-notes");
        const addGoalBtn = document.querySelector(".add-goal");
        const goalList = document.querySelector(".goal-list");
        const filters = document.querySelectorAll(".filter");
        const progressFill = document.querySelector(".progress-fill");

        let goals = [];

        function renderGoals(filter = "all") {
            goalList.innerHTML = "";

            let filteredGoals = goals.filter(goal => {
                if (filter === "completed") return goal.completed;
                if (filter === "incomplete") return !goal.completed;
                return true;
            });

            filteredGoals.forEach((goal, index) => {
                const goalCard = document.createElement("div");
                goalCard.className = "goal-card" + (goal.completed ? " complete" : "");
                goalCard.innerHTML = `
                <h3>${goal.text}</h3>
                <small>Date: ${goal.date || "No Date"}</small>
                <p>${goal.notes}</p>
                <div class="goal-actions">
                    <button onclick="toggleComplete(${index})">
                        ${goal.completed ? "✅ Completed" : "✔️ Mark Complete"}
                    </button>
                    <button onclick="deleteGoal(${index})">🗑️ Delete</button>
                </div>
            `;
                goalList.appendChild(goalCard);
            });

            updateProgress();
        }

        function addGoal() {
            const text = goalInput.value.trim();
            const date = goalDate.value;
            const notes = goalNotes.value.trim();

            if (text === "") return;

            goals.push({
                text,
                date,
                notes,
                completed: false
            });

            goalInput.value = "";
            goalDate.value = "";
            goalNotes.value = "";
            renderGoals(getActiveFilter());
        }

        function deleteGoal(index) {
            goals.splice(index, 1);
            renderGoals(getActiveFilter());
        }

        function toggleComplete(index) {
            goals[index].completed = !goals[index].completed;
            renderGoals(getActiveFilter());
        }

        function updateProgress() {
            const total = goals.length;
            const completed = goals.filter(g => g.completed).length;
            const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
            progressFill.style.width = `${percentage}%`;
        }

        function getActiveFilter() {
            return document.querySelector(".filter.active").dataset.filter;
        }

        // Filter buttons event
        filters.forEach(btn => {
            btn.addEventListener("click", () => {
                filters.forEach(f => f.classList.remove("active"));
                btn.classList.add("active");
                renderGoals(btn.dataset.filter);
            });
        });

        // Add goal event
        addGoalBtn.addEventListener("click", addGoal);

        // Make functions globally accessible
        window.deleteGoal = deleteGoal;
        window.toggleComplete = toggleComplete;

        // Initial render
        renderGoals();
    });
}

dailyGoals();

function weather() {
    let timeDate1 = document.querySelector('.header1 h1')
    let timeDate2 = document.querySelector('.header1 h2')
    let cityTemp = document.querySelector('.header2 h2')
    let cityCondition = document.querySelector('.header2 h4')
    let p = document.querySelector('.header2 #p');
    let h = document.querySelector('.header2 #h');
    let w = document.querySelector('.header2 #w');
    let cityName = document.querySelector('.header1 h4')

    async function weatherApi() {
        let response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${weatherapiKey}&q=${city}`);
        let data = await response.json();
        let condition = data.current.condition.text;
        let preciption = data.current.precip_in;
        let wind = data.current.wind_kph;
        let Humidity1 = data.current.humidity;
        let temp = data.current.temp_c;
        let state = data.location.name;
        let region = data.location.region;
        cityTemp.innerHTML = `${Math.floor(temp)}°C`;
        cityCondition.innerHTML = `${condition}`;

        p.innerHTML = `Precipitation: ${preciption}%`;
        h.innerHTML = `Humidity: ${Humidity1}%`;
        w.innerHTML = `Wind: ${Math.floor(wind)} km/h`;
        cityName.innerHTML = `${state} (${region})`
    }
    setInterval(() => {
        weatherApi();
    }, 1000);

    function dateTime() {
        const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let date = new Date();
        let day = weekday[date.getDay()]
        let hrs = date.getHours();
        let min = date.getMinutes();
        let sec = date.getSeconds();
        let latestDate = date.getDate();
        let latestMonth = month[date.getMonth()];
        let year = date.getFullYear();
        timeDate1.innerHTML = `${hrs < 10 ? '0' + hrs : hrs}:${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}, ${day}`
        timeDate2.innerHTML = `${latestDate} ${latestMonth}, ${year}`
    }
    setInterval(() => {
        dateTime();
    }, 1000);
}

weather();



function changeTheme() {
    let themeBtn = document.querySelector('nav .navIn .changeTheme');
    let bgImg = document.querySelector('.allelems header');
    let todoImg = document.querySelector('.allFeatures .todo img');
    let dailyplannerImg = document.querySelector('.allFeatures .daily img');
    let motiImg = document.querySelector('.allFeatures .Moti img');
    let pomoImg = document.querySelector('.allFeatures .pomo img');
    let goalsImg = document.querySelector('.allFeatures .goals img');
    let moonIcon = document.querySelector('nav button');
    let flag = 0;
    themeBtn.addEventListener('click', () => {
        const root = document.documentElement;
        if (flag == 0) {
            root.style.setProperty('--pri', '#F2F2F2')
            root.style.setProperty('--sec', '#EAE4D5')
            root.style.setProperty('--ter1', '#B6B09F')
            root.style.setProperty('--ter2', '#000000')
            bgImg.style.backgroundImage = "url('https://images.unsplash.com/photo-1723526288124-c8523c709544?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";
            todoImg.src = 'https://plus.unsplash.com/premium_photo-1732730224529-32b1c78ad394?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
            dailyplannerImg.src = 'https://plus.unsplash.com/premium_photo-1669323926612-c1e3bdc1c7fb?q=80&w=2100&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
            motiImg.src = 'https://plus.unsplash.com/premium_photo-1681046751337-740b6433b725?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
            pomoImg.src = 'https://plus.unsplash.com/premium_photo-1673891211303-825d15617a11?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
            goalsImg.src = 'https://plus.unsplash.com/premium_photo-1738720025343-2aece88ca4ee?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
            moonIcon.innerHTML = '<i class="ri-moon-line"></i>'
            flag = 1;
        }
        else {
            root.style.setProperty('--pri', '#222831')
            root.style.setProperty('--sec', '#393E46')
            root.style.setProperty('--ter1', '#00ADB5')
            root.style.setProperty('--ter2', '#EEEEEE')
            bgImg.style.backgroundImage = "url('https://images.unsplash.com/photo-1653279592785-8967b6cc74f8?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";
            todoImg.src = 'https://plus.unsplash.com/premium_photo-1722728055872-cb204dd3ba7a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
            dailyplannerImg.src = 'https://plus.unsplash.com/premium_photo-1682192408147-90c1503d64ef?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
            motiImg.src = 'https://plus.unsplash.com/premium_photo-1692948505024-20a1288d0b65?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
            pomoImg.src = 'https://images.unsplash.com/photo-1670433190591-e74b8bb30076?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
            goalsImg.src = 'https://images.unsplash.com/photo-1629648920459-83b1b62ae46e?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
            moonIcon.innerHTML = '<i class="ri-sun-line"></i>'
            flag = 0;
        }
    })
}

changeTheme();

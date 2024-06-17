document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.section');
  showSection('home');
  loadStreakCounter();
});

function showSection(id) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    section.classList.add('hidden');
  });
  document.getElementById(id).classList.remove('hidden');

  if (id === 'profile') {
    updateProfile(); // Update profile info and progress bar when switching to profile section
  }
}

let playerLevel = 1;
let playerXP = 0;
let playerRank = 'S';
let playerName = '';
let playerJob = '';
let streakCounter = 0;
let lastTaskDate = '';

const tasks = [];

function updateProfile() {
  document.getElementById('playerLevel').innerHTML = `Level: ${playerLevel}<div class="progress-bar"><div id="levelProgress" class="progress" style="width: 0;"></div></div>`;
  document.getElementById('playerXP').textContent = `XP: ${playerXP}`;
  document.getElementById('playerRank').textContent = `Rank: ${playerRank}`;
  document.getElementById('profileName').textContent = `Name: ${playerName}`;
  document.getElementById('profileJob').textContent = `Job Title: ${playerJob}`;
  document.getElementById('streakCounter').textContent = `Streak: ${streakCounter} days`;

  const xpForNextLevel = 1000;
  const progress = (playerXP / xpForNextLevel) * 100;
  document.getElementById('levelProgress').style.width = `${progress}%`;

  const ranks = ['F', 'E', 'D', 'C', 'B', 'A', 'S'];
  const rankIndex = Math.floor(playerLevel / 10);
  if (rankIndex < ranks.length) {
    playerRank = ranks[rankIndex];
    if (playerRank === 'S') {
      playerJob = 'Master of S Rank';
    }
    alert(`Congratulations! You have reached level ${playerLevel} and attained the rank of ${playerRank}.`);
  }
  document.getElementById('playerRank').textContent = `Rank: ${playerRank}`;
  document.getElementById('profileJob').textContent = `Job Title: ${playerJob}`;
}

function checkLevelUp() {
  const xpForNextLevel = 1000;
  while (playerXP >= xpForNextLevel) {
    playerXP -= xpForNextLevel;
    playerLevel += 1;
  }
  updateProfile();
}

function addTask() {
  const taskName = document.getElementById('taskName').value;
  const taskXP = parseInt(document.getElementById('taskXP').value);
  if (taskName && taskXP) {
    tasks.push({ name: taskName, xp: taskXP });
    document.getElementById('taskName').value = '';
    document.getElementById('taskXP').value = '';
    renderTasks();
  }
}

function renderTasks() {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.textContent = `${task.name} - ${task.xp} XP`;
    const button = document.createElement('button');
    button.textContent = 'Complete';
    button.onclick = () => completeTask(index);
    li.appendChild(button);
    taskList.appendChild(li);
  });
}

function completeTask(index) {
  playerXP += tasks[index].xp;
  tasks.splice(index, 1);
  renderTasks();
  checkLevelUp();
  updateStreakCounter();
}

function updatePlayerInfo() {
  playerName = document.getElementById('playerName').value;
  playerJob = document.getElementById('playerJob').value;

  // Hide the home section
  document.getElementById('home').classList.add('hidden');

  // Show the profile and tasks buttons and sections
  document.getElementById('tasksBtn').classList.remove('hidden');
  document.getElementById('profileBtn').classList.remove('hidden');
  showSection('profile');

  updateProfile();
}

function updateStreakCounter() {
  const today = new Date().toDateString();
  if (lastTaskDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (lastTaskDate === yesterday.toDateString()) {
      streakCounter += 1;
    } else {
      streakCounter = 1;
    }
    lastTaskDate = today;
    saveStreakCounter();
  }
  document.getElementById('streakCounter').textContent = `Streak: ${streakCounter} days`;
}

function saveStreakCounter() {
  localStorage.setItem('streakCounter', streakCounter);
  localStorage.setItem('lastTaskDate', lastTaskDate);
}

function loadStreakCounter() {
  const storedStreakCounter = localStorage.getItem('streakCounter');
  const storedLastTaskDate = localStorage.getItem('lastTaskDate');
  if (storedStreakCounter !== null) {
    streakCounter = parseInt(storedStreakCounter);
  }
  if (storedLastTaskDate !== null) {
    lastTaskDate = storedLastTaskDate;
  }
  document.getElementById('streakCounter').textContent = `Streak: ${streakCounter} days`;
}

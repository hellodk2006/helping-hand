let currentUser = null;
let tasks = JSON.parse(localStorage.getItem("tasks")) || []; // Retrieve tasks from local storage if they exist
let generatedOTP = null; // Variable to store generated OTP

// Initialize the task list from local storage
renderTasks();

const nameEl = document.getElementById("name");
const emailEl = document.getElementById("email");
const phoneEl = document.getElementById("phone");
const countryCodeEl = document.getElementById("country-code");
const aadharEl = document.getElementById("aadhar");
const errorEl = document.getElementById("error");
const userNameEl = document.getElementById("user-name");

const registerTab = document.getElementById("register-tab");
const tasksTab = document.getElementById("tasks-tab");
const registerForm = document.getElementById("register-form");
const taskOptions = document.getElementById("task-options");
const taskPostForm = document.getElementById("task-post-form");
const taskListSection = document.getElementById("task-list-section");

const postTaskOption = document.getElementById("post-task-option");
const takeTaskOption = document.getElementById("take-task-option");

const phoneOtpInput = document.createElement("input");
phoneOtpInput.setAttribute("type", "text");
phoneOtpInput.setAttribute("id", "otp");
phoneOtpInput.setAttribute("placeholder", "Enter OTP");

const otpButton = document.createElement("button");
otpButton.innerText = "Verify OTP";
otpButton.setAttribute("id", "verify-otp-btn");

document.getElementById("register-btn").addEventListener("click", () => {
  if (!nameEl.value || !emailEl.value || !phoneEl.value || !aadharEl.value) {
    errorEl.innerText = "All fields are required!";
    return;
  }
  
  // Proceed with OTP generation
  generatedOTP = Math.floor(100000 + Math.random() * 900000); // Generate random 6-digit OTP
  console.log("Generated OTP:", generatedOTP); // For testing purposes
  
  // Show OTP input and button
  registerForm.appendChild(phoneOtpInput);
  registerForm.appendChild(otpButton);
  
  errorEl.innerText = ""; // Clear previous error

  // Add OTP verification event listener
  otpButton.addEventListener("click", () => {
    const enteredOTP = document.getElementById("otp").value;
    
    if (enteredOTP === String(generatedOTP)) {
      // OTP is valid, proceed with registration
      currentUser = {
        name: nameEl.value,
        email: emailEl.value,
        phone: ${countryCodeEl.value}${phoneEl.value},
        aadhar: aadharEl.value,
      };

      // Hide OTP input and button
      phoneOtpInput.style.display = "none";
      otpButton.style.display = "none";

      registerForm.classList.remove("active");
      taskOptions.classList.add("active");
      userNameEl.innerText = currentUser.name;

      // Enable tasks tab
      tasksTab.disabled = false;
      tasksTab.classList.remove("disabled");
    } else {
      errorEl.innerText = "Invalid OTP. Please try again.";
    }
  });
});

postTaskOption.addEventListener("click", () => {
  taskPostForm.classList.add("active");
  taskListSection.classList.remove("active");
});

takeTaskOption.addEventListener("click", () => {
  taskPostForm.classList.remove("active");
  taskListSection.classList.add("active");
});

// Handle Task Post Form
document.getElementById("post-task-btn").addEventListener("click", () => {
  const taskCategory = document.getElementById("task-category").value;
  const taskTitle = document.getElementById("task-title").value;
  const taskDesc = document.getElementById("task-desc").value;
  const taskAmount = document.getElementById("task-amount").value;

  if (!taskTitle || !taskDesc || !taskAmount) {
    errorEl.innerText = "All task fields are required!";
    return;
  }

  const task = {
    id: Date.now(),
    category: taskCategory,
    title: taskTitle,
    description: taskDesc,
    amount: taskAmount,
    postedBy: currentUser.name,
    status: "Available" // Set task status
  };

  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks)); // Save tasks to localStorage
  
  renderTasks(); // Refresh task list
  taskPostForm.classList.remove("active");
  taskListSection.classList.add("active");
});

function renderTasks() {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";
  tasks.forEach((task) => {
    const taskItem = document.createElement("li");
    taskItem.innerHTML = `
      <strong>${task.title}</strong><br />
      Category: ${task.category}<br />
      Description: ${task.description}<br />
      Amount: ₹${task.amount}<br />
      Posted by: ${task.postedBy}<br />
      Status: <span style="color:${task.status === 'Available' ? 'green' : 'gray'}">${task.status}</span><br />
      <button onclick="acceptTask(${task.id})" ${task.status === 'Accepted' ? 'disabled' : ''}>Accept Task</button>
    `;
    taskList.appendChild(taskItem);
  });
}

function acceptTask(taskId) {
  const task = tasks.find((task) => task.id === taskId);
  task.status = "Accepted"; // Change task status to Accepted
  renderTasks(); // Re-render the task list to reflect the change
  alert(You have accepted the task: ${task.title});
}

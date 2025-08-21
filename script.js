let currentUser = null;
let tasks = JSON.parse(localStorage.getItem("tasks")) || []; // Retrieve tasks from local storage if they exist

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
const taskSection = document.getElementById("task-section");

const phoneOtpInput = document.createElement("input");
phoneOtpInput.setAttribute("type", "text");
phoneOtpInput.setAttribute("id", "otp");
phoneOtpInput.setAttribute("placeholder", "Enter OTP");

const otpButton = document.createElement("button");
otpButton.textContent = "Verify OTP";
otpButton.setAttribute("id", "verify-otp-btn");

// Switch tabs between registration and tasks
const switchTab = (tab) => {
  document.querySelectorAll(".tab").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".tab-content").forEach(content => content.classList.remove("active"));

  if (tab === "register") {
    registerTab.classList.add("active");
    registerForm.classList.add("active");
  } else {
    tasksTab.classList.add("active");
    taskSection.classList.add("active");
  }
};

registerTab.addEventListener("click", () => switchTab("register"));
tasksTab.addEventListener("click", () => switchTab("tasks"));

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidAadhar(aadhar) {
  return /^\d{12}$/.test(aadhar);
}

function isValidPhone(phone) {
  return /^\d{10}$/.test(phone);
}

function simulateOTPVerification() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(Math.random() < 0.9);  // 90% chance to verify
    }, 1000);
  });
}

document.getElementById("register-btn").addEventListener("click", async () => {
  const name = nameEl.value.trim();
  const email = emailEl.value.trim();
  const phone = phoneEl.value.trim();
  const countryCode = countryCodeEl.value.trim();
  const aadhar = aadharEl.value.trim();

  if (!name || !email || !phone || !aadhar) {
    errorEl.textContent = "All fields are required";
    return;
  }

  if (!isValidEmail(email)) {
    errorEl.textContent = "Invalid email";
    return;
  }

  if (!isValidAadhar(aadhar)) {
    errorEl.textContent = "Aadhar must be 12 digits";
    return;
  }

  if (!isValidPhone(phone)) {
    errorEl.textContent = "Phone number must be 10 digits";
    return;
  }

  errorEl.textContent = "Sending OTP...";

  // Simulate OTP verification
  const otpVerified = await simulateOTPVerification();

  if (!otpVerified) {
    errorEl.textContent = "OTP verification failed. Try again.";
    return;
  }

  errorEl.textContent = "Verification successful!";
  currentUser = { id: user-${Date.now()}, name, email, phone: ${countryCode} ${phone}, aadhar };
  userNameEl.textContent = name;
  tasksTab.classList.remove("disabled");  // Un-hide or enable Tasks Tab

  // Clear registration form
  nameEl.value = "";
  emailEl.value = "";
  phoneEl.value = "";
  aadharEl.value = "";

  // Switch to tasks tab
  switchTab("tasks");
});

document.getElementById("post-task-btn").addEventListener("click", () => {
  const title = document.getElementById("task-title").value.trim();
  const description = document.getElementById("task-desc").value.trim();
  const amount = Number(document.getElementById("task-amount").value);

  if (!title || !description || isNaN(amount) || amount <= 0) {
    alert("Please fill in all task fields correctly.");
    return;
  }

  if (!currentUser) {
    alert("You must be registered to post tasks.");
    return;
  }

  const task = {
    id: task-${Date.now()},
    title,
    description,
    amount,
    status: "pending",
    postedBy: currentUser.id
  };

  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks)); // Store the tasks in local storage
  renderTasks();

  // Clear task form
  document.getElementById("task-title").value = "";
  document.getElementById("task-desc").value = "";
  document.getElementById("task-amount").value = "";
});

// Render tasks from localStorage
function renderTasks() {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  const pendingTasks = tasks.filter(t => t.status === "pending");

  if (pendingTasks.length === 0) {
    taskList.innerHTML = "<li>No pending tasks.</li>";
    return;
  }

  pendingTasks.forEach(task => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${task.title}</strong> - ₹${task.amount}<br/>
      <em>${task.description}</em><br/>
      <button onclick="acceptTask('${task.id}')">Accept</button>
    `;
    taskList.appendChild(li);
  });
}

window.acceptTask = function (taskId) {
  tasks = tasks.map(task => 
    task.id === taskId ? { ...task, status: "assigned", assignedTo: currentUser.id } : task
  );
  localStorage.setItem("tasks", JSON.stringify(tasks)); // Update the tasks in local storage
  renderTasks();
}

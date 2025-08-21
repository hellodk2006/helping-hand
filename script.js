let currentUser = null;
let tasks = [];

const nameEl = document.getElementById("name");
const emailEl = document.getElementById("email");
const phoneEl = document.getElementById("phone");
const aadharEl = document.getElementById("aadhar");
const errorEl = document.getElementById("error");
const userNameEl = document.getElementById("user-name");

const registerTab = document.getElementById("register-tab");
const tasksTab = document.getElementById("tasks-tab");
const registerForm = document.getElementById("register-form");
const taskSection = document.getElementById("task-section");

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

function simulateVerification() {
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

  errorEl.textContent = "Verifying...";
  document.getElementById("register-btn").disabled = true;
  const verified = await simulateVerification();
  document.getElementById("register-btn").disabled = false;

  if (!verified) {
    errorEl.textContent = "Aadhar verification failed. Try again.";
    return;
  }

  errorEl.textContent = "";
  currentUser = { id: user-${Date.now()}, name, email, phone, aadhar };
  userNameEl.textContent = name;
  tasksTab.disabled = false;

  // Clear registration form
  nameEl.value = "";
  emailEl.value = "";
  phoneEl.value = "";
  aadharEl.value = "";

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
  renderTasks();

  // Clear task form
  document.getElementById("task-title").value = "";
  document.getElementById("task-desc").value = "";
  document.getElementById("task-amount").value = "";
});

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
  renderTasks();
);

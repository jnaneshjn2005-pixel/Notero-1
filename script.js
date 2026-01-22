// 1️⃣ LOGIN FUNCTION (already added)
function login() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  if (username === "" || password === "") {
    alert("Fill all fields");
    return;
  }

  localStorage.setItem("currentUser", username);

  if (username === "admin" && password === "admin123") {
    window.location.href = "admin.html";
  } else {
    window.location.href = "dashboard.html";
  }
}

// 2️⃣ LOGOUT FUNCTION
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

// 3️⃣ LOAD NOTES FROM LOCALSTORAGE (VERY IMPORTANT)
let notes = JSON.parse(localStorage.getItem("notes")) || [];

// 4️⃣ USER: ADD NOTE (PENDING)
function addNote() {
  let currentUser = localStorage.getItem("currentUser");

  let note = {
    title: title.value,
    subject: subject.value,
    content: content.value,
    status: "pending",
    uploadedBy: currentUser
  };

  notes.push(note);
  localStorage.setItem("notes", JSON.stringify(notes));

  alert("Note sent for admin approval");

  title.value = subject.value = content.value = "";
}


// ===============================
// 👉 ADD YOUR CODE **HERE**
// ===============================

// 5️⃣ ADMIN: LOAD PENDING NOTES
function loadPending() {
  let pendingDiv = document.getElementById("pending");
  if (!pendingDiv) return;

  pendingDiv.innerHTML = "";

  notes.forEach((note, i) => {
    if (note.status === "pending") {
      pendingDiv.innerHTML += `
        <div class="note">
          <h4>${note.title}</h4>
          <p><b>Subject:</b> ${note.subject}</p>
          <p>${note.content}</p>
          <p><b>Uploaded by:</b> ${note.uploadedBy}</p>
          <button onclick="approve(${i})">Approve</button>
          <button onclick="deleteNote(${i})">Delete</button>
        </div>
      `;
    }
  });
}

// 6️⃣ ADMIN: APPROVE NOTE
function approve(index) {
  notes[index].status = "approved";
  localStorage.setItem("notes", JSON.stringify(notes));
  loadPending();
}

// 7️⃣ AUTO-RUN WHEN admin.html OPENS
loadPending();

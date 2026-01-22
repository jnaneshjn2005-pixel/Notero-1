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
  let fileInput = document.getElementById("file");

  if (!fileInput.files.length) {
    alert("Please select a file");
    return;
  }

  let file = fileInput.files[0];
  // FILE SIZE VALIDATION (5MB)
let maxSize = 5 * 1024 * 1024; // 5 MB

if (file.size > maxSize) {
  alert("File too large! Maximum allowed size is 5MB.");
  return;
}
  // ALLOWED FILE TYPES
let allowedTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "video/mp4",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

if (!allowedTypes.includes(file.type)) {
  alert("Invalid file type!");
  return;
}
  let reader = new FileReader();

  reader.onload = function () {
    let note = {
      title: title.value,
      subject: subject.value,
      fileName: file.name,
      fileType: file.type,
      fileData: reader.result, // BASE64
      status: "pending",
      uploadedBy: currentUser
    };

    notes.push(note);
    localStorage.setItem("notes", JSON.stringify(notes));
    alert("File sent for admin approval");

    title.value = subject.value = "";
    fileInput.value = "";
  };

  reader.readAsDataURL(file);
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
          <p><b>Uploaded by:</b> ${note.uploadedBy}</p>
          <p><b>File:</b> ${getFileIcon(note.fileType)} ${note.fileName}</p>

          <a href="${note.fileData}" target="_blank">View File</a><br><br>

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

function deleteNote(index) {
  if (confirm("Are you sure you want to delete this note?")) {
    notes.splice(index, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    loadPending();
  }
}

// 7️⃣ AUTO-RUN WHEN admin.html OPENS
loadPending();

// ===============================
// USER: DISPLAY APPROVED NOTES
// ===============================
function displayNotes() {
  let notesDiv = document.getElementById("notes");
  if (!notesDiv) return;

  let searchInput = document.getElementById("search");
  let filterInput = document.getElementById("filter");

  let searchText = searchInput ? searchInput.value.toLowerCase() : "";
  let filter = filterInput ? filterInput.value : "all";

  notesDiv.innerHTML = "";

  notes.forEach(note => {
    let matchesSearch = note.title.toLowerCase().includes(searchText);
    let matchesFilter = filter === "all" || note.subject === filter;

    if (note.status === "approved" && matchesSearch && matchesFilter) {
      notesDiv.innerHTML += `
        <div class="note">
          <h3>${note.title}</h3>
          <p><b>Subject:</b> ${note.subject}</p>
          <p><b>Uploaded by:</b> ${note.uploadedBy}</p>
           <p><b>File:</b> ${getFileIcon(note.fileType)} ${note.fileName}</p>

          <a href="${note.fileData}" download="${note.fileName}">
            Download / View
          </a>
        </div>
      `;
    }
  });
}
displayNotes();

function toggleDark() {
  document.body.classList.toggle("dark");

  let isDark = document.body.classList.contains("dark");
  localStorage.setItem("darkMode", isDark);
}
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
}

function getFileIcon(type) {
  if (type.includes("pdf")) return "📄";
  if (type.includes("image")) return "🖼️";
  if (type.includes("video")) return "🎬";
  if (type.includes("word")) return "📝";
  return "📁";
}

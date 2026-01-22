/* =========================
   LOGIN
========================= */
function login() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  if (!username || !password) {
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

/* =========================
   LOGOUT
========================= */
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

/* =========================
   USER: ADD NOTE (PENDING)
========================= */
function addNote() {
  let currentUser = localStorage.getItem("currentUser");
  let fileInput = document.getElementById("file");

  if (!fileInput || !fileInput.files.length) {
    alert("Please select a file");
    return;
  }

  let file = fileInput.files[0];

  // File size limit (5MB)
  let maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    alert("File too large! Max 5MB allowed.");
    return;
  }

  // Allowed file types
  let allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "video/mp4",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];

  if (!allowedTypes.includes(file.type)) {
    alert("Invalid file type");
    return;
  }

  let reader = new FileReader();

  reader.onload = function () {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];

    let note = {
      title: document.getElementById("title").value,
      subject: document.getElementById("subject").value,
      fileName: file.name,
      fileType: file.type,
      fileData: reader.result,
      status: "pending",
      uploadedBy: currentUser
    };

    notes.push(note);
    localStorage.setItem("notes", JSON.stringify(notes));

    alert("File sent for admin approval");

    document.getElementById("title").value = "";
    document.getElementById("subject").value = "";
    fileInput.value = "";
  };

  reader.readAsDataURL(file);
}

/* =========================
   ADMIN: LOAD PENDING NOTES
========================= */
function loadPending() {
  let pendingDiv = document.getElementById("pending");
  if (!pendingDiv) return;

  let notes = JSON.parse(localStorage.getItem("notes")) || [];
  pendingDiv.innerHTML = "";

  notes.forEach((note, index) => {
    if (note.status === "pending") {
      pendingDiv.innerHTML += `
        <div class="note">
          <h4>${note.title}</h4>
          <p><b>Subject:</b> ${note.subject}</p>
          <p><b>Uploaded by:</b> ${note.uploadedBy}</p>
          <p><b>File:</b> ${getFileIcon(note.fileType)} ${note.fileName}</p>

          <a href="${note.fileData}" target="_blank">View File</a><br><br>

          <button onclick="approve(${index})">Approve</button>
          <button onclick="deleteNote(${index})">Delete</button>
        </div>
      `;
    }
  });
}

/* =========================
   ADMIN: APPROVE / DELETE
========================= */
function approve(index) {
  let notes = JSON.parse(localStorage.getItem("notes")) || [];
  notes[index].status = "approved";
  localStorage.setItem("notes", JSON.stringify(notes));
  alert("Note approved");
  loadPending();
}

function deleteNote(index) {
  if (!confirm("Delete this note?")) return;

  let notes = JSON.parse(localStorage.getItem("notes")) || [];
  notes.splice(index, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  loadPending();
}

/* =========================
   USER: DISPLAY APPROVED NOTES
========================= */
function displayNotes() {
  let notesDiv = document.getElementById("notes");
  if (!notesDiv) return;

  let notes = JSON.parse(localStorage.getItem("notes")) || [];
  let searchInput = document.getElementById("search");
  let searchText = searchInput ? searchInput.value.toLowerCase() : "";

  notesDiv.innerHTML = "";

  notes.forEach(note => {
    if (
      note.status === "approved" &&
      note.title.toLowerCase().includes(searchText)
    ) {
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

/* =========================
   DARK MODE
========================= */
function toggleDark() {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "darkMode",
    document.body.classList.contains("dark")
  );
}

if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
}

/* =========================
   FILE ICONS
========================= */
function getFileIcon(type) {
  if (type.includes("pdf")) return "📄";
  if (type.includes("image")) return "🖼️";
  if (type.includes("video")) return "🎬";
  if (type.includes("word")) return "📝";
  return "📁";
}

/* =========================
   AUTO RUN
========================= */
loadPending();
displayNotes();



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
          <p><b>File:</b> ${note.fileName}</p>

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

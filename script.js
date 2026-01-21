// LOGIN
function login() {
  const u = username.value;
  const p = password.value;

  if (u === "admin" && p === "admin123") {
    localStorage.setItem("role", "admin");
    location.href = "admin.html";
  } 
  else if (u === "user" && p === "user123") {
    localStorage.setItem("role", "user");
    location.href = "dashboard.html";
  } 
  else {
    alert("Invalid Login");
  }
}

// LOGOUT
function logout() {
  localStorage.clear();
  location.href = "index.html";
}

// UPLOAD NOTE
function uploadNote() {
  const subject = document.getElementById("subject").value;
  const title = document.getElementById("title").value;
  const file = document.getElementById("file").files[0];

  if (!file) return alert("Select file");

  const reader = new FileReader();
  reader.onload = () => {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.push({
      id: Date.now(),
      subject,
      title,
      file: reader.result,
      type: file.type,
      status: "pending"
    });
    localStorage.setItem("notes", JSON.stringify(notes));
    alert("Uploaded for approval");
  };
  reader.readAsDataURL(file);
}

// LOAD PENDING (ADMIN)
function loadPendingNotes() {
  let notes = JSON.parse(localStorage.getItem("notes")) || [];
  pendingNotes.innerHTML = "";

  notes.filter(n => n.status === "pending").forEach(n => {
    pendingNotes.innerHTML += `
      <div class="note">
        <b>${n.subject}</b> - ${n.title}
        <button onclick="approve(${n.id})">Approve</button>
        <button onclick="reject(${n.id})">Reject</button>
      </div>`;
  });
}

// APPROVE
function approve(id) {
  let notes = JSON.parse(localStorage.getItem("notes"));
  notes.find(n => n.id === id).status = "approved";
  localStorage.setItem("notes", JSON.stringify(notes));
  loadPendingNotes();
}

// REJECT / DELETE
function reject(id) {
  let notes = JSON.parse(localStorage.getItem("notes"));
  notes = notes.filter(n => n.id !== id);
  localStorage.setItem("notes", JSON.stringify(notes));
  loadPendingNotes();
}

// LOAD APPROVED (USER)
function loadApprovedNotes() {
  let notes = JSON.parse(localStorage.getItem("notes")) || [];
  approvedNotes.innerHTML = "";

  notes.filter(n => n.status === "approved").forEach(n => {
    approvedNotes.innerHTML += `
      <div class="note">
        <b>${n.subject}</b> - ${n.title}
        <a href="${n.file}" target="_blank">View</a>
      </div>`;
  });
}

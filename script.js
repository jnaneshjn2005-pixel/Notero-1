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
let notes = JSON.parse(localStorage.getItem("notes")) || [];

function addNote() {
  let note = {
    title: title.value,
    subject: subject.value,
    content: content.value,
    status: "pending"
  };

  notes.push(note);
  localStorage.setItem("notes", JSON.stringify(notes));
  alert("Note sent for admin approval");

  title.value = subject.value = content.value = "";
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

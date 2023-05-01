function submitPaperPage() {
	if (localStorage.user) {
		const user = JSON.parse(localStorage.getItem('user'));
		if (user.role === "author")
			window.location.href = '/pages/submit-paper.html';
	} else {
        window.location.href = '/pages/login.html';
	}
}

function reviewPaperPage() {
	if (localStorage.user) {
		const user = JSON.parse(localStorage.getItem('user'));
		if (user.role === "reviewer")
			window.location.href = '/pages/review-paper.html';
	} else {
        window.location.href = '/pages/login.html';
	}
}

function scheduleEditorPage() {
	if (localStorage.user) {
		const user = JSON.parse(localStorage.getItem('user'));
		if (user.role === "organizer")
		window.location.href = '/pages/schedule-editor.html';
	} else {
        window.location.href = '/pages/login.html';
	}
}

const loginBtn = document.getElementById('login');
loginBtn.addEventListener('click', loginPage);
function loginPage() {
	window.location.href = '/pages/login.html';
}

if (localStorage.user) {
	const user = JSON.parse(localStorage.getItem('user'));
	const pelcome = document.getElementById('pelcome');
	const fname = document.getElementById('fname');
	loginBtn.style.display = "none";
	pelcome.removeAttribute("hidden");
	fname.innerHTML = user.first_name;
}

function logout() {
	localStorage.removeItem('user');
	window.location.href = '/index.html';
}

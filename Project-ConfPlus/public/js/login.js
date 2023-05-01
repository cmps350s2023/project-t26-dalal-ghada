const loginForm = document.querySelector(".login-form");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  //Make a POST request to the login API
  fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password })
  })
    .then((response) => {
		if (response.status == 404) {
			console.log('User not found');
			return 404;
		}
		else if (response.status == 401) {
			console.log('Password Invalid!');
			return 401;
		}
		return response.json();
	})
    .then((data) => {
		const error = document.getElementById("error");
		if (data == 401) {
			error.innerHTML = 'Password Invalid!';
		}
		else if (data == 404) {
			error.innerHTML = 'User not found';
		}
		else {
			
			//Storing first_name, role for user in cookies.
			localStorage.setItem('user', JSON.stringify(data));
			
			//Redirecting the user to their corresponding page based on their role
			if (data.role === "author") {
				window.location.href = "/pages/submit-paper.html";
			} else if (data.role === "reviewer") {
				window.location.href = "/pages/review-paper.html";
			} else if (data.role === "organizer") {
				window.location.href = "/pages/schedule-editor.html";
			}
		}
    })
    .catch((error) => {
		console.error("Error:", error);
    });
});

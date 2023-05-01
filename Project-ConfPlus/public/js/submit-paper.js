const authorsContainer = document.querySelector('#authors-container');

var affiliations = [];
// Fetch affiliations from API and populate dropdown options
fetch('/api/institutions')
	.then(response => response.json())
	.then(data => {
		affiliations = data;
		fillAffiliation('#affiliation_0');
	})
	.catch(error => console.error(error));

function fillAffiliation(affiliation_id) {

	const affiliationSelect = document.querySelector(affiliation_id);
		affiliations.forEach(institution => {
				const option = document.createElement('option');
				option.value = institution.name;
				option.textContent = institution.name;
				affiliationSelect.appendChild(option);
			});
}

// Check only one presenter is checked
function validate(checkbox_id) {
	const checkBox = document.getElementById(checkbox_id);
	const authorCount = authorsContainer.querySelectorAll('.author').length;

	if (checkBox.checked == true) {
		for (let i = 0; i < authorCount; i++) {
			const id = 'presenter_' + i;
			const cb = document.getElementById(id);
			if (cb.checked == true && id != checkbox_id) {
				checkBox.checked = false;
				alert('Only one presenter can be checked');
			}
		}
	}
}

// Add author to the form
document.querySelector('#add-author-btn').addEventListener('click', () => {
	const authorCount = authorsContainer.querySelectorAll('.author').length;
	const newAuthor = document.createElement('div');
	newAuthor.className = 'author';
	newAuthor.innerHTML = `
		<label for="first_name_${authorCount}">First Name:</label>
		<input type="text" id="first_name_${authorCount}" name="authors[${authorCount}][first_name]" required>
		<label for="last_name_${authorCount}">Last Name:</label>
		<input type="text" id="last_name_${authorCount}" name="authors[${authorCount}][last_name]" required>
		<label for="email_${authorCount}">Email:</label>
		<input type="email" id="email_${authorCount}" name="authors[${authorCount}][email]" required>
		<label for="affiliation_${authorCount}">Affiliation:</label>
		<select id="affiliation_${authorCount}" name="authors[${authorCount}][affiliation]" required>
			<option value="">--Select Affiliation--</option>
		</select>
		<label for="presenter_${authorCount}">Presenter:</label>
		<input type="checkbox" id="presenter_${authorCount}" name="authors[${authorCount}][presenter]" value="true" onclick="validate('presenter_${authorCount}')">
	`;
	authorsContainer.appendChild(newAuthor);
	fillAffiliation('#affiliation_' + authorCount);
	document.querySelector('#remove-author-btn').disabled = false;
});

// Remove last author from the form
document.querySelector('#remove-author-btn').addEventListener('click', () => {
	const authors = authorsContainer.querySelectorAll('.author');
	if (authors.length > 1) {
		authorsContainer.removeChild(authors[authors.length - 1]);
	}
	if (authors.length === 2) {
		document.querySelector('#remove-author-btn').disabled = true;
	}
});

// Submit form data as JSON object via POST request to API
document.querySelector('#paper-form').addEventListener('submit', event => {
	event.preventDefault();
	const form = event.target;
	const formData = new FormData(form);
	const authors = [];
	const authorCount = authorsContainer.querySelectorAll('.author').length;
	for (let i = 0; i < authorCount; i++) {
		const author = {};
		author.first_name = formData.get('authors['+i+'][first_name]');
		author.last_name = formData.get('authors['+i+'][last_name]');
		author.email = formData.get('authors['+i+'][email]');
		author.affiliation = formData.get('authors['+i+'][affiliation]');
		author.presenter = formData.get('authors['+i+'][presenter]') ? true : false;
		authors.push(author);
	}
	//console.log(authors);
	const fileInput = document.getElementById('file');   
	const filename = fileInput.files[0].name;
	const paper = {
		paper_title: formData.get('paper_title'),
		abstract: formData.get('abstract'),
		authors: authors,
		file: filename
	};
	fetch('/api/papers', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(paper)
	})
		.then(response => {
			if (!response.ok) {
				throw new Error(response.statusText);
			}
			alert('Paper submitted successfully');
			form.reset();
			document.querySelectorAll('.author:not(:first-child)').forEach(author => author.remove());
			document.querySelector('#remove-author-btn').disabled = true;
		})
		.catch(error => {
			console.error(error);
			alert('Error in submitting paper. Please try again later!');
		});
});
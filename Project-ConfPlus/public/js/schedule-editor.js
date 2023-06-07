const sessionsContainer = document.querySelector('#sessions-container');
document.querySelector('#presenter_0_0').value = '';

var locations = [];
// Fetch locations from API and populate dropdown options
fetch('/api/locations')
	.then(response => response.json())
	.then(data => {
		locations = data;
		fillLocation('#location_0');
	})
	.catch(error => console.error(error));

function fillLocation(location_id) {

	const locationSelect = document.querySelector(location_id);
		locations.forEach(location => {
				const option = document.createElement('option');
				option.value = location.name;
				option.textContent = location.name;
				locationSelect.appendChild(option);
			});
}

var dates = [];
// Fetch dates from API and populate dropdown options
fetch('/api/conference-dates')
	.then(response => response.json())
	.then(data => {
		dates = data;
		fillDate('#date_0');
	})
	.catch(error => console.error(error));

function fillDate(date_id) {

	const dateSelect = document.querySelector(date_id);
		dates.forEach(date => {
				const option = document.createElement('option');
				option.value = date.name;
				option.textContent = date.name;
				dateSelect.appendChild(option);
			});
}

var papers = [];
// Fetch papers from API and populate dropdown options
fetch('/api/papers')
	.then(response => response.json())
	.then(data => {
		papers = data;
		fillPaper('#paper_0_0');
	})
	.catch(error => console.error(error));

function fillPaper(paper_id) {

	const paperSelect = document.querySelector(paper_id);
		papers.forEach(paper => {
				const option = document.createElement('option');
				option.value = paper.paper_title;
				option.textContent = paper.paper_title;
				paperSelect.appendChild(option);
			});
}

// Write the name of paper presenter
function fill(presenter_id, paper_id) {
	const paperTitle = document.getElementById(paper_id);
	papers.forEach(paper => {
		if (paper.paper_title === paperTitle.value) {
			paper.authors.forEach(author => {
				if (author.presenter) {
					const name = author.first_name + ' ' + author.last_name;
					document.getElementById(presenter_id).value = name;
				}
			});
		}
	});
}

function addPresentation(sessionCount) {
	const presentationsContainerId = 'presentations_' + sessionCount;
	const presentationsContainer = document.getElementById(presentationsContainerId);
	const presentationCount = presentationsContainer.rows.length;
	const newPresentation = document.createElement('tr');
	newPresentation.innerHTML = `
		<tr>
			<td>
				<select id="paper_${sessionCount}_${presentationCount}" name="paper_${sessionCount}_${presentationCount}" onchange="fill('presenter_${sessionCount}_${presentationCount}', 'paper_${sessionCount}_${presentationCount}')" required>
					<option value="">-- Select Paper --</option>
				</select>
			</td>
			<td><input type="text" id="presenter_${sessionCount}_${presentationCount}" name="presenter_${sessionCount}_${presentationCount}" value="" readonly></td>
			<td><input type="time" id="from_time_${sessionCount}_${presentationCount}" name="from_time_${sessionCount}_${presentationCount}" required></td>
			<td><input type="time" id="to_time_${sessionCount}_${presentationCount}" name="to_time_${sessionCount}_${presentationCount}" required></td>
		</tr>
	`;
	presentationsContainer.appendChild(newPresentation);
	fillPaper('#paper_' + sessionCount + '_' + presentationCount);
}

function removePresentation(sessionCount) {
	const presentationsContainerId = 'presentations_' + sessionCount;
	const presentationsContainer = document.getElementById(presentationsContainerId);
	const presentationCount = presentationsContainer.rows.length;
	if (presentationCount > 1) {
		presentationsContainer.removeChild(presentationsContainer.lastChild);
	}
}

// Add session to the form
document.querySelector('#add-session-btn').addEventListener('click', () => {
	const sessionCount = sessionsContainer.querySelectorAll('.session').length;
	const newSession = document.createElement('div');
	newSession.className = 'session';
	newSession.innerHTML = `
		<label for="title_${sessionCount}">Title:</label>
						<input type="text" id="title_${sessionCount}" name="sessions[${sessionCount}][title]" required>
						
						<label for="location_${sessionCount}">Location:</label>
						<select id="location_${sessionCount}" name="sessions[${sessionCount}][location]" required>
							<option value="">--Select Location--</option>
						</select>
						
						<label for="date_${sessionCount}">Date:</label>
						<select id="date_${sessionCount}" name="sessions[${sessionCount}][date]" required>
							<option value="">--Select Date--</option>
						</select>
						
						<section id="paper-presentations">
							<h2>Paper Presentations</h2>
							<table>
								<thead>
									<tr>
										<th>Paper Title</th>
										<th>Presenter Name</th>
										<th>From Time</th>
										<th>To Time</th>
									</tr>
								</thead>
								<tbody id="presentations_${sessionCount}">
									<tr>
										<td>
											<select id="paper_${sessionCount}_0" name="paper_${sessionCount}_0" onchange="fill('presenter_${sessionCount}_0', 'paper_${sessionCount}_0')" required>
												<option value="">-- Select Paper --</option>
											</select>
										</td>
										<td><input type="text" id="presenter_${sessionCount}_0" name="presenter_${sessionCount}_0" value="" readonly></td>
										<td><input type="time" id="from_time_${sessionCount}_0" name="from_time_${sessionCount}_0" required></td>
										<td><input type="time" id="to_time_${sessionCount}_0" name="to_time_${sessionCount}_0" required></td>
									</tr>
								</tbody>
							</table>
							<button type="button" class="action-btn add" onclick="addPresentation(${sessionCount})">Add Presentation</button>
							<button type="button" class="action-btn remove" onclick="removePresentation(${sessionCount})">Remove Presentation</button>
						</section>
	`;
	sessionsContainer.appendChild(newSession);
	fillLocation('#location_' + sessionCount);
	fillDate('#date_' + sessionCount);
	fillPaper('#paper_' + sessionCount + '_0');
	document.querySelector('#remove-session-btn').disabled = false;
});

// Remove last session from the form
document.querySelector('#remove-session-btn').addEventListener('click', () => {
	const sessions = sessionsContainer.querySelectorAll('.session');
	if (sessions.length > 1) {
		sessionsContainer.removeChild(sessions[sessions.length - 1]);
	}
	if (sessions.length === 2) {
		document.querySelector('#remove-session-btn').disabled = true;
	}
});

// Sleep for waiting even fill dropdowns options
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

// Search about ConferenceSchedule in API and fill fields if found
fetch('/api/schedule')
	.then(response => response.json())
	.then(data => {
		if (data.sessions != null && data.sessions.length !=0) {
			document.querySelector('#page-title').innerHTML = 'Update';
			document.getElementById('title_0').value = data.sessions[0].title;
			sleep(1000).then(() => {
				document.getElementById('location_0').value = data.sessions[0].location;
				document.getElementById('date_0').value = data.sessions[0].date;
				document.getElementById('paper_0_0').value = data.sessions[0].presentations[0].paper_title;
			});
			document.getElementById('presenter_0_0').value = data.sessions[0].presentations[0].presenter_name;
			document.getElementById('from_time_0_0').value = data.sessions[0].presentations[0].from_time;
			document.getElementById('to_time_0_0').value = data.sessions[0].presentations[0].to_time;
			const asb = document.querySelector('#add-session-btn');
			const len = data.sessions.length;
			if (len >= 1) {
				const plen = data.sessions[0].presentations.length;
				for (let i = 1; i < plen ; i++) {
					sleep(800).then(() => {
						addPresentation(0);
						document.getElementById('paper_0_'+ i).value = data.sessions[0].presentations[i].paper_title;
						document.getElementById('presenter_0_'+ i).value = data.sessions[0].presentations[i].presenter_name;
						document.getElementById('from_time_0_'+ i).value = data.sessions[0].presentations[i].from_time;
						document.getElementById('to_time_0_'+ i).value = data.sessions[0].presentations[i].to_time;
					});
				}
			}
			for (let i = 1; i < len ; i++) {
				sleep(700).then(() => {
					asb.click();
					document.getElementById('title_'+ i).value = data.sessions[i].title;
					document.getElementById('location_'+ i).value = data.sessions[i].location;
					document.getElementById('date_'+ i).value = data.sessions[i].date;
					document.getElementById('paper_'+ i +'_0').value = data.sessions[i].presentations[0].paper_title;
					document.getElementById('presenter_'+ i +'_0').value = data.sessions[i].presentations[0].presenter_name;
					document.getElementById('from_time_'+ i +'_0').value = data.sessions[i].presentations[0].from_time;
					document.getElementById('to_time_'+ i +'_0').value = data.sessions[i].presentations[0].to_time;
				});
				const plen = data.sessions[i].presentations.length;
				for (let j = 1; j < plen ; j++) {
					sleep(900).then(() => {
						addPresentation(i);
						document.getElementById('paper_'+ i +'_'+ j).value = data.sessions[i].presentations[j].paper_title;
						document.getElementById('presenter_'+ i +'_'+ j).value = data.sessions[i].presentations[j].presenter_name;
						document.getElementById('from_time_'+ i +'_'+ j).value = data.sessions[i].presentations[j].from_time;
						document.getElementById('to_time_'+ i +'_'+ j).value = data.sessions[i].presentations[j].to_time;
					});
				}
			}
		}
		else {
			document.querySelector('#page-title').innerHTML = 'Create';
			document.querySelector('#schedule-form').reset();
		}
	})
	.catch(error => console.error(error));

// Submit form data as JSON object via POST request to API
document.querySelector('#schedule-form').addEventListener('submit', event => {
	event.preventDefault();
	const form = event.target;
	const formData = new FormData(form);
	const sessions = [];
	const sessionCount = sessionsContainer.querySelectorAll('.session').length;
	for (let i = 0; i < sessionCount; i++) {
		const session = {};
		session.title = formData.get('sessions['+i+'][title]');
		session.location = formData.get('sessions['+i+'][location]');
		session.date = formData.get('sessions['+i+'][date]');
		
		const presentations = [];
		const presentationsContainerId = 'presentations_' + i;
		const presentationsContainer = document.getElementById(presentationsContainerId);
		const presentationCount = presentationsContainer.rows.length;
		for (let j = 0; j < presentationCount; j++) {
			const presentation = {};
			presentation.paper_title = formData.get('paper_'+i+'_'+j);
			presentation.presenter_name = formData.get('presenter_'+i+'_'+j);
			presentation.from_time = formData.get('from_time_'+i+'_'+j);
			presentation.to_time = formData.get('to_time_'+i+'_'+j);
			presentations.push(presentation);
		}
		
		session.presentations = presentations;
		sessions.push(session);
	}
	//console.log(sessions);
	
	const conferenceSchedule = {
		sessions: sessions
	};
	fetch('/api/schedule', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(conferenceSchedule)
	})
		.then(response => {
			if (!response.ok) {
				throw new Error(response.statusText);
			}
			form.reset();
			alert('Conference Schedule submitted successfully');
			window.location.href = "/pages/schedule-editor.html";
		})
		.catch(error => {
			console.error(error);
			alert('Error in submitting. Please try again later!');
		});
});
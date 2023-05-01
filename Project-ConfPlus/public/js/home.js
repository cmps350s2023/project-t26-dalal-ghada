const scheduleContainer = document.getElementById("schedule");
const dateSelect = document.querySelector('#date');
const sessions = [];

// Fetch conference schedule from API
fetch("/api/schedule")
  .then(response => response.json())
  .then(data => {
	  data.sessions.forEach(session => {
      sessions.push(session);
    });
    displaySessions(sessions);
  })
  .catch(error => console.error(error));

// Fetch dates from API and populate dropdown options
fetch('/api/conference-dates')
	.then(response => response.json())
	.then(data => {
		data.forEach(date => {
				const option = document.createElement('option');
				option.value = date.name;
				option.textContent = date.name;
				dateSelect.appendChild(option);
			});
	})
	.catch(error => console.error(error));

function displaySessions(sessions) {
	const gridContainer = document.createElement("div");
	gridContainer.classList.add("grid-container");
	
	sessions.forEach(session => {
      const sessionElement = document.createElement("div");
      sessionElement.className = "session";
	  
      const titleElement = document.createElement("h2");
      titleElement.textContent = session.title;
      sessionElement.appendChild(titleElement);
	  
      const locationElement = document.createElement("p");
      locationElement.textContent = `Location: ${session.location}`;
      sessionElement.appendChild(locationElement);
	  
      const dateElement = document.createElement("p");
      dateElement.textContent = `Date: ${session.date}`;
      sessionElement.appendChild(dateElement);
	  
      const presentationsElement = document.createElement("div");
      presentationsElement.className = "presentations";
      sessionElement.appendChild(presentationsElement);
	  
      session.presentations.forEach(presentation => {
        const presentationElement = document.createElement("div");
        presentationElement.className = "presentation";
		
        const paperTitleElement = document.createElement("h3");
        paperTitleElement.textContent = presentation.paper_title;
        presentationElement.appendChild(paperTitleElement);
		
        const presenterNameElement = document.createElement("p");
        presenterNameElement.textContent = `Presenter: ${presentation.presenter_name}`;
        presentationElement.appendChild(presenterNameElement);
		
        const timeElement = document.createElement("p");
        timeElement.textContent = `Time: ${presentation.from_time} - ${presentation.to_time}`;
        presentationElement.appendChild(timeElement);
		
        presentationsElement.appendChild(presentationElement);
      });

      gridContainer.appendChild(sessionElement);
    });

      const existingGridContainer = scheduleContainer.querySelector(".grid-container");
	  if (existingGridContainer) {
			scheduleContainer.replaceChild(gridContainer, existingGridContainer);
	  } else {
			scheduleContainer.appendChild(gridContainer);
	  }
}

// Filter sessions by conference date
dateSelect.addEventListener("change", event => {
  const filteredSessions = sessions.filter(session => session.date.startsWith(event.target.value));
  displaySessions(filteredSessions);
});
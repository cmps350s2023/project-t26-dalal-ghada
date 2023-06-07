import { useState, useEffect } from 'react'
import styles from '../styles/Home.module.css'
import Session from '../components/sessions/Session'

export default function Home() {
	
	const [dates, setDates] = useState([]);
	const [sessions, setSessions] = useState([]);
	const [displaySessions, setDisplay] = useState([]);
	
	useEffect(() => {
		const getSessions = async () => {
		  const response = await fetch('/api/schedule'); // The result is cached
		  const json = await response.json();
		  const initialSessions = json.sessions;
		  setSessions(initialSessions);
		  setDisplay(initialSessions);
		};
		
		getSessions();
	}, []);
	
	useEffect(() => {
		const getDates = async () => {
		  const response = await fetch('/api/conference-dates'); // The result is cached
		  const json = await response.json();
		  setDates(json);
		};

		getDates();
	}, []);
	
	function handleDateChange(date) {
        const filteredSessions = sessions.filter(session => session.date.startsWith(event.target.value));
        setDisplay(filteredSessions);
    }
  
  return (
	<main className={styles.main}>
		<div id="schedule">
			<select id="date" onChange={e => handleDateChange(e.target.value)}>
				<option value="">--Select Date--</option>
				{
					dates.map((date) => (<option value={date.name}>{date.name}</option>))
				}
			</select>
			<div className={styles.grid}>
				{
						displaySessions.map(session =>
                            <Session
                                session={session}
                                presentations={session.presentations}
                                key={session.id}>
                            </Session>
                        )
				}
			</div>
		</div>
	</main>
  )
}

import { useState } from 'react'
import styles from '@/styles/Schedule_Editor.module.css'
import Presentation from '../presentations/Presentation2'

export default function Session({ dates, locations, sessions, papers, index, count }) {
	const [keys, setKeys] = useState(["key_1"]);
	
	function addPresentation() {
		const key = 'key_' + (keys.length + 1);
		setKeys([...keys, key]);
	}
	
	function removePresentation() {
		if (keys.length > 1) {
			keys.pop();
			setKeys([...keys]);
		}
	}
	
	return (
		<div className={styles.session}>
						<label htmlFor={"title_" + index}>Title:</label>
						<input type="text" id={"title_" + index} name={"sessions["+index+"][title]"} value={sessions[index] && sessions[index].title} required />
						
						<label htmlFor={"location_" + index}>Location:</label>
						<select id={"location_" + index} name={"sessions["+index+"][location]"} value={sessions[index] && sessions[index].location} required>
							<option value="">--Select Location--</option>
							{
								locations.map((location) => (<option value={location.name}>{location.name}</option>))
							}
						</select>
						
						<label htmlFor={"date_" + index}>Date:</label>
						<select id={"date_" + index} name={"sessions["+index+"][date]"} value={sessions[index] && sessions[index].date} required>
							<option value="">--Select Date--</option>
							{
								dates.map((date) => (<option value={date.name}>{date.name}</option>))
							}
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
								<tbody id={"presentations_" + index}>
									{
										keys.map(key =>
											<Presentation
												presentations={sessions[index] && sessions[index].presentations}
												papers={papers}
												index1={index}
												index2={key.substring(4)-1}
												count={keys.length}
												key={key}>
											</Presentation>
										)
									}
								</tbody>
							</table>
							<button type="button" className={styles.action_btn + " " + styles.add} id={"add-presentation-btn-" + index} onClick={addPresentation}>Add Presentation</button>
							<button type="button" className={styles.action_btn + " " + styles.remove} id={"remove-presentation-btn-" + index} onClick={removePresentation}>Remove Presentation</button>
						</section>
			</div>
	)
}

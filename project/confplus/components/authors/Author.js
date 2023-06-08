import styles from '@/styles/Submit_Paper.module.css'

export default function Author({ affiliations, index, count }) {

    // Check only one presenter is checked
	function validate(checkbox_id) {
		const checkBox = document.getElementById(checkbox_id);		
		if (checkBox.checked == true) {
			for (let i = 0; i < count; i++) {
				const id = 'presenter_' + i;
				const cb = document.getElementById(id);
				if (cb.checked == true && id != checkbox_id) {
					checkBox.checked = false;
					alert('Only one presenter can be checked');
				}
			}
		}
	}
	
	return (
		<div className={styles.author}>
			<label htmlFor={'first_name_' + index}>First Name:</label>
			<input type="text" id={'first_name_' + index} name={"authors["+index+"][first_name]"} required />
			<label htmlFor={'last_name_' + index}>Last Name:</label>
			<input type="text" id={'last_name_' + index} name={"authors["+index+"][last_name]"} required />
			<label htmlFor={'email_' + index}>Email:</label>
			<input type="email" id={'email_' + index} name={"authors["+index+"][email]"} required />
			<label htmlFor={'affiliation_' + index}>Affiliation:</label>
			<select id={'affiliation_' + index} name={"authors["+index+"][affiliation]"} required>
				<option value="">--Select Affiliation--</option>
				{
					affiliations.map((affiliation) => (<option value={affiliation.name}>{affiliation.name}</option>))
				}
			</select>
			<label htmlFor={'presenter_' + index}>Presenter:</label>
			<input type="checkbox" id={'presenter_' + index} name={"authors["+index+"][presenter]"} value="true" onClick={e => validate('presenter_' + index)} />
		</div>
	)
}

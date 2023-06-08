import styles from '@/styles/Submit_Paper.module.css'

export default function Presentation({ presentations, papers, index1, index2, count }) {
	
	// Write the name of paper presenter
	function fill(paper_title, presenter_id) {
		papers.forEach(paper => {
			if (paper.paper_title === paper_title) {
				paper.authors.forEach(author => {
					if (author.presenter) {
						const name = author.first_name + ' ' + author.last_name;
						document.getElementById(presenter_id).value = name;
					}
				});
			}
		});
	}
	
	return (
		<tr>
			<td>
				<select id={"paper_"+index1+"_"+index2} name={"paper_"+index1+"_"+index2} onChange={e => fill(e.target.value, "presenter_"+index1+"_"+index2)} value={presentations && presentations[index2] && presentations[index2].paper_title} required>
					<option value="">-- Select Paper --</option>
					{
						papers.map((paper) => (<option value={paper.paper_title}>{paper.paper_title}</option>))
					}
				</select>
			</td>
			<td><input type="text" id={"presenter_"+index1+"_"+index2} name={"presenter_"+index1+"_"+index2} value={presentations && presentations[index2]? presentations[index2].presenter_name : ''} readonly required /></td>
			<td><input type="time" id={"from_time_"+index1+"_"+index2} name={"from_time_"+index1+"_"+index2} value={presentations && presentations[index2] && presentations[index2].from_time} required /></td>
			<td><input type="time" id={"to_time_"+index1+"_"+index2} name={"to_time_"+index1+"_"+index2} value={presentations && presentations[index2] && presentations[index2].to_time} required /></td>
		</tr>
	)
}

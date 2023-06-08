import styles from '@/styles/Home.module.css'

export default function Presentation({ presentation }) {

    return (

				<div className={styles.presentation}>
					<h3>{presentation.paper_title}</h3>
					<p>Presenter: {presentation.presenter_name}</p>
					<p>Time: {presentation.from_time} - {presentation.to_time}</p>
				</div>
	)
}

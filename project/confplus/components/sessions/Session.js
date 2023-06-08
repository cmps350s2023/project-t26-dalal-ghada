import styles from '@/styles/Home.module.css'
import Presentation from '../presentations/Presentation'

export default function Session({ session, presentations }) {

    return (
		<div className={styles.session}>
			<h2>{session.title}</h2>
			<p>Location: {session.location}</p>
			<p>Date: {session.date}</p>
			<div className={styles.presentations}>
				{
					presentations.map(p =>
                            <Presentation
                                presentation={p}
                                key={p.id}>
                            </Presentation>
                        )
				}
			</div>
		</div>
	)
}

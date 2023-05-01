import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from './page.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Move to ConfPlus App by clicking <a href="/index.html">here</a> to redirect to home page in&nbsp;
          <code className={styles.code}>public/index.html</code>
        </p>
      </div>
    </main>
  )
}

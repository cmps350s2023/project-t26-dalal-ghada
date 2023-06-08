import React from 'react';
import Link from 'next/link';
import { useCookies } from 'react-cookie';
import {useState, useEffect} from 'react';
import styles from '../styles/Header.module.css';
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Header() {
	const { data: session } = useSession();
	const [cookies, setCookie, removeCookie] = useCookies(['user']);
	const [user, setUser] = useState(false);
	
	const router = useRouter()
	
	useEffect(() => {
		if (session) {
			setCookie("user", JSON.stringify(session.user), {
			path: "/",
			maxAge: 3600, // 1 hour
		  })
		}
	}, [session]);
	
	useEffect(() => {
		if (cookies['user']) {
			setUser(cookies['user'].name);
		}
		else
			setUser(false);
	}, [cookies]);
	
	function submitPaperPage() {
		if (cookies['user']) {
			const user = cookies['user'];
			if (user.role === "author")
				router.push('/submit-paper');
			else
				router.push('/');
		} else {
			router.push('/login');
		}
	}
	
	function reviewPaperPage() {
		if (cookies['user']) {
			const user = cookies['user'];
			if (user.role === "reviewer")
				router.push('/review-paper');
			else
				router.push('/');
		} else {
			router.push('/login');
		}
	}

	function scheduleEditorPage() {
		if (cookies['user']) {
			const user = cookies['user'];
			if (user.role === "organizer")
				router.push('/schedule-editor');
			else
				router.push('/');
		} else {
			router.push('/login');
		}
	}
	
	const handleSignout = (e) => {
		removeCookie('user');
		if (session) {
			e.preventDefault()
			signOut()
		}
		window.location.href = '/';
	}
	
    return (
		<header className={styles.header}>
			<Link href="/"><img src="img/logo.jpg" alt="ConfPlus App Image" /></Link >
			<nav>
				<ul>
					<li><Link href="/">Home</Link ></li>
					<li><Link href="#" onClick={submitPaperPage}>Submit Paper</Link ></li>
					<li><Link href="#" onClick={reviewPaperPage}>Review Papers</Link ></li>
					<li><Link href="#" onClick={scheduleEditorPage}>Schedule Editor</Link ></li>
				</ul>
			</nav>
			{ user && <p className={styles.pelcome}>Welcome {user}<span className={styles.logout} onClick={handleSignout}>, Logout?</span></p> }
			{ !user && <Link href="/login"><button className={styles.login}>Login</button></Link> }
		</header>
    )
}

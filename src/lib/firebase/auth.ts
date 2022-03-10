import { authState } from 'rxfire/auth';
import { authStore } from '$lib/stores/auth';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from '@firebase/auth';
import type { FirebaseApp } from 'firebase/app';

export const authListener = () => {
	authState(getAuth()).subscribe(async (user) => {
		if (user) {
			const token = await user.getIdToken(true);
			//const idTokenResult = await user.getIdTokenResult();
			authStore.set({ status: 'in', user, token });
			localStorage.setItem('token', token);
		}
	});
};

export const signInWithFacebook =
	(firebaseApp) =>
	({ redirect = false }) => {
		firebaseApp.subscribe(async (app) => {
			const authProvider = new app.auth.FacebookAuthProvider();
			try {
				redirect === true
					? await app.auth().signInWithRedirect(authProvider)
					: await app.auth().signInWithPopup(authProvider);
			} catch (error) {
				/* eslint-disable no-console */
				console.log(error);
			}
		});
	};
export const signInWithGoogle =
	(firebaseApp) =>
	({ redirect = false }) => {
		firebaseApp.subscribe(async (app: FirebaseApp) => {
			const auth = getAuth();
			const authProvider = new GoogleAuthProvider();
			try {
				redirect === true
					? await signInWithRedirect(auth, authProvider)
					: await signInWithPopup(auth, authProvider);
			} catch (error) {
				/* eslint-disable no-console */
				console.log(error);
			}
		});
	};

export const signOut = (firebaseApp) => () => {
	firebaseApp.subscribe(async (app) => {
		const auth = getAuth();
		try {
			await auth.signOut();
			authStore.set({ status: 'out', user: null, token: null });
			localStorage.removeItem('token');
		} catch (error) {
			/* eslint-disable no-console */
			console.log(error);
		}
	});
};

import { collectionData } from 'rxfire/firestore';
import { publicStore, privilagedStore } from '$lib/stores/collection';
import { of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

import { authState } from 'rxfire/auth';
import {
	getFirestore,
	collection,
	query,
	where,
	addDoc,
	doc,
	deleteDoc
} from '@firebase/firestore';
import { getAuth } from '@firebase/auth';

export const collectionListener = () => {
	collectionData(collection(getFirestore(), 'publiclist'), { idField: 'uid' }).subscribe(
		async (data) => {
			publicStore.set(data);
			localStorage.setItem('publiclist', JSON.stringify(data));
		}
	);

	authState(getAuth())
		.pipe(
			switchMap((user) => {
				const db = getFirestore();
				if (user) {
					const q = query(collection(db, 'privilagedlist'), where('user', '==', user.uid));
					return collectionData(q, {
						idField: 'uid'
					});
				} else {
					return of([]);
				}
			})
		)
		.pipe(
			catchError((err) => {
				console.log(err);
				return of([]);
			})
		)
		.subscribe(async (data) => {
			privilagedStore.set(data);
			localStorage.setItem('privilagedlist', JSON.stringify(data));
		});
};

export const addItemToCollection = (firebaseApp) => (collectionName) => {
	firebaseApp.subscribe(async (app) => {
		const user = getAuth().currentUser;
		const string = `${collectionName} item (sveltekit) ${(Math.random() * 101) | 0}`;
		const coll = collection(getFirestore(), collectionName);
		if (collectionName == 'privilagedlist') {
			user &&
				addDoc(coll, {
					name: string,
					user: user.uid
				});
		} else {
			addDoc(coll, {
				name: string,
				user: (user == null ? undefined : user.uid) || 'anon'
			});
		}
	});
};

export const removeItemFromCollection = (firebaseApp) => (collectionName) => {
	firebaseApp.subscribe(async (app) => {
		const user = getAuth().currentUser;
		//const string = `${collectionName} item (sveltekit) ${(Math.random() * 101) | 0}`;
		const coll = collection(getFirestore(), collectionName);

		//if (collectionName == 'publiclist' || user) {
		//	deleteDoc(doc(db, collectionName));
		//	coll
		//		//.orderBy("name")
		//		.orderBy(app.firestore.FieldPath.documentId())
		//		.limit(1)
		//		.get()
		//		.then(function (querySnapshot) {
		//			querySnapshot.forEach(function (doc) {
		//				doc.ref.delete();
		//			});
		//		});
		//}
	});
};

import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export function setProp(challenge, props: Record<string, any>) {
  for (let prop in props) {
    challenge[prop] = props[prop];
  }
  return challenge;
};


const cachedAuthors = {};
export async function getAuthor(authorId) {
	if (typeof authorId !== "string") {
		throw new Error("authorId must be a string");
	}
	if (cachedAuthors[authorId]) {
		return cachedAuthors[authorId];
	}
	const snap = await getDoc(doc(db, "users", authorId))
	if (snap.exists()) {
		const data = snap.data();
		cachedAuthors[authorId] = data;
		return data;
	}
	return null;
}

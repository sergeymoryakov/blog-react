import { initializeApp } from "firebase/app";
import {
    getFirestore,
    updateDoc,
    collection,
    doc,
    setDoc,
    deleteDoc,
    getDocs,
    query,
    orderBy,
} from "firebase/firestore";
import { firebaseKeys, DB_NAME } from "../config/firebase-config";

// Initialize Firebase and Firestore Cloud
const appFirebase = initializeApp(firebaseKeys);
const db = getFirestore(appFirebase);

export const getItemsFromFirestore = async (COLLECTION_NAME) => {
    try {
        // For test purposes, remove in production
        console.log("getItemsFromFirestore() has been called.");

        // Display to console 'firebaseKeys, DB_NAME, COLLECTION_NAME'
        // console.log(firebaseKeys, DB_NAME, COLLECTION_NAME);

        const ref = collection(db, COLLECTION_NAME);

        // Option: Sort the items by date, descending:
        const q = query(ref, orderBy("date", "desc"));
        // const q = query(ref);

        const blogArticles = [];
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            const itemDb = {};
            itemDb.id = doc.id;
            itemDb.body = doc.data().body;
            itemDb.date = doc.data().date;
            itemDb.source = doc.data().source;
            itemDb.title = doc.data().title;
            itemDb.completed = doc.data().completed;
            blogArticles.push(itemDb); // push the itemDb object into the blogArticles array

            // Display to console the document id and source
            // console.log(
            //     `Document from "${doc.data().source}", id = "${
            //         doc.id
            //     }" have been read.`
            // );
        });
        console.log(blogArticles);
        return blogArticles;
    } catch (error) {
        console.error("Error getting documents: ", error);
    }
};

export const addItemToFirestore = async (item) => {
    // For test purposes, remove in production
    console.log(`addItemToFirestore() has been called for item: ${item}`);

    try {
        const docRef = doc(db, DB_NAME, item.id); // Use the UUID as the doc id
        await setDoc(docRef, item);
        console.log("Document successfully written with ID:", item.id);
    } catch (error) {
        console.error("Error adding document: ", error);
    }
};

export const updateItemInFirestore = async (itemId, updatedFields) => {
    try {
        const docRef = doc(db, DB_NAME, itemId);
        await updateDoc(docRef, updatedFields);
        console.log("Document successfully updated in Firestore!");
    } catch (error) {
        console.error("Error updating document in Firestore: ", error);
    }
};

export const deleteItemFromFireStore = async (itemId) => {
    try {
        await deleteDoc(doc(db, DB_NAME, itemId));
    } catch (error) {
        console.error("Error deleting document from Firestore", error);
    }
};

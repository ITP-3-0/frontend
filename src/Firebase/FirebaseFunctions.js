import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./Initialize";
import { useButton } from "@/app/Contexts/ButtonContext";

export const register = async (email, password, censusNo) => {
    try {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                // API call to store user in database
            })
            .then(() => {})
            .then(() => {
                window.location.href = "/portal";
            });
    } catch (error) {
        return error;
    }
};

export const login = async (email, password) => {
    try {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
            })
            .then(() => {
                window.location.href = "/portal";
            });
    } catch (error) {
        console.error(error);
    }
};

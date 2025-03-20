import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./Initialize";

export const register = async (email, password, censusNo) => {
    const getUsernameFromEmail = (email) => {
        return email.split("@")[0];
    };

    try {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                // API call to store user in database
                fetch("/api/users", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        _id: user.uid,
                        username: getUsernameFromEmail(email),
                        censusNo: censusNo,
                        email: email,
                        role: "client",
                    }),
                });
            })
            .then(() => {
                window.location.href = "/portal";
            });
    } catch (error) {
        return error;
    }
};

export const login = async (email, password) => {
    try {
        signInWithEmailAndPassword(auth, email, password).then(() => {
            window.location.href = "/portal";
        });
    } catch (error) {
        console.error(error);
    }
};

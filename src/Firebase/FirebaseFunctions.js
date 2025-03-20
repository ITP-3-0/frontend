import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./Initialize";
import { toast } from "sonner";

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
            })
            .catch((error) => {
                if (error.code === "auth/email-already-in-use") {
                    toast.error("Email is already in use. Please try again.");
                } else if (error.code === "auth/weak-password") {
                    toast.error("Password is too weak. Please try again.");
                } else {
                    toast.error(error.message);
                }
            });
    } catch (error) {
        toast.error("An error occurred. Error: " + error.message);
        return error;
    }
};

export const login = async (email, password) => {
    try {
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                window.location.href = "/portal";
            })
            .catch((error) => {
                if (error.code === "auth/invalid-credential") {
                    toast.error("Invalid credentials. Please try again.");
                } else {
                    toast.error(error.message);
                }
            });
    } catch (error) {
        console.error(error);
    }
};

export const logout = async () => {
    try {
        signOut(auth)
            .then(() => {
                window.location.href = "/";
            })
            .catch((error) => {
                console.error(error);
            });
    } catch (error) {
        console.error(error);
    }
};

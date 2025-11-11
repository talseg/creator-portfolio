import { useEffect, useState } from "react"
import type { Project } from "../../database/dbInterfaces";
import { FirebaseDb } from "../../database/FirebaseDb";
import { getExceptionString, logException } from "../../utilities/exceptionUtils";
import styled from "styled-components";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../../database/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

const Wrapper = styled.div`
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 10px;
    color: black;
`;

const InputWithHeader = styled.div`
  display: flex;
`;
const TextHeader = styled.div`
  min-width: 150px;  
`;

export const AdminPage: React.FC = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [projects, setProjects] = useState<Project[]>([]);
    const [firstProjectName, setFirstProjectName] = useState<string | undefined>("");

    useEffect(() => {
        // 🔹 Track login state reliably
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log("Auth state changed, user:", user);
            setIsLoggedIn(!!user);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);


    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Login success");
            setIsLoggedIn(true);
        }
        catch (e) {
            alert("login Failed");
            setIsLoggedIn(false);
        }
    }

    const handleUpdateDB = async () => {
        const projectId = projects[0]?.id;
        if (!projectId) return;
        const projectRef = doc(db, "projects", projectId);
        console.log(projectId);
        console.log("auth.currentUser: ", auth.currentUser);

        try {
            await updateDoc(projectRef, { projectName: firstProjectName });
            alert(`Update Project name OK`);
        }
        catch (e) {
            alert(`Update Project name failed: ${(e as Error).message}`);
        }
    }

    const handleSignOut = async () => {
        try {
            if (window.confirm("Are you sure you want to sign out?")) {

                await signOut(auth);
                setIsLoggedIn(false);
            }

        }
        catch (e) {
            logException(e, "Can not log out");
            throw e;
        }

    }

    useEffect(() => {

        const loadProjects = async () => {
            try {

                const projectsData = await FirebaseDb.fetchProjects();
                setProjects(projectsData);
                setFirstProjectName(projectsData[0]?.projectName);
            } catch (err) {
                logException(err);
                // ToDo - remove, just for first dev
                alert(getExceptionString(err))
            }
        }
        loadProjects();

    }, []);

    console.log("render isLoggedIn: ", isLoggedIn);

    return (
        <Wrapper>

            <InputWithHeader>
                <TextHeader>Email: </TextHeader>
                <input type="email" value={email} onChange={(e) => { setEmail(e.target.value) }}></input>
            </InputWithHeader>
            <InputWithHeader>
                <TextHeader>Password: </TextHeader>
                <input type="password" value={password} onChange={(e) => { setPassword(e.target.value) }}></input>
            </InputWithHeader>

            <div>
                <button onClick={() => handleLogin()}>Login</button>
            </div>

            <div>{isLoading ? "Loading..." : isLoggedIn ? "LoggedIn" : "Not LoggedIn"}</div>

            <div>
                <button onClick={handleUpdateDB}>Update DB</button>
            </div>

            <InputWithHeader>
                <TextHeader>First Project Name: </TextHeader>
                <input
                    value={firstProjectName} onChange={(e) => setFirstProjectName(e.target.value)} />
            </InputWithHeader>

            <div>
                <button onClick={handleSignOut}>Sign Out</button>
            </div>

            <div>
                Number of projects in DB: {projects.length}
            </div>

        </Wrapper>
    )
}
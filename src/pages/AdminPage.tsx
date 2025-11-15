import { useEffect, useState } from "react"
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";

import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../database/firebaseConfig";
import { FirebaseDb } from "../database/FirebaseDb";
import type { DatabaseType, Project } from "../database/dbInterfaces";

import { getExceptionString, logException } from "../utilities/exceptionUtils";
import { EmailPasswordDialog } from "../components/userPassword/EmailPasswordDialog";
import styled from "styled-components";
import { ProjectTable } from "../components/projectsTable/ProjectTable";

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

    const [isLoading, setIsLoading] = useState(true);
    const [projects, setProjects] = useState<Project[]>([]);
    const [firstProjectName, setFirstProjectName] = useState<string | undefined>("");
    const [isLoginDialogOPen, setIsLoginDialogOPen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [email, setEmail] = useState<string | null>(null);
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const database: DatabaseType = FirebaseDb;

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const projectsData = await database.fetchProjectsWithImages();
                setProjects(projectsData);
                setIsLoading(false);
                setFirstProjectName(projectsData[0]?.projectName);
            } catch (err) {
                logException(err);
                setError(getExceptionString(err));
            }
        }
        loadProjects();
    }, [database]);



    useEffect(() => {
        // 🔹 Track login state reliably
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoading(false);

            if (user) {
                console.log(user);
                setIsLoggedIn(true);
                setEmail(user?.email);
            }
            else {
                setIsLoginDialogOPen(true);
                setHasError(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (email: string, password: string): Promise<void> => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setIsLoggedIn(true);
            setIsLoginDialogOPen(false);
            setHasError(false);
        }
        catch (e) {
            setIsLoggedIn(false);
            setHasError(true);
        }
    }

    const handleUpdateDB = async () => {
        const projectId = projects[0]?.id;
        if (!projectId) return;
        const projectRef = doc(db, "projects", projectId);

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

    const handleSignIn = async () => {
        setIsLoginDialogOPen(true);
        setHasError(false);
    }

    const renderLoginOptions = () => {
        if (isLoading)
            return (<>Loading...</>);
        if (isLoggedIn)
            return (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ marginRight: "14px" }}>
                        {email}
                    </div>
                    <button onClick={handleSignOut}>Sign Out</button>
                </div>
            );
        return (
            <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ marginRight: "14px" }}>
                    Please sign in:
                </div>
                <button onClick={handleSignIn}>Sign In</button>
            </div>
        );
    }

    if (error) return <>Projects Load Error</>

    return (
        <Wrapper>

            <EmailPasswordDialog
                open={isLoginDialogOPen}
                onSubmit={handleSubmit}
                hasError={hasError}
                onClose={() => { setIsLoginDialogOPen(false) }}
            />

            <div>
                {renderLoginOptions()}
            </div>

            <div>
                <button onClick={handleUpdateDB}>Update DB</button>
            </div>

            <InputWithHeader>
                <TextHeader>First Project Name: </TextHeader>
                <input
                    value={firstProjectName} onChange={async (e) => {
                        setFirstProjectName(e.target.value);
                        const newProjectsData = await database.fetchProjectsWithImages();
                        const newProjects = [...newProjectsData];
                        setProjects(newProjects);
                    }


                    } />
            </InputWithHeader>

            <div>
                Number of projects in DB: {projects.length}
            </div>

            {projects && <ProjectTable projects={projects} setProjects={setProjects} />}

        </Wrapper>
    )
}
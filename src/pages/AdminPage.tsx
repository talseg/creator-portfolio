import { useEffect, useState } from "react"
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../database/firebaseConfig";
import type { Project } from "../database/dbInterfaces";
import { getExceptionString, logException } from "../utilities/exceptionUtils";
import { EmailPasswordDialog } from "../components/userPassword/EmailPasswordDialog";
import { ProjectTable } from "../components/projectsTable/ProjectTable";
import styled from "styled-components";
import { addNewProjectByName, fetchProjectsWithImages, updateProjects } from "../database/FirebaseDb";
import { CircularProgress } from "@mui/material";
import { ProjectTableContext } from "../components/projectsTable/ProjectTableContext";

const Wrapper = styled.div`
    display: grid;
    width: 100vw;
    height: 100vh;
`;

const StyledSpinner = styled(CircularProgress)`
  grid-row: 1;
  grid-column: 1;
  align-self: center;
  justify-self: center;
`;

const PageWrapper = styled.div`
    grid-row: 1;
    grid-column: 1;
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
const DirtyWrapper = styled.div`
  font-size: 46px;
  height: auto;
  height: 0px;
  margin-top: -14px;
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
  const [projectName, setProjectName] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true);
        const projectsData = await fetchProjectsWithImages();
        setProjects(projectsData);
        setIsLoading(false);
        setFirstProjectName(projectsData[0]?.projectName);
      } catch (err) {
        logException(err);
        setError(getExceptionString(err));
      }
    }
    loadProjects();
  }, []);

  useEffect(() => {
    // 🔹 Track login state reliably
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catch (_) {
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

  const handleUpdateAllProjects = async () => {
    console.log("calling update all projects");
    await updateProjects(projects);
    setIsDirty(false);
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

  const getLastProjectIndex = (): number => {
    if (!projects || projects.length === 0)
      return 1;
    return projects[projects.length - 1]!.projectIndex;
  }

  if (error) return <>Projects Load Error</>

  if (isLoading) return <Wrapper><StyledSpinner /></Wrapper>;

  const handleUpdateProject = (project: Project) => {
    const projectToReplace = projects.find((p) => p.id === project.id);

    if (projectToReplace) {
      setIsDirty(true);
      setProjects((projs) => {
        return projs.map(p => p.id === project.id ? project : p);
      });
    }
  }

  return (
    <PageWrapper>
      <EmailPasswordDialog
        open={isLoginDialogOPen}
        onSubmit={handleSubmit}
        hasError={hasError}
        onClose={() => { setIsLoginDialogOPen(false) }}
      />

      <div style={{ display: "flex", gap: "1rem" }}>
        {renderLoginOptions()}
        <button onClick={handleUpdateAllProjects}>Save</button>
        {isDirty && <DirtyWrapper>*</DirtyWrapper>}
      </div>

      {projects &&

        <ProjectTableContext value={{
          projects,
          updateProject: handleUpdateProject,
        }}
        >
          <ProjectTable
            projects={projects}
            setProjects={setProjects}
          />

        </ProjectTableContext>
      }
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={handleUpdateDB}>Update DB</button>
        <button onClick={async () => {
          if (!projectName) {
            alert("please update project name before adding it");
            return;
          }
          await addNewProjectByName(projectName, getLastProjectIndex() + 1);
          setIsLoading(true);
          const newProjects = await fetchProjectsWithImages();
          setProjects([...newProjects]);
          setIsLoading(false);
        }}>Add Project</button>

      </div>

      <InputWithHeader>
        <TextHeader>New project name:</TextHeader>
        <input
          value={projectName}
          onChange={async (e) => {
            const projectName = e.target.value;
            setProjectName(projectName);
          }}
        />
      </InputWithHeader>

      <InputWithHeader>
        <TextHeader>First Project Name: </TextHeader>
        <input
          value={firstProjectName}
          onChange={async (e) => {
            const newProjectName = e.target.value;
            setFirstProjectName(newProjectName);
            if (projects && projects[0]) {
              projects[0].projectName = newProjectName;
            }
          }}
        />
      </InputWithHeader>

      <div>
        Number of projects in DB: {projects.length}
      </div>

    </PageWrapper>
  )
}
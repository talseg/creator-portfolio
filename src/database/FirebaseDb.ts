import { collection, doc, getDoc, getDocs, orderBy, query, updateDoc, WriteBatch, writeBatch } from "firebase/firestore";
import { db } from "./firebaseConfig";
import type { Project, Image } from "./dbInterfaces";

// ToDo - Move to MobX
const fetchFirebaseProjects = async (): Promise<Project[]> => {
  const q = query(collection(db, "projects"), orderBy("projectIndex", "asc"));
  const snapshot = await getDocs(q);

  const projects = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Project, "id">),
  }))
    .sort((a, b) => a.projectIndex - b.projectIndex);
  return (projects)
};

export const fetchProjectById = async (id: string): Promise<Project> => {
  const docRef = doc(db, "projects", id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) throw new Error("Project not found");

  const projectData = snap.data() as Omit<Project, "id" | "images">;

  const imagesColRef = collection(docRef, "images");
  const imagesSnap = await getDocs(imagesColRef);
  const images = imagesSnap.docs
    .map(doc => doc.data() as Image)
    .sort((a, b) => a.imageIndex - b.imageIndex);

  const projectWithImages: Project = {
    id: snap.id,
    ...projectData,
    images
  }
  return projectWithImages;
}

const fetchFirebaseProjectsWithImages = async (): Promise<Project[]> => {
  const projects = await fetchFirebaseProjects();
  const fullProjects: Project[] = [];

  for (let index = 0; index < projects.length; index++) {
    if (!projects[index]) break;
    const projectId = projects[index]?.id;
    if (!projectId) break;
    const projectWithImages = await fetchProjectById(projectId);
    fullProjects.push(projectWithImages);
  }
  return fullProjects;
}

const addProjectToBatch = (project: Project, batch: WriteBatch): void => {
  const { id, ...data } = project;
  delete data.images; 
  const projectRef = doc(db, "projects", id);
  batch.update(projectRef, data);
};

const addProjectsToBatch = (projects: Project[], batch: WriteBatch): void =>
  projects.forEach((project) => addProjectToBatch(project, batch));

const updateProject = async (project: Project): Promise<void> => {
  const batch = writeBatch(db);
  addProjectToBatch(project, batch);
  await batch.commit();
}

const updateProjects = async (projects: Project[]): Promise<void> => {
  const batch = writeBatch(db);
  addProjectsToBatch(projects, batch);
  await batch.commit();
}

interface DatabaseType {
  fetchProjects: () => Promise<Project[]>;
  fetchProjectById: (id: string) => Promise<Project>;
  fetchProjectsWithImages: () => Promise<Project[]>;
  updateProject: (project: Project) => Promise<void>;
  updateProjects: (project: Project[]) => Promise<void>;

}

export const FirebaseDb: DatabaseType = {
  fetchProjects: fetchFirebaseProjects,
  fetchProjectById: fetchProjectById,
  fetchProjectsWithImages: fetchFirebaseProjectsWithImages,
  updateProjects: updateProjects,
  updateProject: updateProject
}
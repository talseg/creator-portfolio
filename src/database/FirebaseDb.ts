import { collection, CollectionReference, doc, getDoc, getDocs, orderBy, query, setDoc, WriteBatch, writeBatch, type DocumentData } from "firebase/firestore";
import { db, storage } from "./firebaseConfig";
import type { Project, Image } from "./dbInterfaces";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

// ToDo - Move to MobX
export const fetchProjects = async (): Promise<Project[]> => {
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

  console.log(`In fetchProjectById`);

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

export const fetchProjectsWithImages = async (): Promise<Project[]> => {
  const projects = await fetchProjects();
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

export const updateProject = async (project: Project): Promise<void> => {
  const batch = writeBatch(db);
  addProjectToBatch(project, batch);
  await batch.commit();
}

export const updateProjects = async (projects: Project[]): Promise<void> => {
  const batch = writeBatch(db);
  addProjectsToBatch(projects, batch);
  await batch.commit();
}

const uploadToStorage = async (projectId: string, imageFile: File): Promise<string> => {
  const filename = imageFile.name;
  const imageStorageRef = ref(storage, `projects/${projectId}/images/${filename}`);
  await uploadBytes(imageStorageRef, imageFile);
  return await getDownloadURL(imageStorageRef);
}

const getProjectImages = async (imagesColRef: CollectionReference<DocumentData, DocumentData>
): Promise<Image[]> => {
  //const imagesColRef = collection(db, "projects", projectId, "images");
  const imagesSnap = await getDocs(imagesColRef);
  const images = imagesSnap.docs
    .map(d => ({ id: d.id, ...(d.data() as Omit<Image, "id">) }))
    .sort((a, b) => a.imageIndex - b.imageIndex);
  return images;
}

const getNextImageIndex = (images: Image[]): number => {
  if (images.length === 0) return 1;
  const lastImage = images[images.length - 1];
  return lastImage!.imageIndex + 1;
}

export const addImageToProject = async (projectId: string, imageFile: File): Promise<void> => {
  const url = await uploadToStorage(projectId, imageFile);
  const imagesColRef = collection(db, "projects", projectId, "images");
  const images = await getProjectImages(imagesColRef);
  const newImage: Omit<Image, "id"> = {
    imageUrl: url,
    imageIndex: getNextImageIndex(images)
  };
  const newDocRef = doc(imagesColRef); // auto-id
  await setDoc(newDocRef, newImage);
}



interface DatabaseType {
  fetchProjects: () => Promise<Project[]>;
  fetchProjectById: (id: string) => Promise<Project>;
  fetchProjectsWithImages: () => Promise<Project[]>;
  updateProject: (project: Project) => Promise<void>;
  updateProjects: (project: Project[]) => Promise<void>;
  addImageToProject: (projectId: string, imageFile: File) => Promise<void>;
}

export const FirebaseDb: DatabaseType = {
  fetchProjects: fetchProjects,
  fetchProjectById: fetchProjectById,
  fetchProjectsWithImages: fetchProjectsWithImages,
  updateProjects: updateProjects,
  updateProject: updateProject,
  addImageToProject: addImageToProject
}
import { collection, CollectionReference, deleteDoc, doc, getDoc, getDocs, orderBy, query, setDoc, updateDoc, WriteBatch, writeBatch, type DocumentData } from "firebase/firestore";
import { db, storage } from "./firebaseConfig";
import type { Project, Image } from "./dbInterfaces";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { logException } from "../utilities/exceptionUtils";

// ToDo - Move to MobX

export const addNewProjectByName = async (projectName: string, 
  projectIndex: number): Promise<Project> => {
  const docRef = doc(collection(db, "projects"));
  const newProject: Project = {
    id: docRef.id,
    projectName: projectName,
    header: "",
    projectImageUrl: "",
    category: "designer",
    projectIndex: projectIndex,
    images: [],
    projectYear: 2023,
    designedAt: "THE STUDIO (Avigail Reiner)"
  };
  await setDoc(docRef, newProject);
  return newProject;
}

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

export const fetchProject = async (projectId: string): Promise<Project> => {
  const docRef = doc(db, "projects", projectId);
  const snap = await getDoc(docRef);
  const projectData = snap.data() as Omit<Project, "id" | "images">;
  const project: Project = {
    ...projectData,
    id: projectId,
  }
  return project;
}

/**
 * Extracts the Firebase Storage path from a download URL.
 * Example:
 *   https://.../o/projects%2F123%2Fimg.png?alt=media
 * → "projects/123/img.png"
 */
export function extractStoragePathFromUrl(downloadUrl: string): string {
  const match = downloadUrl.match(/\/o\/([^?]+)/);
  if (!match || !match[1]) {
    throw new Error("Invalid Firebase Storage download URL");
  }
  return decodeURIComponent(match[1]);
}

/**
 * Deletes a Firebase Storage file using only the download URL.
 */
export async function deleteByDownloadUrl(downloadUrl: string): Promise<void> {
  const storagePath = extractStoragePathFromUrl(downloadUrl);
  const fileRef = ref(storage, storagePath);
  await deleteObject(fileRef);
}


export const removeProjectImage = async (projectId: string) => {
  const projectRef = doc(db, "projects", projectId);
  const snap = await getDoc(projectRef);
  if (!snap.exists()) {
    throw new Error(`Project ${projectId} does not exist`);
  }

  const projectData = snap.data();
  const url: string | undefined = projectData?.projectImageUrl;
  if (!url) {
    throw new Error(`Project ${projectId} url does not exist`);
  }

  try {
    await deleteByDownloadUrl(url);
  } catch (err) {
    console.error("Failed to delete image from storage:", err);
    throw err;
  }

  await updateDoc(projectRef, { projectImageUrl: "" });
};

export const fetchProjectWithImagesById = async (id: string): Promise<Project> => {

  const docRef = doc(db, "projects", id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) throw new Error("Project not found");

  const projectData = snap.data() as Omit<Project, "id" | "images">;

  const imagesColRef = collection(docRef, "images");
  const imagesSnap = await getDocs(imagesColRef);
  const images = imagesSnap.docs
    .map(d => ({ id: d.id, ...(d.data() as Omit<Image, "id">) }))
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
    const projectWithImages = await fetchProjectWithImagesById(projectId);
    fullProjects.push(projectWithImages);
  }
  return fullProjects;
}

const addProjectToBatch = (project: Project, batch: WriteBatch): void => {
  const { id, ...data } = project;
  project.projectYear = 0;
  project.designedAt = "";
  console.log("project: ", project);
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

export const addImageToProjectImages = async (projectId: string, imageFile: File): Promise<Image> => {
  const url = await uploadToStorage(projectId, imageFile);
  const imagesColRef = collection(db, "projects", projectId, "images");
  const images = await getProjectImages(imagesColRef);
  const newImage: Omit<Image, "id"> = {
    imageUrl: url,
    imageIndex: getNextImageIndex(images)
  };
  const newDocRef = doc(imagesColRef); // auto-id
  await setDoc(newDocRef, newImage);
  return { 
    ...newImage,
    id: newDocRef.id
  };
}

export const addProjectImage = async (projectId: string, projectImageFile: File): Promise<string> => {

  // Upload to Storage
  const storagePath = `projects/${projectId}/projectImage/main_${Date.now()}_${projectImageFile.name}`;
  const storageRef = ref(storage, storagePath);
  await uploadBytes(storageRef, projectImageFile);
  const downloadUrl = await getDownloadURL(storageRef);
  // Update the DB with the Url
  const projectRef = doc(db, "projects", projectId);

  await updateDoc(projectRef, {
    projectImageUrl: downloadUrl
  });
  return downloadUrl;
}

export const removeProjectImageFromImages = async (projectId: string, imageId: string) => {
  const errorString = `project:"${projectId}" image:"${imageId}"`
  const imageDocRef = doc(db, "projects", projectId, "images", imageId);
  let snap;
  try {
    snap = await getDoc(imageDocRef);
  }
  catch (e) {
    logException(e);
    alert(`getDoc failed ${errorString}`);
    throw e;
  }

  if (!snap) {
    alert(`getDoc failed ${errorString}`);
    throw new Error(`Got empty snapshot ${errorString}`);
  }
  const data = snap.data();
  if (!data) {
    throw new Error(`No image data ${errorString}`);
  }
  const { imageUrl } = snap.data() as { imageUrl: string };

  // Delete the Image from the storage
  try {
    await deleteByDownloadUrl(imageUrl);
  } catch (err) {
    console.error(`Failed to delete Project Images image from storage: ${errorString}`, err);
    throw err;
  }

  try {
    await deleteDoc(imageDocRef);
  } catch (err) {
    console.error(`Failed to delete image document from Firestore:  ${errorString} `, err);
    throw err;
  }
}

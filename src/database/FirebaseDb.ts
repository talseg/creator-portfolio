import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "./firebaseConfig";
import type { DatabaseType, Project } from "./dbInterfaces";
// ToDo - Move to MobX

const fetchFirebaseProjects = async (): Promise<Project[]> => {
    const q = query(collection(db, "projects"), orderBy("projectIndex", "asc"));
    const snapshot = await getDocs(q);

    const projects = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Project, "id">),
    }));
    return (projects)
};

export const fetchProjectById = async (id: string): Promise<Project> => {
    const docRef = doc(db, "projects", id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) throw new Error("Project not found");
    return { id: snap.id, ...(snap.data() as Omit<Project, "id">) };
}


export const FirebaseDb: DatabaseType = {
    fetchProjects: fetchFirebaseProjects,
    fetchProjectById: fetchProjectById
}
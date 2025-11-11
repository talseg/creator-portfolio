import { collection, getDocs, orderBy, query } from "firebase/firestore";
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

export const FirebaseDb: DatabaseType = {
    fetchProjects: fetchFirebaseProjects
}
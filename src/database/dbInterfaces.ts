
export interface Image {
    imageUrl: string;
    imageIndex: number;
}

export interface Project {
    id: string;
    projectName: string;
    header: string;
    projectImageUrl: string;
    projectIndex: number;
    images?: Image[];
}


export interface DatabaseType {
    fetchProjects : () =>  Promise<Project[]>;
}
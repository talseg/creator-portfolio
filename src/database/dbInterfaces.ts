export interface Image {
    id: string;
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

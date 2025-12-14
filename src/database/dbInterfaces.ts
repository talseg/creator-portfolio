export interface Image {
    id: string;
    imageUrl: string;
    imageIndex: number;
}

export type CategoryType = "designer" | "artist" | "illustrator";

export interface Project {
    id: string;
    projectName: string;
    header: string;
    projectImageUrl: string;
    projectIndex: number;
    category: CategoryType;
    images?: Image[];
}

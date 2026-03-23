
export const categories = ["designer", "artist", "illustrator"] as const;
export type CategoryType = typeof categories[number];

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
    category: CategoryType;
    images?: Image[];
    projectYear: number;
    designedAt: string;
}

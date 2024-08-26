export interface Tag {
    en: string;
    zh: string;
}

export interface TagWithWeight extends Tag {
    weight: number;
}

export interface CategoryTags {
    normal: Record<string, Tag[]>;
    r18?: Record<string, Tag[]>;
}

export interface TagDB {
    [key: string]: CategoryTags;
}



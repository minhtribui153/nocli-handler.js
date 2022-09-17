export type NoCliCategoryConfiguration = {
    [categoryName: string]: NoCliCategoryType;
}

export type NoCliCategoryType = {
    name: string;
    description?: string;
    emoji: string;
}
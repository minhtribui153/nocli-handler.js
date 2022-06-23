export default async <T>(filePath: string) => {
    const file = await import(filePath);
    return file?.default as T;
}
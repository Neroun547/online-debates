export function getImageExtByMimetype(mimetype: string): string | undefined {
    if (mimetype === "image/png") {
        return ".png";
    }
    if (mimetype === "image/webp") {
        return ".webp";
    }
    if (mimetype === "image/jpeg") {
        return ".jpeg";
    }
    if (mimetype === "image/jpg") {
        return ".jpg";
    }
}

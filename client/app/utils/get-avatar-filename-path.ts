export function getAvatarFilenamePath(filename: string | null): string {
    if(!filename) {
        return "";
    }
    return "/avatars/" + filename;
}


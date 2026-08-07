const publicPages = [
    "/auth",
    "/signup"
]

export function isPublicPage(path: string): boolean {
    return publicPages.includes(path);
}


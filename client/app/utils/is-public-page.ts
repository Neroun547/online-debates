const publicPages = [
    "/auth",
    "/signup",
    "/forgot-password",
    "/password-recovery",
    "/support"
]

export function isPublicPage(path: string): { value: boolean; page: string | undefined; } {
    if(path === "/") {
        return { value: true, page: undefined };
    }
    const foundIndex = publicPages.findIndex(item => path.startsWith(item));

    if(foundIndex !== -1) {
        return { value: true, page: publicPages[foundIndex] };
    }
    return { page: undefined, value: false };
}


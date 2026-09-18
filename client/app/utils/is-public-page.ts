const publicPages = [
    "/auth",
    "/signup",
    "/forgot-password",
    "/password-recovery"
]

export function isPublicPage(path: string): boolean {
    if(publicPages.includes(path)) {
        return true;
    }
    if(publicPages.findIndex(item => path.startsWith(item)) !== -1) {
        return true;
    }
    return false;
}


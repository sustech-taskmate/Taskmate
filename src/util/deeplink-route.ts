export type TaskmateRoute = {
    name: "lmsAssignment" | "lmsSubmission" | "lmsClass";
    params: Record<string, string>;
};

export function taskmateRouteFromUrl(rawUrl: string): TaskmateRoute | null {
    let url: URL;
    try {
        url = new URL(rawUrl);
    } catch {
        return null;
    }
    if (url.protocol !== "taskmate:" || url.hostname !== "lms") return null;

    const [section, value] = url.pathname.split("/").filter(Boolean);
    if (!value) return null;

    if (section === "assignments") {
        return {name: "lmsAssignment", params: {id: value}};
    }
    if (section === "submissions") {
        return {name: "lmsSubmission", params: {slug: value}};
    }
    if (section === "classes") {
        return {name: "lmsClass", params: {id: value}};
    }
    return null;
}

import {request} from "@/service/request";
import {useRouterPush} from "@/composable/router";
import {invoke} from "@tauri-apps/api/core";


/*    sample value:
    {
      "id": 0,
      "name": "string",
      "title": "string",
      "role": "teacher"
    }
*/

enum SemesterSeason {
    SPRING = 'Spring',
    SUMMER = 'Summer',
    FALL = 'Fall',
    WINTER = 'Winter',
}

interface User {
    user: {
        id: string,
        sid: string,
    },
    role: string,
}

export interface LmsUser {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
}

export interface LmsJoinedClass {
    id: number;
    slug: string;
    name: string;
    code: string;
    label: string;
    course: {
        id: number;
        code: string;
        name: string;
    };
    semester: {
        year: number;
        season: string;
    };
}

export interface LmsAssignmentStats {
    totalAssignments: number;
    submissionsThisWeek: number;
    pendingToGrade: number;
    averageScore: number | null;
}

export interface LmsHomeResponse {
    user: LmsUser;
    classes: LmsJoinedClass[];
    assignmentStats: LmsAssignmentStats;
}

export interface LmsClassDetails {
    id: number;
    slug: string;
    name: string;
    course: {
        id: number;
        code: string;
        name: string;
    };
    semester: {
        year: number;
        season: string;
    };
    users: {
        id: string;
        role: string;
        user: {
            id: string;
            name: string;
            email: string;
        };
    }[];
    assignments: {
        id: number;
        name: string;
        title: string;
        classId: number;
        problemId: number | null;
        publishedAt: string | null;
        startTime: string | null;
        endTime: string | null;
        createdAt: string;
        updatedAt: string;
    }[];
    activities?: {
        id: string;
        kind: string;
        actorName: string;
        targetName: string;
        createdAt: string;
    }[];
    deadlines?: {
        id: number;
        title: string;
        slug: string;
        endTime: string;
    }[];
    announcements?: {
        id: number;
        title: string;
        createdAt?: string;
        pinned?: boolean;
    }[];
    discussions?: {
        id: string;
        title: string;
        updatedAt?: string;
        authorName?: string;
        replyCount?: number;
    }[];
    resources?: {
        id: string;
        name: string;
        type?: string;
        size?: number | null;
        updatedAt?: string;
    }[];
    learningPath?: LmsLearningPath | LmsLearningPathModule[];
    problems?: {
        id?: number;
        name?: string;
        title?: string;
    }[];
    gradeOverview?: {
        averageScore?: number | null;
        gradedAssignments?: number;
        totalAssignments?: number;
    };
}

export interface LmsLearningPathItem {
    id: string | number;
    title: string;
    kind?: string;
    completed?: boolean;
    completedAt?: string | null;
    status?: string;
    assignmentId?: number | null;
    fileEntryId?: string | null;
    externalUrl?: string | null;
}

export interface LmsLearningPathModule {
    id: string | number;
    title: string;
    items?: LmsLearningPathItem[];
}

export interface LmsLearningPath {
    modules: LmsLearningPathModule[];
    progress?: {
        completedItems?: number;
        totalItems?: number;
        completedRequiredItems?: number;
        totalRequiredItems?: number;
        completionRate?: number;
    };
}

export interface LmsClassSubmissionList {
    submissions: {
        id: number;
        slug: string;
        name: string;
        submitterId: string;
        submitterName: string;
        assignment: {
            id: number;
            slug: string;
            title: string;
            name: string;
            classId: number;
        };
        statuses: string[];
        createdAt: string;
    }[];
    availableStatuses: string[];
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

export interface LmsAssignmentDetails {
    id: number;
    slug: string;
    classId: number;
    problemId: number;
    problemIds: number[];
    name: string;
    title: string;
    description: unknown;
    publishState: string;
    createdAt: string;
    updatedAt: string;
    status: string;
    class: {
        name: string;
        course: { name: string } | null;
    } | null;
    problem: {
        id?: number;
        name?: string;
        title: string;
        description: unknown;
        submissionRequirements: LmsSubmissionRequirement[];
        gradingPolicyKind?: string;
    } | null;
    problemItems: {
        id: number;
        assignmentId: number;
        problemId: number;
        position: number;
        problem: LmsAssignmentDetails["problem"];
    }[];
    submissions: {
        id: number;
        slug: string;
        assignmentId: number;
        submitterId: string;
        name: string;
        createdAt: string;
        currentAutoJudge: {
            phase: string;
            verdict?: string;
            rawScore?: number;
        } | null;
    }[];
    rubricSnapshot: unknown | null;
}

export interface LmsSubmissionRequirement {
    id: string;
    kind: string;
    displayName: string;
    required: boolean;
    filename?: string;
    languageFilenames?: Record<string, string>;
}

export interface LmsSubmissionDetails {
    id: number;
    slug: string;
    createdAt: string;
    name: string;
    latestFileEntryId: string | null;
    assignment: {
        id: number;
        slug: string;
        title: string;
        gradingStrategy: string;
    };
    problem: {
        id: number;
        name: string;
        title: string;
        class: {
            id: number;
            name: string;
            slug?: string;
            course: { name: string };
        };
    };
    submitter: {
        id: string;
        name: string;
        email: string;
        sustechId?: string;
    };
    currentGrade: {
        draft: { points: number; releasedAt?: string | null } | null;
        released: { points: number; releasedAt?: string | null } | null;
    };
    currentAutoJudge: {
        phase: string;
        verdict?: string;
        rawScore?: number;
    } | null;
    submissionContent: unknown;
    submissionFiles: unknown;
    fileEntries: {
        id: string;
        name: string;
        type?: string;
        size?: number | null;
    }[];
    feedbacks: LmsSubmissionFeedback[];
}

interface LmsSubmissionUploadParams {
    folderId: string;
    fileEntryId: string;
    uploadUrl: string;
    token: string;
    key: string;
}

interface LmsSubmissionResponse {
    slug: string;
}

interface LmsOAuthTokenResponse {
    access_token: string;
}

export interface LmsResourceDownload {
    url: string;
}

export interface LmsDiscussionDetails {
    id: string;
    classId: number;
    title: string;
    createdAt: string;
    updatedAt: string;
    author: LmsUser;
    posts: {
        id: string;
        body: unknown;
        createdAt: string;
        updatedAt: string;
        author: LmsUser;
    }[];
}

interface LmsDiscussionPostResponse {
    id: string;
}

interface LmsDiscussionThreadResponse {
    id: string;
}

interface LmsLearningItemCompletionResponse {
    itemId: number;
    completedAt: string | null;
}

export interface LmsSubmissionFeedback {
    id: string;
    createdAt?: string;
    updatedAt?: string;
    score: number;
    content?: unknown;
    reason?: string;
    rubricResult?: unknown;
    releasedAt?: string | null;
    creatorId?: string;
    creator?: { name: string };
}

interface Semester {
    id: number;
    year: number;
    season: SemesterSeason;
}

export interface Class {
    id: number;
    name: string;
    title: string;
    role: string;
    course: Course;
    semester: Semester;
    users: User[];
}

interface Course {
    id: number;
    number: string;
    name: string;
    description: string;
}

interface ClassesResponseData {
    classes: Class[];
}

/* sample value:{
      "name": "string",
      "title": "string",
      "status": "string",
      "due": 0,
      "availableFrom": 0,
      "availableTo": 0
    }
*/
export interface Assignment {
    name: string;
    title: string;
    status: string;
    due: number;
    availableFrom: number;
    availableTo: number;
}

interface Entry {
    uuid: string
    name: string;
    title: string;
    status: string;
    penalty: number;
    penaltyAfter: number;
}

export interface Metrics {
    uuid: string,
    title: string,
    description: string,
    max: number
}

interface AssignmentsResponseData {
    assignments: Assignment[];
}

interface AssignmentInfoResponseData {
    name: string;
    title: string;
    entries: Entry[];
}
export interface EntryResponse {
    uuid: string;
    title: string;
    problems: Problem[];
    metrics: Metrics[];
    notes: Note[];
}

interface Problem {
    uuid: string;
    type: string;
    title: string;
    description: string;
}

export interface Submission {
    id: string,
    uuid: string,
    createdAt: 0,
    score: number | null,
    scoring: {
        lastModifiedBy: {
            id: string,
            sid: string
        },
        lastModifiedAt: number,
        comment: string,
        metrics: {}
    } | null;
    points: number | null,
    originScore: number,
    penaltyScore: number,
    finalScore: number,
    assignment: Assignment
    entry: Entry,
    submitter: { id: number, sid: string }
    answers: Answer[],
    time: number,
    scorer: string | null,
    scoredAt: number | null
    comment: string,
    metrics: string
}

interface Answer {
    uuid: string;
    problemType: string;
    files: {
        name: string;
        url: string;
    }[];
    score: number;
    message: string;
    result: any;
}

export interface EntryProblemResponseData {
    entry: EntryResponse;
}

interface SubmissionListResponseData {
    submissions: Submission[];
}

interface SubmissionInfoResponseData {
    submission: Submission;
}

export interface Note {
    uuid: string,
    submitter: {
        name: string,
        sid: string,
        image: string,
    },
    entry: Entry,
    submittedAt: number,
    text: string,
}

interface FileResponse {
    url: string,
    extraFormData: {
        key: string,
        token: string
    },
    uuid: string,
    "fileFieldName": string
}

interface AnswerResponse {
    answer: Answer
}

function jsonBody(data: unknown): RequestInit {
    return {
        headers: {"content-type": "application/json"},
        body: JSON.stringify(data),
    }
}

export interface Entries {
    name: string;
    title: string;
    assignment: {
        name: string,
        title: string
    },
    entry: {
        name: string,
        title: string
    },
    due: number;
    availableFrom: number;
    availableTo: number;
    problem: Problem;
}

interface EntriesResponse {
    entries: Entries[]
}

export interface UploadFile {
    name: string,
    size: number,
    path: string,
}

async function login(token: string) {
    request.setAuthToken(token)
    const response = await request.get<LmsHomeResponse>('/home')
    return response.ok
}

async function exchangeLmsAuthCode(params: {
    code: string;
    codeVerifier: string;
    redirectUri: string;
    clientId: string;
}) {
    const response = await request.post<LmsOAuthTokenResponse>('/oauth/token', {
        ...jsonBody({
            grant_type: "authorization_code",
            client_id: params.clientId,
            redirect_uri: params.redirectUri,
            code: params.code,
            code_verifier: params.codeVerifier,
        })
    })
    return response.ok ? response.data.access_token : null;
}

async function getLmsHome() {
    const response = await request.get<LmsHomeResponse>('/home')
    return response.data
}

async function getLmsClass(classId: number | string) {
    const response = await request.get<LmsClassDetails>(`/classes/${classId}`)
    return response.data
}

async function getLmsClassSubmissions(classId: number | string) {
    const response = await request.get<LmsClassSubmissionList>(`/classes/${classId}/submissions`)
    return response.data
}

async function getLmsAssignment(assignmentId: number | string) {
    const response = await request.get<LmsAssignmentDetails>(`/assignments/${assignmentId}`)
    return response.data
}

async function getLmsSubmission(slug: string) {
    const response = await request.get<LmsSubmissionDetails>(`/submissions/${slug}`)
    return response.data
}

async function getLmsResource(resourceId: string) {
    const response = await request.get<LmsResourceDownload>(`/resources/${resourceId}`)
    return response.ok ? response.data : null;
}

async function getLmsDiscussion(threadId: string) {
    const response = await request.get<LmsDiscussionDetails>(`/discussions/${threadId}`)
    return response.data
}

async function createLmsDiscussionPost(threadId: string, body: string) {
    const response = await request.post<LmsDiscussionPostResponse>(`/discussions/${threadId}/posts`, {
        ...jsonBody({body})
    })
    return response.ok ? response.data : null;
}

async function createLmsDiscussion(classId: number | string, params: {
    title: string;
    body: string;
}) {
    const response = await request.post<LmsDiscussionThreadResponse>(`/classes/${classId}/discussions`, {
        ...jsonBody(params)
    })
    return response.ok ? response.data : null;
}

async function setLmsLearningItemCompletion(itemId: number | string, completed: boolean) {
    const response = await request.post<LmsLearningItemCompletionResponse>(`/learning-items/${itemId}/completion`, {
        ...jsonBody({completed})
    })
    return response.ok ? response.data : null;
}

async function submitLmsFile(params: {
    assignmentId: number;
    assignmentProblemItemId?: number;
    file: File;
    name: string;
}) {
    const upload = await request.post<LmsSubmissionUploadParams>(`/assignments/${params.assignmentId}/submission-file-upload`, {
        ...jsonBody({
            filename: params.file.name,
            size: params.file.size,
        })
    });

    if (!upload.ok) return null;

    const form = new FormData();
    form.set("token", upload.data.token);
    form.set("key", upload.data.key);
    form.set("file", params.file, params.file.name);

    const uploadResponse = await globalThis.fetch(upload.data.uploadUrl, {
        method: "POST",
        body: form,
    });
    if (!uploadResponse.ok) return null;

    const response = await request.post<LmsSubmissionResponse>(`/assignments/${params.assignmentId}/submissions`, {
        ...jsonBody({
            assignmentProblemItemId: params.assignmentProblemItemId,
            name: params.name,
            fileEntryId: upload.data.folderId,
            content: {},
            files: [],
        })
    });

    return response.ok ? response.data : null;
}

async function logout() {
    localStorage.removeItem('token');
    request.clearCookie()
    request.setAuthToken("")
    const {routerPush} = useRouterPush();
    await routerPush({name: 'empty'})
}

async function getClassbyId(classId: string) {
    const url = `/class/${classId}`
    const response = await request.get<Class>(url);
    return response.data
}

async function getClasses() {
    const url = `/class`;
    const response = await request.get<ClassesResponseData>(url)
    return response.data;
}

async function getAssignments(classId: string) {
    const url = `/class/${classId}/assignment`;
    const response = await request.get<AssignmentsResponseData>(url)
    return response.data;
}

async function getAssignmentInfo(classId: string, assignmentName: string) {
    const url = `/class/${classId}/assignment/${assignmentName}`;
    const response = await request.get<AssignmentInfoResponseData>(url)
    return response.data
}

async function getEntry(classId: string, entryId: string) {
    const url = `/class/${classId}/entry/${entryId}`;
    const response = await request.get<EntryProblemResponseData>(url)
    return response.data;
}

async function getCurrentUserSubmissions(classId: string, entryId: string){
    const url = `/class/${classId}/entry/${entryId}/submission`;
    const response = await request.get<SubmissionListResponseData>(url)
    return response.data;
}

async function getSubmissions(classId: string) {
    const url = `/class/${classId}/submission`;
    const response = await request.get<SubmissionListResponseData>(url)
    return response.data;
}

async function getSubmissionInfo(submissionName: string) {
    const url = `/submission/${submissionName}`;
    const response = await request.get<SubmissionInfoResponseData>(url)
    return response.data;
}

async function getEntries(classId: string) {
    const url = `/class/${classId}/entries`;
    const response = await request.get<EntriesResponse>(url);
    return response.data;
}

async function uploadFile(classId: string, problemId: string, entryId: string, files: UploadFile[]) {
    const uuids: string[] = await Promise.all(files.map(async file => {
        const url = `/file/`;
        const response = await request.post<FileResponse>(url, {
            ...jsonBody({
                size: file.size,
                name: file.name,
            })
        });

        const data = response.data

        await invoke('upload_file',
            {url: data.url, filePath: file.path, key: data.extraFormData.key, token: data.extraFormData.token});

        return data.uuid
    }));

    let url = `/problem/${problemId}/answer`;
    const response = await request.post<AnswerResponse>(url, {
        ...jsonBody({
            files: uuids
        })
    })

    url = `/class/${classId}/entry/${entryId}/submission`
    const response2 = await request.post(url, {
        ...jsonBody({
            answers: [response.data.answer.uuid]
        })
    })

    return response2.ok;
}

async function returnSubmission(submissionName: string, score: number, comment?: string, metrics?: { [key: string]: number; }) {
    const url = `/submission/${submissionName}/score`;
    const response = await request.post(url, {
        ...jsonBody({
            score: score,
            comment: comment,
            metrics: metrics
        })
    })
    return response.ok;
}

async function sendNote(classId: string, entryId: string, note: string) {
    const url = `/class/${classId}/entry/${entryId}/note`;
    const response = await request.post(url, {
        ...jsonBody({
            text: note,
        })
    })
    return response.ok;
}

export {
    login,
    logout,
    getClassbyId,
    getClasses,
    getAssignments,
    getAssignmentInfo,
    getEntry,
    getCurrentUserSubmissions,
    getSubmissions,
    getSubmissionInfo,
    getEntries,
    uploadFile,
    returnSubmission,
    sendNote,
    exchangeLmsAuthCode,
    getLmsHome,
    getLmsClass,
    getLmsClassSubmissions,
    getLmsAssignment,
    getLmsSubmission,
    getLmsResource,
    getLmsDiscussion,
    createLmsDiscussion,
    createLmsDiscussionPost,
    setLmsLearningItemCompletion,
    submitLmsFile,
}
export type {ClassesResponseData}

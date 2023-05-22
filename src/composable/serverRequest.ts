import {request} from "@/service/request";
import {Body} from "@tauri-apps/api/http";
import {useRouterPush} from "@/composable/router";
import {invoke} from "@tauri-apps/api/tauri";


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
    const url = '/auth/login'
    const response = await request.post(url, {
        body: Body.json({
            token: token
        })
    });
    if (response.ok) {
        const cookie = response.headers['set-cookie']
        request.setCookie(cookie)
        return true
    }
    return false
}

async function logout() {
    localStorage.removeItem('token');
    request.clearCookie()
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
            body: Body.json({
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
        body: Body.json({
            files: uuids
        })
    })

    url = `/class/${classId}/entry/${entryId}/submission`
    const response2 = await request.post(url, {
        body: Body.json({
            answers: [response.data.answer.uuid]
        })
    })

    return response2.ok;
}

async function returnSubmission(submissionName: string, score: number, comment?: string, metrics?: { [key: string]: number; }) {
    const url = `/submission/${submissionName}/score`;
    const response = await request.post(url, {
        body: Body.json({
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
        body: Body.json({
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
}
export type {ClassesResponseData}






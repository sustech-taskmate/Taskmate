import {request} from "@/service/request";
import {Body} from "@tauri-apps/api/http";


/*    sample value:
    {
      "id": 0,
      "name": "string",
      "title": "string",
      "role": "teacher"
    }
*/
interface Class {
    id: number;
    name: string;
    title: string;
    role: string;
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
interface Assignment {
    name: string;
    title: string;
    status: string;
    due: number;
    availableFrom: number;
    availableTo: number;
}

interface Entry {
    name: string;
    title: string;
    status: string;
    penalty: number;
    penaltyAfter: number;
}

interface AssignmentsResponseData {
    assignments: Assignment[];
}

interface AssignmentInfoResponseData {
    name: string;
    title: string;
    entries: Entry[];
}

interface EntryProblems {
    uuid: string;
    title: string;
    problems: Problem[];
}

interface Problem {
    uuid: string;
    type: string;
    title: string;
    description: string;
}

interface Submission {
    uuid: string,
    createdAt: 0,
    originScore: 0,
    penaltyScore: 0,
    finalScore: 0
}

interface Answer {
    uuid: string;
    problemType: string;
    file: string;
    score: number;
    message: string;
    result: any;
}

interface SubmissionInfo {
    id: number;
    uuid: string;
    answers: Answer[];
    score: number;
    time: number;
    assigment: {
        name: string;
        title: string;
    }
    entry: {
        uuid: string;
        title: string;
    }
}

interface EntryProblemResponseData {
    entry: EntryProblems;
}

interface SubmissionResponseData {
    submissions: Submission[];
}

interface SubmissionInfoResponseData {
    submission: SubmissionInfo;
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

async function getClasses() {
    const url = `/class`;
    const response = await request.get<ClassesResponseData>(url)
    return response.data;
}

async function getAssignments(classId: number) {
    const url = `/class/${classId}/assignment`;
    const response = await request.get<AssignmentsResponseData>(url)
    return response.data;
}

async function getAssignmentInfo(classId: number, assignmentName: string) {
    const url = `/class/${classId}/assignment/${assignmentName}`;
    const response = await request.get<AssignmentInfoResponseData>(url)
    return response.data
}

async function getProblems(classId: string, entryId: number) {
    const url = `/class/${classId}/entry/${entryId}`;
    const response = await request.get<EntryProblemResponseData>(url)
    return response.data;
}

async function getSubmissions(classId: string, entryId: number) {
    const url = `/class/${classId}/entry/${entryId}/submission`;
    const response = await request.get<SubmissionResponseData>(url)
    return response.data;
}

async function getSubmissionInfo(submissionName: string) {
    const url = `/submission/${submissionName}`;
    const response = await request.get<SubmissionInfoResponseData>(url)
    return response.data;
}

export {
    login,
    getClasses,
    getAssignments,
    getAssignmentInfo,
    getProblems,
    getSubmissions,
    getSubmissionInfo,
}






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
    studentList: Array<User>;
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
    id: string,
    uuid: string,
    createdAt: 0,
    score: 0,
    points: 0,
    assignment: Assignment
    entry: Entry,
    submitter: {id: number, sid: string}
    answers: Answer[],
    time: number
}

interface Answer {
    uuid: string;
    problemType: string;
    file: string;
    score: number;
    message: string;
    result: any;
}

interface EntryProblemResponseData {
    entry: EntryProblems;
}

interface SubmissionListResponseData {
    submissions: Submission[];
}

interface SubmissionInfoResponseData {
    submission: Submission;
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

async function getProblems(classId: string, entryId: number) {
    const url = `/class/${classId}/entry/${entryId}`;
    const response = await request.get<EntryProblemResponseData>(url)
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

export {
    login,
    getClassbyId,
    getClasses,
    getAssignments,
    getAssignmentInfo,
    getProblems,
    getSubmissions,
    getSubmissionInfo,
}






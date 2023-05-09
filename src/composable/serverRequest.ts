import {request} from "@/service/request";
import {createRequest} from "@/service/request/request";


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

interface Entry{
    name:string;
    title:string;
    status:string;
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
interface Answer{
    uuid: string;
    problemType: string;
    file:string;
    score:number;
    message:string;
    result:any;
}
interface SubmissionInfo {
    id: number;
    uuid: string;
    answers: Answer[];
    score: number;
    time: number;
    assigment:{
        name: string;
        title: string;
    }
    entry:{
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



async function getClasses(){
    const url = `/class`;
    const request = createRequest()
    const response=await request.get(url)
    return response.data as ClassesResponseData;
}
async function getAssignments(classId: number){
    const url = `/class/${classId}/assignment`;
    const request = createRequest()
    const response=await request.get(url)
    return response.data as AssignmentsResponseData;
}
async function getAssignmentInfo(classId: number, assignmentName: string){
    const url = `/class/${classId}/assignment/${assignmentName}`;
    const request = createRequest()
    const response=await request.get(url)
    return response.data as AssignmentInfoResponseData;
}

async function getProblems(classId:string, entryId: number){
    const url = `/class/${classId}/entry/${entryId}`;
    const request = createRequest()
    const response=await request.get(url)
    return response.data as EntryProblemResponseData;
}

async function getSubmissions(classId:string, entryId: number){
    const url = `/class/${classId}/entry/${entryId}/submission`;
    const request = createRequest()
    const response=await request.get(url)
    return response.data as SubmissionResponseData;
}

async function getSubmissionInfo(submissionName: string){
    const url = `/submission/${submissionName}`;
    const request = createRequest()
    const response=await request.get(url)
    return response.data as SubmissionInfoResponseData;
}






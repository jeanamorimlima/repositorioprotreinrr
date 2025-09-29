
'use server';

import { db } from '@/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

export interface Student {
    id: string;
    name: string;
    email: string;
    goal: string;
    avatarUrl: string;
    status: 'active' | 'inactive';
    personalId: string;
}

/**
 * Fetches all students assigned to a specific personal trainer.
 * @param personalId The ID of the personal trainer.
 * @returns A promise that resolves to an array of students.
 */
export async function getStudentsByPersonalId(personalId: string): Promise<Student[]> {
    try {
        const studentsCollection = collection(db, 'students');
        const q = query(studentsCollection, where('personalId', '==', personalId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log("No students found for this personal trainer.");
            return [];
        }

        const students: Student[] = [];
        querySnapshot.forEach((doc) => {
            students.push({ id: doc.id, ...doc.data() } as Student);
        });

        return students;
    } catch (error) {
        console.error("Error getting students by personal ID: ", error);
        throw new Error("Failed to fetch students.");
    }
}

/**
 * Fetches a single student by their document ID.
 * @param studentId The ID of the student document.
 * @returns A promise that resolves to the student data or null if not found.
 */
export async function getStudentById(studentId: string): Promise<Student | null> {
    try {
        const studentDocRef = doc(db, 'students', studentId);
        const studentDoc = await getDoc(studentDocRef);

        if (!studentDoc.exists()) {
            console.log("No such student found!");
            return null;
        }

        return { id: studentDoc.id, ...studentDoc.data() } as Student;
    } catch (error) {
        console.error("Error getting student by ID: ", error);
        throw new Error("Failed to fetch student data.");
    }
}

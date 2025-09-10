
'use server';

import { auth, db } from '@/lib/firebase';
import { 
    createUserWithEmailAndPassword, 
    sendEmailVerification,
    signInWithEmailAndPassword as firebaseSignIn,
    signOut as firebaseSignOut,
    updateProfile,
    type User
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export type UserRole = 'aluno' | 'personal' | 'nutricionista';

export interface SerializableUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface SignUpData {
    email: string;
    name: string;
    role: UserRole;
}

/**
 * Signs up a new user with email and password, and creates a corresponding document in Firestore.
 * @param data - The user's sign-up data including email, password, name, and role.
 */
export async function signUpWithEmailAndPassword(data: SignUpData, password: string) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, password);
        const user = userCredential.user;

        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random`;

        // Update Firebase Auth profile
        await updateProfile(user, {
            displayName: data.name,
            photoURL: avatarUrl
        });

        const initialStatus = data.role === 'aluno' ? 'active' : 'pending';
        
        let userProfileData: any = {
            uid: user.uid,
            email: data.email,
            name: data.name,
            role: data.role,
            status: initialStatus,
            createdAt: new Date().toISOString(), // Use ISO string
            avatarUrl: avatarUrl,
        };

        // If the user is a professional, add subscription trial info
        if (data.role === 'personal' || data.role === 'nutricionista') {
            const trialEndDate = new Date();
            trialEndDate.setDate(trialEndDate.getDate() + 15);
            userProfileData.subscription = {
                status: 'trial',
                trialEndDate: trialEndDate.toISOString(), // Use ISO string
            }
        }

        // Save user profile data to Firestore FIRST
        await setDoc(doc(db, 'users', user.uid), userProfileData);
        
        // If the user is a student, also create a document in the 'students' collection
        if (data.role === 'aluno') {
            await setDoc(doc(db, 'students', user.uid), {
                name: data.name,
                email: data.email,
                goal: 'Não definido',
                avatarUrl: avatarUrl,
                status: 'active',
                personalId: null, // No personal trainer linked initially
            });
        }
        
        // Send verification email AFTER profile is created
        await sendEmailVerification(user);
        
    } catch (error: any) {
        console.error("Error signing up:", error);
        // Map Firebase error codes to more user-friendly messages
        if (error.code === 'auth/email-already-in-use') {
            throw new Error('Este e-mail já está em uso por outra conta.');
        } else if (error.code === 'auth/weak-password') {
            throw new Error('A senha é muito fraca. Use pelo menos 6 caracteres.');
        } else if (error.code === 'auth/configuration-not-found') {
            throw new Error('Configuração de autenticação não encontrada. Verifique se o método de login por E-mail/Senha está ativado no Console do Firebase.');
        }
        throw new Error(error.message || 'Ocorreu um erro desconhecido durante o cadastro.');
    }
}

/**
 * Signs in a user with their email and password.
 * This function only handles authentication and does not perform database lookups.
 * @param email - The user's email.
 * @param password - The user's password.
 * @returns An object containing a serializable user object or an error message.
 */
export async function signInWithEmailAndPassword(email: string, password: string): Promise<{ user: SerializableUser | null, error: string | null }> {
    try {
        const userCredential = await firebaseSignIn(auth, email, password);
        const u = userCredential.user;
        const serializableUser: SerializableUser = {
            uid: u.uid,
            email: u.email,
            displayName: u.displayName,
            photoURL: u.photoURL,
        };
        return { user: serializableUser, error: null };
    } catch (error: any) {
        console.error("Error signing in:", error);
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-email') {
            return { user: null, error: 'E-mail ou senha inválidos.' };
        }
        return { user: null, error: error.message || 'Ocorreu um erro desconhecido durante o login.' };
    }
}


/**
 * Signs out the current user.
 * @returns A promise that resolves when the sign out is complete.
 */
export async function signOut() {
    try {
        await firebaseSignOut(auth);
    } catch (error: any) {
        console.error("Error signing out: ", error);
        throw new Error("Failed to sign out.");
    }
}

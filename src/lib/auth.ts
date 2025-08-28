import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  User as FirebaseUser,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { User } from '@/types';
import { FirestoreService } from './firestore';

export class AuthService {
  // Sign in with email and password
  static async signInWithEmail(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get user data from Firestore or create if doesn't exist
      let user = await FirestoreService.getUserById(userCredential.user.uid);
      
      if (!user) {
        // Create user document if it doesn't exist
        user = {
          id: userCredential.user.uid,
          name: userCredential.user.displayName || userCredential.user.email?.split('@')[0] || 'Anonymous',
          email: userCredential.user.email || '',
          avatar: userCredential.user.photoURL || undefined,
          isOnline: true,
          lastSeen: new Date(),
          createdAt: new Date(),
        };
        await FirestoreService.createUserDocument(user);
      } else {
        // Update online status
        await FirestoreService.updateUserOnlineStatus(user.id, true);
      }
      
      return user;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in');
    }
  }

  // Sign up with email and password
  static async signUpWithEmail(email: string, password: string, name: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      await updateProfile(userCredential.user, {
        displayName: name
      });

      // Send email verification
      await sendEmailVerification(userCredential.user);

      // Create user document in Firestore
      const user: User = {
        id: userCredential.user.uid,
        name: name,
        email: userCredential.user.email || '',
        avatar: userCredential.user.photoURL || undefined,
        isOnline: true,
        lastSeen: new Date(),
        createdAt: new Date(),
      };

      await FirestoreService.createUserDocument(user);
      return user;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create account');
    }
  }

  // Sign in with Google
  static async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Get user data from Firestore or create if doesn't exist
      let user = await FirestoreService.getUserById(result.user.uid);
      
      if (!user) {
        // Create user document for Google user
        user = {
          id: result.user.uid,
          name: result.user.displayName || result.user.email?.split('@')[0] || 'Anonymous',
          email: result.user.email || '',
          avatar: result.user.photoURL || undefined,
          isOnline: true,
          lastSeen: new Date(),
          createdAt: new Date(),
        };
        await FirestoreService.createUserDocument(user);
      } else {
        // Update online status
        await FirestoreService.updateUserOnlineStatus(user.id, true);
      }
      
      return user;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in with Google');
    }
  }

  // Sign out (status update handled by store to avoid race conditions)
  static async signOut() {
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign out');
    }
  }

  // Reset password
  static async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send reset email');
    }
  }


  // Convert Firebase user to our User type
  static firebaseUserToUser(firebaseUser: FirebaseUser | null): User | null {
    if (!firebaseUser) return null;

    return {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Anonymous',
      email: firebaseUser.email || '',
      avatar: firebaseUser.photoURL || undefined,
      isOnline: true,
      lastSeen: new Date(),
      createdAt: new Date(),
    };
  }

  // Auth state listener
  static onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user data from Firestore
          let user = await FirestoreService.getUserById(firebaseUser.uid);
          
          if (!user) {
            // If user document doesn't exist, create it
            user = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Anonymous',
              email: firebaseUser.email || '',
              avatar: firebaseUser.photoURL || undefined,
              isOnline: true,
              lastSeen: new Date(),
              createdAt: new Date(),
            };
            
            // Create user document in Firestore
            await FirestoreService.createUserDocument(user);
          }
          
          // Update online status
          await FirestoreService.updateUserOnlineStatus(firebaseUser.uid, true);
          callback(user);
          return;
          
        } catch (error) {
          console.error('Error fetching user from Firestore:', error);
        }
      }
      
      callback(null);
    });
  }

  // Get current user
  static getCurrentUser(): User | null {
    return this.firebaseUserToUser(auth.currentUser);
  }
}
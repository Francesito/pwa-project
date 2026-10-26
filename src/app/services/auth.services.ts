import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth, User } from 'firebase/app';
import 'firebase/auth';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { IUser } from '../structures/users';
import { UserService } from './user.service';

@Injectable()
export class AuthServices {
  constructor(private afAuth: AngularFireAuth, private users: UserService) {}

  getUser(): Observable<IUser> {
    return this.afAuth.authState.pipe(
      take(1), filter(user => !!user), map(user => user as IUser)
    );
  }

  login(): Promise<void> {
    return this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
      .then(result => this.saveProfile(result.user));
  }

  loginWithEmail(email: string, password: string): Promise<void> {
    return this.afAuth.auth.signInWithEmailAndPassword(email.trim(), password)
      .then(result => this.saveProfile(result.user));
  }

  register(email: string, password: string): Promise<void> {
    return this.afAuth.auth.createUserWithEmailAndPassword(email.trim(), password)
      .then(result => this.saveProfile(result.user));
  }

  private saveProfile(user: User | null): Promise<void> {
    if (!user) {
      return Promise.reject(new Error('No se recibió el usuario autenticado.'));
    }
    return this.users.add({ uid: user.uid, email: user.email || '' })
      .catch(error => this.afAuth.auth.signOut().then(() => { throw error; }));
  }
}

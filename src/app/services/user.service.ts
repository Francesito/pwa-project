import { Injectable } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import { Observable } from "rxjs";
import { IUser } from "../structures/users";
import { AngularFirestore, AngularFirestoreCollection } from "angularfire2/firestore";

@Injectable()
export class UserService{
    private users : AngularFirestoreCollection<IUser>;

    constructor(private afs : AngularFirestore){
        this.users = afs.collection<IUser>('users')
    }

    add(user:IUser) : Promise<void>{
       return this.users.doc(user.uid).set(user, { merge: true })

    }
}
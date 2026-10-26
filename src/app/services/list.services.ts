import { Injectable } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from "firebase/app";
import "firebase/firestore";
import { Observable, of } from "rxjs";
import { map, switchMap, take } from "rxjs/operators";
import { IList } from "../structures/lista";

@Injectable()
export class ListService {
    public listsm: Observable<IList[]>;

    constructor(private afs: AngularFirestore, private auth: AngularFireAuth) {
        this.listsm = this.auth.authState.pipe(switchMap(user => {
            if (!user) { return of([] as IList[]); }
            return this.afs.collection<IList>('users/' + user.uid + '/lists')
                .snapshotChanges().pipe(map(actions => actions.map(action => ({
                    ...action.payload.doc.data(), id: action.payload.doc.id
                } as IList))));
        }));
    }

    async remove(id: string): Promise<void> {
        const user = await this.auth.authState.pipe(take(1)).toPromise();
        if (!user) { throw new Error('Inicia sesión para eliminar listas.'); }
        if (!id || id.indexOf('/') !== -1) { throw new Error('Lista no válida.'); }
        return this.afs.doc('users/' + user.uid + '/lists/' + id).delete();
    }

    async add(list: IList): Promise<firebase.firestore.DocumentReference> {
        const user = await this.auth.authState.pipe(take(1)).toPromise();
        if (!user) { throw new Error('Inicia sesión para guardar listas.'); }
        return this.afs.collection<IList>('users/' + user.uid + '/lists').add({
            ...list, createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    }
}

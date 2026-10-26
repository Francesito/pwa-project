import { Component, OnInit, OnDestroy } from "@angular/core";
import { IList } from "../structures/lista";
import { ListService } from "../services/list.services";

@Component({
    selector: 'list-creator',
    templateUrl: 'list.creator.component.html'
})
export class ListCreatorComponent implements OnInit, OnDestroy {
    private subscription: import("rxjs").Subscription;
    public listasGuardadas: IList[] = [];
    public list: IList = { title: '' };
    public elementos = '';
    public cargando = true;
    public listas = this.listS.listsm;
    public errorCarga = '';
    public guardando = false;
    public eliminando: string | null = null;
    public mensaje = '';
    public error = '';

    constructor(private listS: ListService) {}

    ngOnInit(): void {
        this.subscription = this.listas.subscribe(listas => {
            this.listasGuardadas = listas;
            this.cargando = false;
        }, () => {
            this.cargando = false;
            this.errorCarga = 'No se pudieron cargar las listas. Comprueba los permisos de Firestore.';
        });
    }

    ngOnDestroy(): void {
        if (this.subscription) { this.subscription.unsubscribe(); }
    }

    async eliminar(lista: IList): Promise<void> {
        if (!lista.id || this.eliminando) { return; }
        this.eliminando = lista.id;
        this.error = '';
        this.mensaje = '';
        try {
            await this.listS.remove(lista.id);
            this.mensaje = 'Lista eliminada.';
        } catch (error) {
            this.error = 'No se pudo eliminar la lista. Comprueba tu sesión y los permisos de Firestore.';
        } finally {
            this.eliminando = null;
        }
    }

    async save(): Promise<void> {
        if (this.guardando || !this.list.title.trim()) { return; }
        this.guardando = true;
        this.mensaje = '';
        this.error = '';
        try {
            await this.listS.add({
                title: this.list.title.trim(),
                items: this.elementos.split(/\r?\n/).map(item => item.trim()).filter(item => !!item)
            });
            this.mensaje = 'Lista guardada correctamente.';
            this.list = { title: '' };
            this.elementos = '';
        } catch (error) {
            this.error = 'No se pudo guardar la lista. Comprueba tu sesión y los permisos de Firestore.';
        } finally {
            this.guardando = false;
        }
    }
}

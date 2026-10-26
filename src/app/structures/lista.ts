export interface IList{
    id ?:string;
    title:string;
    items?: string[];
    tipo?: 'creator' | 'propia';
    createdAt ?:any;
}
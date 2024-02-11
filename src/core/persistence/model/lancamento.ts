
export class Lancamento {
    id : number = 0;
    descricao : string = '';
    valor : number = 0;
    tipo : string = 'credito';
    dataLanc : Date = new Date();
    emContaCorrente : boolean = false;
    doJogo : boolean = false;
}
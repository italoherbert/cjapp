
export class Lancamento {
    id : number = 0;
    lancamentosGrupoId : number = 0;
    
    descricao : string = '';
    valor : number = 0;
    tipo : string = 'debito';
    dataLanc : Date = new Date();
    emContaCorrente : boolean = false;
    doJogo : boolean = false;
}
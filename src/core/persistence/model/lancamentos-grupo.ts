import { Lancamento } from "./lancamento";

export class LancamentosGrupo {
    id : number = -1;
    dataIni : Date = new Date();
    dataFim? : Date;
    aberto : boolean = true;
    ativo : boolean = true;
}
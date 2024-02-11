import * as SQLite from "expo-sqlite/next";

import DevedorService from "./service/devedor-service";
import LancamentoService from "./service/lancamento-service";
import AjustesService from "./service/ajustes-service";

let DB_NAME = "cjapp.db";

export default class Persistence {

    db : SQLite.SQLiteDatabase | null = null;

    devedorService : DevedorService = new DevedorService();
    lancamentoService : LancamentoService = new LancamentoService();
    ajustesService : AjustesService = new AjustesService();

    inicializa = () => {
        this.db = SQLite.openDatabaseSync( DB_NAME );

        this.devedorService.setDB( this.db );
        this.lancamentoService.setDB( this.db );
        this.ajustesService.setDB( this.db );

        this.db.withTransactionSync( () => {
            this.db!.execSync( `
                create table if not exists devedor ( 
                    id integer primary key,
                    nome varchar( 256 ) not null,
                    data_debito date not null,
                    valor double precision not null,
                    antigo boolean default false                   
                )` ); 
            this.db!.execSync( `
                create table if not exists lancamento ( 
                    id integer primary key,
                    descricao varchar( 256 ) not null,
                    tipo varchar( 30 ) not null,
                    data_lanc date not null,
                    valor double precision not null,
                    em_conta_corrente boolean not null,
                    do_jogo boolean boolean default true
                )` );  
        } );        
    } 

    finaliza = async () => {
        if ( this.db === null )
            throw new Error( "Tentativa de fechar conexão não aberta." );

        await this.db.closeAsync();
    };
}
export const persistence = new Persistence();
persistence.inicializa();

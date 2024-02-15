import * as SQLite from "expo-sqlite/next";

import DevedorService from "./service/devedor-service";
import LancamentoService from "./service/lancamento-service";
import AjustesService from "./service/ajustes-service";

let DB_NAME = "cjapp.db";

export default class Persistence {
    
    inicializa = async ( db : SQLite.SQLiteDatabase ) => {       
        await db.withTransactionAsync( async () => {
            await db.execAsync( `
                create table if not exists devedor ( 
                    id integer primary key,
                    nome varchar( 256 ) not null,
                    data_debito date not null,
                    valor double precision not null,
                    antigo boolean default false                   
                )` ); 
            await db.execAsync( `
                create table if not exists lancamento ( 
                    id integer primary key,
                    descricao varchar( 256 ) not null,
                    tipo varchar( 30 ) not null,
                    data_lanc date not null,
                    valor double precision not null,
                    em_conta_corrente boolean not null,
                    do_jogo boolean default true
                )` );  
        } );        
    } 

    finaliza = async ( db : SQLite.SQLiteDatabase ) => {
        if ( db === null )
            throw new Error( "Tentativa de fechar conexão não aberta." );

        await db.closeAsync();
    };
}
export const persistence = new Persistence();

import * as SQLite from "expo-sqlite/next";

export default class Persistence {
    
    inicializa = async ( db : SQLite.SQLiteDatabase ) => {       
        await db.execAsync('PRAGMA foreign_keys = ON');
        
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
                create table if not exists lancamentos_grupo ( 
                    id integer primary key,
                    data_ini datetime not null,
                    data_fim datetime,
                    aberto boolean default true,
                    ativo boolean default true
                )` ); 

            await db.execAsync( `
                create table if not exists lancamento ( 
                    id integer primary key,
                    descricao varchar( 256 ) not null,
                    tipo varchar( 30 ) not null,
                    data_lanc date not null,
                    valor double precision not null,
                    em_conta_corrente boolean not null,
                    do_jogo boolean default true,
                    lancamentos_grupo_id integer not null,
                    foreign key( lancamentos_grupo_id ) references lancamentos_grupo( id ) on delete cascade 
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

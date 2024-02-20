import * as SQLite from 'expo-sqlite/next';
import { LancamentosGrupo } from '../model/lancamentos-grupo';

export const insere = async ( db : SQLite.SQLiteDatabase, grupo : LancamentosGrupo ) => {    
    let result = await db.runAsync( 
        `insert into lancamentos_grupo ( 
            data_ini, data_fim, aberto
         ) values (?, ?, ?, ?)`, [   
            grupo.dataIni.toISOString(),
            grupo.dataFim!.toISOString(),
            grupo.aberto,
            grupo.ativo
        ] 
    ); 
    grupo.id = result.lastInsertRowId;
};

export const atualiza = async ( db : SQLite.SQLiteDatabase, grupo : LancamentosGrupo ) => {
    await db.runAsync( 
        `update lancamentos_grupo set 
            data_ini=?, data_fim=?, aberto=?, ativo=?  
         where id=?`, [            
            grupo.dataIni.toISOString(),
            grupo.dataFim!.toISOString(),
            grupo.aberto,
            grupo.id
        ]
    );    
};

export const atualizaAtivo = async ( db : SQLite.SQLiteDatabase, id : number, ativo : boolean ) => {
    await db.runAsync( 
        `update lancamentos_grupo set 
            ativo=?  
         where id=?`, [            
            ativo,
            id
        ]
    );  
};  

export const fechaTodos = async ( db : SQLite.SQLiteDatabase ) => {
    await db.runAsync( 
        `update lancamentos_grupo set aberto=false`, []
    );
};

export const listaTodos = async ( db : SQLite.SQLiteDatabase ) => {    
    let result = await db.getAllAsync( 
        `select 
            id, data_ini, data_fim, aberto, ativo
         from lancamentos_grupo`, [] );         
    
    return rowsToLancamentosGrupos( result );
};

export const listaPorQuant = async ( db : SQLite.SQLiteDatabase, quant : number ) => {    
    let result = await db.getAllAsync( 
        `select 
            id, data_ini, data_fim, aberto, ativo
         from lancamentos_grupo 
         limit ?`, [ quant ] );         
    
    return rowsToLancamentosGrupos( result );
};

export const getAberto = async ( db : SQLite.SQLiteDatabase ) => {
    let result = await db.getFirstAsync( 
        `select 
            id, data_ini, data_fim, aberto, ativo
         from lancamentos_grupo
         where aberto=true`, [] );

    if ( result === null )
        return null;

    return rowToLancamentosGrupo( result );
}

export const existeAberto = async ( db : SQLite.SQLiteDatabase ) => {
    let result = await db.getFirstAsync( 
        `select id
         from lancamentos_grupo
         where aberto=true`, [] );
    
    return ( result !== null );
};

export const findById = async ( db : SQLite.SQLiteDatabase, id : number ) => {
    let result = await db.getFirstAsync( 
        `select 
            id, data_ini, data_fim, aberto, ativo
         from lancamentos_grupo 
         where id=?`, [ id ] 
    );         

    if ( result === null )
        return null;

    return rowToLancamentosGrupo( result );    
};

export const deletaPorId = async ( db : SQLite.SQLiteDatabase, id : number ) => {
    await db.runAsync( 
        'delete from lancamentos_grupo where id=?', [
            id
        ] 
    );
};

export const deleteAll = async ( db : SQLite.SQLiteDatabase ) => {
    await db.runAsync( 
        'delete from lancamentos_grupo'
    );
};

const rowsToLancamentosGrupos = ( rows : any[] ) => {
    let grupos: LancamentosGrupo[] = [];
    for( let row of rows )
        grupos.push( rowToLancamentosGrupo( row ) );    
    return grupos;
};


const rowToLancamentosGrupo = ( row : any ) => {
    let grupo : LancamentosGrupo = new LancamentosGrupo();
    grupo.id = row['id'];
    grupo.dataIni = row['data_ini'];
    grupo.dataFim = row['data_fim'];
    grupo.aberto = row['aberto'];    
    grupo.ativo = row['ativo'];
    return grupo;
};
import * as SQLite from 'expo-sqlite/next';
import { Lancamento } from '../model/lancamento';

export const insere = async ( db : SQLite.SQLiteDatabase, lancamento : Lancamento ) => {    
    let result = await db.runAsync( 
        `insert into lancamento ( 
            lancamentos_grupo_id, 
            descricao, valor, tipo, data_lanc, em_conta_corrente, do_jogo 
        ) values (?, ?, ?, ?, ?, ?, ?)`, [   
            lancamento.lancamentosGrupoId,
            lancamento.descricao,
            lancamento.valor,
            lancamento.tipo,
            new Date( lancamento.dataLanc ).toISOString(),
            lancamento.emContaCorrente,
            lancamento.doJogo,
        ] 
    ); 
    lancamento.id = result.lastInsertRowId;
};

export const atualiza = async ( db : SQLite.SQLiteDatabase, lancamento : Lancamento ) => {
    await db.runAsync( 
        `update lancamento set 
            descricao=?, valor=?, tipo=?, data_lanc=?, em_conta_corrente=?, do_jogo=?  
        where id=?`, [
            lancamento.descricao,
            lancamento.valor,
            lancamento.tipo,
            new Date( lancamento.dataLanc ).toISOString(),
            lancamento.emContaCorrente,
            lancamento.doJogo,
            lancamento.id
        ]
    );    
};

export const listaPorQuant = async ( db : SQLite.SQLiteDatabase, quant : number ) => {    
    let result = await db.getAllAsync( 
        `select 
            id, lancamentos_grupo_id, 
            descricao, valor, tipo, data_lanc, em_conta_corrente, do_jogo
         from lancamento 
         limit ?`, [ quant ] );         
    
    return rowsToLancamentos( result );
};

export const listaPorGrupoId = async ( db : SQLite.SQLiteDatabase, lancamentosGrupoId : number ) => {    
    let result = await db.getAllAsync( 
        `select 
            id, lancamentos_grupo_id, 
            descricao, valor, tipo, data_lanc, em_conta_corrente, do_jogo
         from lancamento 
         where lancamentos_grupo_id=?`, [ lancamentosGrupoId ] );         
    
    return rowsToLancamentos( result );
};

export const findById = async ( db : SQLite.SQLiteDatabase, id : number ) => {
    let result = await db.getFirstAsync( 
        `select 
            id, descricao, valor, tipo, data_lanc, em_conta_corrente, do_jogo  
         from lancamento 
         where id=?`, [ id ] 
    );         

    if ( result === null )
        return null;

    return rowToLancamento( result );    
};

export const deletaPorId = async ( db : SQLite.SQLiteDatabase, id : number ) => {
    await db.runAsync( 
        'delete from lancamento where id=?', [
            id
        ] 
    );
};

export const deleteAll = async ( db : SQLite.SQLiteDatabase ) => {
    await db.runAsync( 
        'delete from lancamento', [] 
    );
};

const rowsToLancamentos = ( rows : any[] ) => {
    let lancamentos: Lancamento[] = [];
    for( let row of rows )
        lancamentos.push( rowToLancamento( row ) );    
    return lancamentos;
};


const rowToLancamento = ( row : any ) => {
    let lanc : Lancamento = new Lancamento();
    lanc.id = row['id'];
    lanc.descricao = row['descricao'];
    lanc.tipo = row['tipo'];
    lanc.valor = row['valor'];
    lanc.dataLanc = row['data_lanc'];
    lanc.emContaCorrente = row['em_conta_corrente'];
    lanc.doJogo = row['do_jogo'];
    lanc.lancamentosGrupoId = row['lancamentos_grupo_id'];
    return lanc;
};
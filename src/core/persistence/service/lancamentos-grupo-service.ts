import * as SQLite from 'expo-sqlite/next';

import * as lancamentosGrupoRepository from '../repository/lancamentos-grupo-repository';

import { LancamentosGrupo } from '../model/lancamentos-grupo';

import { MessageError } from '../../error/MessageError';

export const deletaTodosOsGrupos = async ( db : SQLite.SQLiteDatabase ) => {
    await db.withTransactionAsync( async () => { 
        await lancamentosGrupoRepository.deleteAll( db );
    } );    
};

export const novoGrupo = async ( db : SQLite.SQLiteDatabase ) => {
    let ultimo = await lancamentosGrupoRepository.getUltimo( db );
    
    if ( ultimo !== null )
        if ( ultimo.aberto == true )
            throw new MessageError( 'Para abrir um novo grupo é necessário fechar o atual.' );

    let grupo = new LancamentosGrupo();
    grupo.dataIni = new Date();
    grupo.dataFim = new Date( 0 );
    grupo.aberto = true;
    grupo.ativo = true;
    
    await db.withTransactionAsync( async () => {
        await lancamentosGrupoRepository.fechaTodos( db );
        await lancamentosGrupoRepository.insere( db, grupo );
    } );

    return grupo;    
};

export const abreUltimoGrupo = async ( db : SQLite.SQLiteDatabase ) => {
    let grupo = await lancamentosGrupoRepository.getUltimo( db );
    if ( grupo === null )
        throw new MessageError( 'Nenhum grupo registrado' );

    if ( grupo.aberto == true )
        throw new MessageError( 'Grupo já aberto.' );

    grupo.dataFim = new Date( 0 );
    grupo.aberto = true;

    await lancamentosGrupoRepository.atualiza( db, grupo );
};

export const fechaGrupo = async ( db : SQLite.SQLiteDatabase, gid : number ) => {    
    let grupo = await lancamentosGrupoRepository.findById( db, gid );
    if ( grupo === null )
        throw new MessageError( 'Grupo não encontrado' );

    if ( grupo.aberto == false )
        throw new MessageError( 'Grupo não aberto.' );

    grupo.dataFim = new Date();
    grupo.aberto = false;

    await lancamentosGrupoRepository.atualiza( db, grupo );
};

export const desativaGrupo = async ( db : SQLite.SQLiteDatabase, id : number ) => {
    let grupo = await lancamentosGrupoRepository.findById( db, id );
    if ( grupo === null )
        throw new MessageError( 'Grupo de lançamentos não encontrado.' );

    if ( grupo.aberto == true )
        throw new MessageError( 'Para desativar um grupo aberto é necessário fechá-lo antes.' );

    await lancamentosGrupoRepository.atualizaAtivo( db, id, false );    
};

export const ativaGrupo = async ( db : SQLite.SQLiteDatabase, id : number ) => {
    await lancamentosGrupoRepository.atualizaAtivo( db, id, true );    
};

export const getGruposPorQuant = async ( db : SQLite.SQLiteDatabase, quant : number, ativo : boolean ) => {
    return await lancamentosGrupoRepository.listaPorQuant( db, quant, ativo );   
};

export const getGrupoPorId = async ( db : SQLite.SQLiteDatabase, id : number ) => {
    let grupo = await lancamentosGrupoRepository.findById( db, id );
        
    if ( grupo == null )
        throw new MessageError( 'Grupo de lançamentos não encontrado pelo ID.' );        

    return grupo;   
};

export const getIsGrupoAberto = async ( db : SQLite.SQLiteDatabase ) => {
    let grupo = await lancamentosGrupoRepository.getUltimo( db );    
    if ( grupo === null )
        throw new MessageError( 'Nenhum grupo registrado.' );        

    return grupo.aberto == true;
}

export const getGrupoAberto = async ( db : SQLite.SQLiteDatabase ) => {
    let grupo = await lancamentosGrupoRepository.getUltimo( db );              
    
    if ( grupo?.aberto == false )
        return null;

    return grupo;
};

export const getGrupoMaisRecente = async ( db : SQLite.SQLiteDatabase ) => {
    return await lancamentosGrupoRepository.getUltimo( db );          
};

export const deletaGrupoPorId = async ( db : SQLite.SQLiteDatabase, gid : number ) => {
    await db.withTransactionAsync( async () => {
        await lancamentosGrupoRepository.deletaPorId( db, gid );
    } );    
};

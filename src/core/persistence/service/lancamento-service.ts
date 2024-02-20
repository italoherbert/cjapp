import * as SQLite from 'expo-sqlite/next';

import * as lancamentoRepository from '../repository/lancamento-repository';
import { Lancamento } from '../model/lancamento';
import { MessageError } from '../../error/MessageError';

export const salvaLancamento = async ( db : SQLite.SQLiteDatabase, lancamento : Lancamento ) => {
    try {        
        await db.withTransactionAsync( async () => {
            let lanc = await lancamentoRepository.findById( db, lancamento.id );
            if ( lanc === null ) {
                await lancamentoRepository.insere( db, lancamento );
            } else {
                await lancamentoRepository.atualiza( db, lancamento );
            }
        } );
    } catch ( error ) {
        console.error( "Service Error= "+error );
        throw error;
    }
};

export const getLancamentoPorId = async ( db : SQLite.SQLiteDatabase, id : number ) => {
    try {
        let lancamento = await lancamentoRepository.findById( db, id );
        
        if ( lancamento == null )
            throw new MessageError( 'Lancamento não encontrado pelo ID.' );        

        return lancamento;
    } catch ( error ) {
        console.error( "Service Error= "+error ); 
        throw error; 
    }
};

export const getLancamentosPorGrupoId = async ( db : SQLite.SQLiteDatabase, grupoId : number ) => {
    try {
        return await lancamentoRepository.listaPorMesId( db, grupoId );              
    } catch ( error ) {
        console.error( "Service Error= "+error ); 
        throw error; 
    }
};

export const deletaLancamentoPorId = async ( db : SQLite.SQLiteDatabase, id : number ) => {
    try {
        await db.withTransactionAsync( async () => {
            await lancamentoRepository.deletaPorId( db, id );
        } );
    } catch ( error ) {
        console.error( "Service Error= "+error );
        throw error;
    }
};
import * as SQLite from 'expo-sqlite/next';

import * as lancamentoRepository from '../repository/lancamento-repository';
import { Lancamento } from '../model/lancamento';
import { MessageError } from '../../error/MessageError';

export const salvaLancamento = async ( db : SQLite.SQLiteDatabase, lancamento : Lancamento ) => {
    await db.withTransactionAsync( async () => {
        let lanc = await lancamentoRepository.findById( db, lancamento.id );
        if ( lanc === null ) {
            await lancamentoRepository.insere( db, lancamento );
        } else {
            await lancamentoRepository.atualiza( db, lancamento );
        }
    } );    
};

export const getLancamentoPorId = async ( db : SQLite.SQLiteDatabase, id : number ) => {
    let lancamento = await lancamentoRepository.findById( db, id );
        
    if ( lancamento == null )
        throw new MessageError( 'Lancamento não encontrado pelo ID.' );        

    return lancamento;    
};

export const getLancamentosPorGrupoId = async ( db : SQLite.SQLiteDatabase, grupoId : number ) => {
    return await lancamentoRepository.listaPorGrupoId( db, grupoId );                  
};

export const deletaLancamentoPorId = async ( db : SQLite.SQLiteDatabase, id : number ) => {
    await db.withTransactionAsync( async () => {
        await lancamentoRepository.deletaPorId( db, id );
    } );    
};
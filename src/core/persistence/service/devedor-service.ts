import * as SQLite from 'expo-sqlite/next';

import * as numberUtil from '../../util/number-util';

import * as devedorRepository from '../repository/devedor-repository';
import { Devedor } from '../model/devedor';

import { MessageError } from '../../error/MessageError';

export const salvaDevedor = async ( db : SQLite.SQLiteDatabase, devedor : Devedor ) => {
    if ( devedor.nome.trim().length == 0 )
        throw new MessageError( "O nome é um campo de preenchimento obrigatório." );

    if ( devedor.valor < 0 )
        throw new MessageError( "O valor informado deixaria o débito negativo." );

    await db.withTransactionAsync( async () => {
        let dev = await devedorRepository.findById( db, devedor.id );
        if ( dev === null ) {
            await devedorRepository.insere( db, devedor );
        } else {
            await devedorRepository.atualiza( db, devedor );
        }
    } );
};

export const filtraDevedores = async ( db : SQLite.SQLiteDatabase, nomeIni : string, antigo : boolean ) => {                  
    let devedores : Devedor[] = [];
        
    if ( nomeIni.trim() == '*' ) {
        devedores = await devedorRepository.lista( db, antigo );
    } else {
        devedores = await devedorRepository.filtra( db, nomeIni, antigo );        
    }

    return devedores;    
};

export const getDevedorPorId = async ( db : SQLite.SQLiteDatabase, id : number ) => {
    let devedor = await devedorRepository.findById( db, id );                
        
    if ( devedor == null )
        throw new MessageError( 'Devedor não encontrado pelo ID.' );

    return devedor;    
};

export const deletaDevedorPorId = async ( db : SQLite.SQLiteDatabase, id : number ) => {
    await db.withTransactionAsync( async () => {
        await devedorRepository.deletaPorId( db, id );
    } );              
};

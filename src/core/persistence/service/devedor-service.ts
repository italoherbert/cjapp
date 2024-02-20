import * as SQLite from 'expo-sqlite/next';

import * as devedorRepository from '../repository/devedor-repository';
import { Devedor } from '../model/devedor';
import { MessageError } from '../../error/MessageError';

export const salvaDevedor = async ( db : SQLite.SQLiteDatabase, devedor : Devedor ) => {
    if ( devedor.nome.trim().length == 0 )
        throw new MessageError( "O nome é um campo de preenchimento obrigatório." );
    
    try {
        await db.withTransactionAsync( async () => {
            let dev = await devedorRepository.findById( db, devedor.id );
            if ( dev === null ) {
                await devedorRepository.insere( db, devedor );
            } else {
                await devedorRepository.atualiza( db, devedor );
            }
        } );
    } catch ( error ) {
        console.error( "Service Error= "+error );
        throw error;
    }
};

export const filtraDevedores = async ( db : SQLite.SQLiteDatabase, nomeIni : string, antigo : boolean ) => {                  
    try {
        let devedores : Devedor[] = [];
        
        if ( nomeIni.trim() == '*' ) {
            devedores = await devedorRepository.lista( db, antigo );
        } else {
            devedores = await devedorRepository.filtra( db, nomeIni, antigo );        
        }

        return devedores;
    } catch ( error ) {
        console.error( "Service Error= "+error ); 
        throw error;       
    }
};

export const getDevedorPorId = async ( db : SQLite.SQLiteDatabase, id : number ) => {
    try {
        let devedor = await devedorRepository.findById( db, id );                
        
        if ( devedor == null )
            throw new MessageError( 'Devedor não encontrado pelo ID.' );

        return devedor;
    } catch ( error ) {
        console.error( "Service Error= "+error ); 
        throw error; 
    }
};

export const deletaDevedorPorId = async ( db : SQLite.SQLiteDatabase, id : number ) => {
    try {
        await db.withTransactionAsync( async () => {
            await devedorRepository.deletaPorId( db, id );
        } );          
    } catch ( error ) {
        console.error( "Service Error= "+error );
        throw error;
    }
};

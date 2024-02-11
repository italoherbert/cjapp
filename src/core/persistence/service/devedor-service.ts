import * as SQLite from 'expo-sqlite/next';

import * as devedorRepository from '../repository/devedor-repository';
import { Devedor } from '../model/devedor';

export default class DevedorService {

    db : SQLite.SQLiteDatabase | null = null;

    setDB( db : SQLite.SQLiteDatabase ) {
        this.db = db;
    }

    salvaDevedor = async ( devedor : Devedor ) => {
        if ( devedor.nome.trim().length == 0 )
            throw new Error( "O nome é um campo de preenchimento obrigatório." );
       
        try {
            await this.db!.withTransactionAsync( async () => {
                let dev = await devedorRepository.findById( this.db!, devedor.id );
                if ( dev === null ) {
                    await devedorRepository.insere( this.db!, devedor );
                } else {
                    await devedorRepository.atualiza( this.db!, devedor );
                }
            } );
        } catch ( error ) {
            console.error( "Service Error= "+error );
            throw error;
        }
    };

    filtraDevedores = async ( nomeLike : string, antigo : boolean ) => {                  
        try {
            let devedores : Devedor[] = [];
            
            if ( nomeLike.trim() == '*' ) {
                devedores = await devedorRepository.lista( this.db!, antigo );
            } else {
                devedores = await devedorRepository.filtra( this.db!, nomeLike, antigo );        
            }

            return devedores;
        } catch ( error ) {
            console.error( "Service Error= "+error ); 
            throw error;       
        }
    };

    getDevedorPorId = async ( id : number ) => {
        try {
            let devedor = await devedorRepository.findById( this.db!, id );                
            
            if ( devedor == null )
                throw new Error( 'Devedor não encontrado pelo ID.' );

            return devedor;
        } catch ( error ) {
            console.error( "Service Error= "+error ); 
            throw error; 
        }
    };

    deletaDevedorPorId = async ( id : number ) => {
        try {
            await this.db!.withTransactionAsync( async () => {
                await devedorRepository.deletaPorId( this.db!, id );
            } );          
        } catch ( error ) {
            console.error( "Service Error= "+error );
            throw error;
        }
    };

}
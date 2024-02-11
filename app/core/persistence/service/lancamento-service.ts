import * as SQLite from 'expo-sqlite/next';

import * as lancamentoRepository from '../repository/lancamento-repository';
import { Lancamento } from '../model/lancamento';

import * as converter from '../../converter/converter';

export default class LancamentoService {

    db : SQLite.SQLiteDatabase | null = null;

    setDB( db : SQLite.SQLiteDatabase ) {
        this.db = db;
    }

    deletaTodosOsLancamentos = async () => {
        try {            
            await this.db!.withTransactionAsync( async () => { 
                await lancamentoRepository.deleteAll( this.db! );
            } );
        } catch ( error ) {
            console.error( "Service Error= "+error );
            throw error;
        }
    };


    salvaLancamento = async ( lancamento : Lancamento ) => {
        try {        
            await this.db!.withTransactionAsync( async () => {
                let lanc = await lancamentoRepository.findById( this.db!, lancamento.id );
                if ( lanc === null ) {
                    await lancamentoRepository.insere( this.db!, lancamento );
                } else {
                    await lancamentoRepository.atualiza( this.db!, lancamento );
                }
            } );
        } catch ( error ) {
            console.error( "Service Error= "+error );
            throw error;
        }
    };

    filtraPorMes = async ( dataLanc: Date ) => {
        try {            
            let dataMes = converter.formatDataMes( dataLanc );
            return await lancamentoRepository.filtraPorMes( this.db!, dataMes );                             
        } catch ( error ) {
            console.error( "Service Error= "+error ); 
            throw error;       
        }
    };

    filtraPorIntervaloIgnoreTime = async ( dataIni : Date, dataFim : Date ) => {
        try {               
            let dtIni = converter.toDateZeroTime( dataIni );
            let dtFim = converter.toDateMaxTime( dataFim );  
            return  await lancamentoRepository.filtraPorIntervalo( this.db!, dtIni, dtFim );                  
        } catch ( error ) {
            console.error( "Service Error= "+error ); 
            throw error;       
        }
    };

    getLancamentoPorId = async (  id : number ) => {
        try {
            let lancamento = await lancamentoRepository.findById( this.db!, id );
            
            if ( lancamento == null )
                throw new Error( 'Lancamento não encontrado pelo ID.' );

            return lancamento;
        } catch ( error ) {
            console.error( "Service Error= "+error ); 
            throw error; 
        }
    };

    deletaLancamentoPorId = async ( id : number ) => {
        try {
            await this.db!.withTransactionAsync( async () => {
                await lancamentoRepository.deletaPorId( this.db!, id );
            } );
        } catch ( error ) {
            console.error( "Service Error= "+error );
            throw error;
        }
    };

}
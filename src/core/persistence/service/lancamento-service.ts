import * as SQLite from 'expo-sqlite/next';

import * as lancamentoRepository from '../repository/lancamento-repository';
import { Lancamento } from '../model/lancamento';

import * as converter from '../../converter/converter';

export default class LancamentoService {

    deletaTodosOsLancamentos = async ( db : SQLite.SQLiteDatabase ) => {
        try {            
            await db.withTransactionAsync( async () => { 
                await lancamentoRepository.deleteAll( db );
            } );
        } catch ( error ) {
            console.error( "Service Error= "+error );
            throw error;
        }
    };


    salvaLancamento = async ( db : SQLite.SQLiteDatabase, lancamento : Lancamento ) => {
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

    filtraPorMes = async ( db : SQLite.SQLiteDatabase, dataLanc: Date ) => {
        try {            
            let dataMes = converter.formatDataMes( dataLanc );
            return await lancamentoRepository.filtraPorMes( db, dataMes );                             
        } catch ( error ) {
            console.error( "Service Error= "+error ); 
            throw error;       
        }
    };

    filtraPorIntervaloIgnoreTime = async ( db : SQLite.SQLiteDatabase, dataIni : Date, dataFim : Date ) => {
        try {               
            let dtIni = converter.toDateZeroTime( dataIni );
            let dtFim = converter.toDateMaxTime( dataFim );  
            return  await lancamentoRepository.filtraPorIntervalo( db, dtIni, dtFim );                  
        } catch ( error ) {
            console.error( "Service Error= "+error ); 
            throw error;       
        }
    };

    getLancamentoPorId = async ( db : SQLite.SQLiteDatabase, id : number ) => {
        try {
            let lancamento = await lancamentoRepository.findById( db, id );
            
            if ( lancamento == null )
                throw new Error( 'Lancamento não encontrado pelo ID.' );

            return lancamento;
        } catch ( error ) {
            console.error( "Service Error= "+error ); 
            throw error; 
        }
    };

    deletaLancamentoPorId = async ( db : SQLite.SQLiteDatabase, id : number ) => {
        try {
            await db.withTransactionAsync( async () => {
                await lancamentoRepository.deletaPorId( db, id );
            } );
        } catch ( error ) {
            console.error( "Service Error= "+error );
            throw error;
        }
    };

}
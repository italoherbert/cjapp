import * as SQLite from 'expo-sqlite/next';

import * as lancamentosGrupoRepository from '../repository/lancamentos-grupo-repository';
import * as lancamentoRepository from '../repository/lancamento-repository';

import { LancamentosGrupo } from '../model/lancamentos-grupo';
import { MessageError } from '../../error/MessageError';
import { Lancamento } from '../model/lancamento';
import { findById } from '../repository/devedor-repository';

export const deletaTodosOsGrupos = async ( db : SQLite.SQLiteDatabase ) => {
    try {            
        await db.withTransactionAsync( async () => { 
            await lancamentosGrupoRepository.deleteAll( db );
        } );
    } catch ( error ) {
        console.error( "Service Error= "+error );
        throw error;
    }
};

export const novoGrupo = async ( db : SQLite.SQLiteDatabase ) => {
    try {
        let atual = await existeGrupoAberto( db );
        if ( atual === true )
            throw new MessageError( 'Para abrir um novo grupo é necessário fechar o atual.' );

        let grupo = new LancamentosGrupo();
        grupo.dataIni = new Date();
        grupo.dataFim = new Date( 0 );
        grupo.aberto = true;

        await db.withTransactionAsync( async () => {
            await lancamentosGrupoRepository.fechaTodos( db );
            await lancamentosGrupoRepository.insere( db, grupo );
        } );

        return grupo;
    } catch ( error ) {
        console.error( "Service Error= "+error );
        throw error;
    }
};

export const fechaGrupo = async ( db : SQLite.SQLiteDatabase, 
            id : number, 
            totalEmEspecie : number, totalEmContaCorrente : number ) => {
    try {
        let grupo = await lancamentosGrupoRepository.findById( db, id );
        if ( grupo === null )
            throw new MessageError( 'Grupo não encontrado' );

        if ( grupo.aberto != true )
            throw new MessageError( 'Grupo não aberto.' );

        let lancDebEmEspecie = new Lancamento();
        lancDebEmEspecie.dataLanc = new Date();
        lancDebEmEspecie.descricao = "Fechamento de grupo";
        lancDebEmEspecie.valor = totalEmEspecie;
        lancDebEmEspecie.tipo = 'debito';
        lancDebEmEspecie.emContaCorrente = true;
        lancDebEmEspecie.doJogo = false;

        let lancDebEmContaCorrente = new Lancamento();
        lancDebEmContaCorrente.dataLanc = new Date();
        lancDebEmContaCorrente.descricao = "Fechamento de grupo";
        lancDebEmContaCorrente.valor = totalEmContaCorrente;
        lancDebEmContaCorrente.tipo = 'debito';
        lancDebEmContaCorrente.emContaCorrente = false;
        lancDebEmContaCorrente.doJogo = false;

        grupo.dataFim = new Date();
        grupo.aberto = false;

        await db.withTransactionAsync( async () => {
            await lancamentoRepository.insere( db, lancDebEmEspecie );
            await lancamentoRepository.insere( db, lancDebEmContaCorrente );

            await lancamentosGrupoRepository.atualiza( db, grupo! );
        } );
    } catch ( error ) {
        console.error( "Service Error= "+error );
        throw error;
    }
};

export const getGruposPorQuant = async ( db : SQLite.SQLiteDatabase, quant : number ) => {
    try {
        return await lancamentosGrupoRepository.listaPorQuant( db, quant );
    } catch ( error ) {
        console.error( "Service Error= "+error );
        throw error;
    }
};

export const getGrupoPorId = async ( db : SQLite.SQLiteDatabase, id : number ) => {
    try {
        let grupo = await lancamentosGrupoRepository.findById( db, id );
        
        if ( grupo == null )
            throw new MessageError( 'Grupo de lançamentos não encontrado pelo ID.' );        

        return grupo;
    } catch ( error ) {
        console.error( "Service Error= "+error ); 
        throw error; 
    }
};

export const existeGrupoAberto = async ( db : SQLite.SQLiteDatabase ) => {
    let grupo = await getGrupoAberto( db );
    return grupo !== null;
}

export const getGrupoAberto = async ( db : SQLite.SQLiteDatabase ) => {
    try {
        return await lancamentosGrupoRepository.getAberto( db );         
    } catch ( error ) {
        console.error( "Service Error= "+error ); 
        throw error; 
    }
};

export const deletaGrupoPorId = async ( db : SQLite.SQLiteDatabase, id : number ) => {
    try {
        await db.withTransactionAsync( async () => {
            await lancamentosGrupoRepository.deletaPorId( db, id );
        } );
    } catch ( error ) {
        console.error( "Service Error= "+error );
        throw error;
    }
};
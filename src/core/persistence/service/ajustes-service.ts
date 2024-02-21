
import * as SQLite from 'expo-sqlite/next';

import * as dateUtil from '../../util/date-util';

export const ajustarDB = async ( db : SQLite.SQLiteDatabase ) => {    
    await db.withTransactionAsync( async () => {        
        await db.execAsync( 'alter table lancamento add column lancamentos_grupo_id integer references lancamentos_grupo( id )' );                    

        let result = await db.runAsync( `
            insert into lancamentos_grupo (
                data_ini, data_fim, aberto, ativo 
            ) values ( ?, ?, ?, ? )
        `, [
            dateUtil.toDate( '2024-02-06' ).toISOString(),
            new Date( 0 ).toISOString(),
            true,
            true
        ] );        

        await db.runAsync( 'update lancamento set lancamentos_grupo_id=?', [ 
            result.lastInsertRowId 
        ] );
    } );
};    


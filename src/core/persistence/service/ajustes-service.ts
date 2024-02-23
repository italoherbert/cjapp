
import * as SQLite from 'expo-sqlite/next';

export const ajustarDB = async ( db : SQLite.SQLiteDatabase ) => {    
    await db.withTransactionAsync( async () => { 
        await db.execAsync( 'create table lancamento2 as select * from lancamento' );       
        await db.execAsync( 'delete from lancamento' );
        await db.execAsync( 'alter table lancamento drop column lancamentos_grupo_id' );                    
        await db.execAsync( 'alter table lancamento add column lancamentos_grupo_id integer references lancamentos_grupo( id ) on delete cascade' );        
        await db.execAsync( 'insert into lancamento select * from lancamento2' );
        await db.execAsync( 'drop table lancamento2' );
    } );
};    


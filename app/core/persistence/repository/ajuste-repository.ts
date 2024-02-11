/*import { SQLiteDatabase } from "expo-sqlite/next";

import AsyncStorage from '@react-native-async-storage/async-storage';

export const migrateDB = async ( db : SQLiteDatabase ) => {
    let keys = await AsyncStorage.getAllKeys();

    await db.execAsync( 'delete from devedor' );
    await db.execAsync( 'delete from lancamento' );

    for( let key of keys ) {
        let ps = key.split( ',' );
        let item = await AsyncStorage.getItem( key );
        let entity = JSON.parse( item! );

        if ( ps[0] === 'devedores' ) {
            let sql = 
                `insert into devedor ( nome, data_debito, valor, antigo ) values ( 
                 \'${entity.nome}\', \'${entity.dataDebito}\', ${entity.valor}, false );`;

            await db.execAsync( sql );
        } else if ( ps[0] === 'lancamentos' ) {
            let sql = 
                `insert into lancamento ( descricao, data_lanc, valor, tipo, em_conta_corrente ) values ( 
                 \'${entity.descricao}\', \'${entity.dataLanc}\', 
                 ${entity.valor}, \'${entity.tipo}\', ${entity.emContaCorrente } );`;
            
            await db.execAsync( sql );
        }
    }
};
*/
import * as SQLite from 'expo-sqlite/next';

export default class AjustesService {

    db : SQLite.SQLiteDatabase | null = null;

    setDB( db : SQLite.SQLiteDatabase ) {
        this.db = db;
    }

    addColumnDoJogo = async () => {
        await this.db?.withTransactionAsync( async () => {
            await this.db?.execAsync( 'alter table lancamento add column do_jogo boolean default trues' );
        } );
    };

}
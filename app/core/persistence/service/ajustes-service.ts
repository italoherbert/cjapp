import * as SQLite from 'expo-sqlite/next';

export default class AjustesService {

    db : SQLite.SQLiteDatabase | null = null;

    setDB( db : SQLite.SQLiteDatabase ) {
        this.db = db;
    }

}
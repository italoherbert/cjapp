import * as SQLite from 'expo-sqlite/next';
import { Devedor } from '../model/devedor';

export const insere = async ( db : SQLite.SQLiteDatabase, devedor : Devedor ) => {    
    let result = await db.runAsync( 
        'insert into devedor ( nome, data_debito, valor, antigo ) values (?, ?, ?, ?)', [   
            devedor.nome, 
            devedor.dataDebito.toISOString(), 
            devedor.valor,
            devedor.antigo
        ] 
    );  
    devedor.id = result.lastInsertRowId;                     
};

export const atualiza = async ( db : SQLite.SQLiteDatabase, devedor : Devedor ) => {
    await db.runAsync( 
        'update devedor set nome=?, data_debito=?, valor=?, antigo=? where id=?', [
            devedor.nome,
            devedor.dataDebito.toISOString(),
            devedor.valor,
            devedor.antigo,
            devedor.id
        ]
    );    
};

export const lista = async ( db : SQLite.SQLiteDatabase, antigo : boolean ) => {    
    let result = await db.getAllAsync( 
        `select 
            id, nome, data_debito, valor, antigo 
         from devedor 
         where antigo=?`, [ 
            antigo 
        ] 
    );         

    return rowsToDevedores( result );
};

export const filtra = async ( db : SQLite.SQLiteDatabase, nomeIni : string, antigo : boolean ) => {
    let result = await db.getAllAsync( 
        `select 
            id, nome, data_debito, valor, antigo 
         from devedor 
         where lower(nome) like lower(?) and antigo=?`, [
            nomeIni+"%",
            antigo
        ] 
    );        
    
    return rowsToDevedores( result );
};

export const findById = async ( db : SQLite.SQLiteDatabase, id : number ) => {
    let result = await db.getFirstAsync( 
        'select id, nome, data_debito, valor, antigo from devedor where id=?', [
            id
        ] 
    );         

    if ( result === null )
        return null;

    return rowToDevedor( result );    
};

export const deletaPorId = async ( db : SQLite.SQLiteDatabase, id : number ) => {
    await db.runAsync( 
        'delete from devedor where id=?', [
            id
        ] 
    );
};

export const rowsToDevedores = ( rows : any[] ) => {
    let devedores: Devedor[] = [];
    for( let row of rows )
        devedores.push( rowToDevedor( row ) );    
    return devedores;
};

export const rowToDevedor = ( row : any ) => {
    let devedor : Devedor = new Devedor();
    devedor.id = row['id'];
    devedor.nome = row['nome'];
    devedor.dataDebito = row['data_debito'];
    devedor.valor = row['valor']; 
    devedor.antigo = row['antigo'];
    return devedor;
};
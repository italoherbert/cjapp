
import {describe, it, expect} from '@jest/globals';

describe( "testando ordenação...", () => {
    it( "Testando ordenacao.", () => {
        let vetor = [ '2024/02/01','2024/01/30', '2024/02/30', '2024/01/01' ].sort( ( a, b ) => {
            if ( a < b )
                return 1;
            if ( a > b )
                return -1;
            return 0;
        } );

        let vetorOrdenado = [ '2024/02/30', '2024/02/01', '2024/01/30', '2024/01/01' ]

        for( let i = 0; i < vetor.length; i++ )
            expect( vetor[ i ] ).toBe( vetorOrdenado[ i ] );        
    } )
});
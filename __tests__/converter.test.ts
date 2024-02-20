import {describe, it, expect} from '@jest/globals';

import * as converter from '../src/core/converter/converter';

describe( "testando converter...", () => {
    it( "Testando converter.", () => {
        let date = converter.toDate( '2024-01-01 00:00:00:01' );
        let df = converter.formatDate( date );

        expect( df ).toBe( '01/01/2024' );

        date = new Date( date.getTime() + ( 24 * 3600000 ) );
        df = converter.formatDate( date );

        expect( df ).toBe( '02/01/2024' );        
    } );
} );
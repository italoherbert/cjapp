import {describe, it, expect} from '@jest/globals';

import * as converter from '../src/core/util/date-util';

describe( "testando converter...", () => {
    it( "Testando converter.", () => {
        let date = converter.toDate( '2024-01-01 00:00:00:01' );
        let df = converter.formatDate( date );

        expect( df ).toBe( '01/01/2024' );

        date = new Date( date.getTime() + ( 24 * 3600000 ) );
        df = converter.formatDate( date );

        expect( df ).toBe( '02/01/2024' );        
    } );
    it( "Testando o parseFloat com isNaN", () => {
        let regexp = /^[-\+]?(\d)+[\.\,]?(\d)*$/;

        expect( regexp.test( '10a' ) ).toBe( false );
        expect( regexp.test( '.10.9') ).toBe( false );
        expect( regexp.test( '1.0.' ) ).toBe( false );
        expect( regexp.test( '1,0,' ) ).toBe( false );
        expect( regexp.test( 'a1' ) ).toBe( false );
        expect( regexp.test( '1000.*04987' ) ).toBe( false );
        expect( regexp.test( '1000a.04987' ) ).toBe( false );
        expect( regexp.test( '1000,.04987' ) ).toBe( false );
        expect( regexp.test( '1000.,04987' ) ).toBe( false );
        expect( regexp.test( '1000&04987' ) ).toBe( false );
        expect( regexp.test( '*100004987' ) ).toBe( false );
        expect( regexp.test( '100004987%' ) ).toBe( false );
        expect( regexp.test( '+-9999') ).toBe( false );
        expect( regexp.test( '-+9999') ).toBe( false );
        expect( regexp.test( '++9999') ).toBe( false );
        expect( regexp.test( '--9999') ).toBe( false );

        expect( regexp.test( '1000.04987' ) ).toBe( true );
        expect( regexp.test( '10,05') ).toBe( true );
        expect( regexp.test( '-10') ).toBe( true );
        expect( regexp.test( '+10.0') ).toBe( true );
        expect( regexp.test( '-9999,19') ).toBe( true );
        expect( regexp.test( '+9999,19') ).toBe( true );
    } );
} );
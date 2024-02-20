
import {describe, it, expect} from '@jest/globals';

describe( "testando regexp...", () => {
    it( "Testando regexp.", () => {
        expect( /.*Ma.*/gi.test( "maria" ) ).toBe( true );
        expect( /.*Mra.*/gi.test( "maria" ) ).toBe( false );
    } )
});
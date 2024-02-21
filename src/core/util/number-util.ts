
const REGEXP_NAN_VERIFY = /^[-\+]?(\d)+[\.\,]?(\d)*$/;

export const formatBRL = ( num : number ) => {
    return "R$ "+ num.toFixed( 2 ).toString().replaceAll( '.', ',' );
};

export const isNumber = ( numstr : string ) => {
    return REGEXP_NAN_VERIFY.test( numstr );
};

export const numberToStringComPonto = ( num : number ) => {
    return num.toString().replaceAll( ',', '.' )
};

export const stringToNumber = ( numstr : string ) => {
    return parseFloat( numstr.replaceAll( ',', '.' ) );
};  
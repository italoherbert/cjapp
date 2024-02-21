
import moment from 'moment';

export const formatDate = ( date : Date ) => {
    return moment( date ).format('DD/MM/YYYY');
};

export const formatInvertDate = ( date : Date ) => {
    return moment( date ).format('YYYY/MM/DD');
};

export const formatDataMes = ( date : Date ) => {
    return moment( date ).format( 'YYYY-MM' );
}

export const toDate = ( date : string ) => {
    return new Date( date );
};  

export const toDateZeroTime = ( date : Date ) => {
    return moment( moment( date ).format( 'YYYY-MM-DD' ), 'YYYY-MM-DD' ).toDate();
};

export const toDateMaxTime = ( date : Date ) => {
    let d = toDateZeroTime( date );
    return new Date( d.getTime() + ( 24*3600000-1 ) );
};
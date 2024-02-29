
import Snackbar from 'react-native-snackbar';

export class SnackbarUI {
    static showDanger = ( text : string ) => {
        Snackbar.show( {
             text : text, 
             duration: Snackbar.LENGTH_LONG,
             textColor: '#FFF',
             backgroundColor: '#F55',
        } );
    };
    
    static showInfo = ( text : string, callback? : Function ) => {        
        if ( callback !== undefined ) {
            setTimeout( () => {
                callback();
            }, 3000 );
        }

        Snackbar.show( { 
            text : text, 
            duration: Snackbar.LENGTH_LONG,
            textColor: '#FFF',
            backgroundColor: '#5AF', 
        } );
    };

    static showDanger2 = ( text : string ) => {
        Snackbar.show( {
            text : text, 
            duration: Snackbar.LENGTH_LONG,
            textColor: '#FFF',
            backgroundColor: '#F55',
            numberOfLines: 20
       } );
    };
}
export default SnackbarUI;
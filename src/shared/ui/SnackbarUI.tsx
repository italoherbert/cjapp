
import Snackbar from 'react-native-snackbar';

export class SnackbarUI {
    static showDanger = ( text : string ) => {
        Snackbar.show( {
             text : text, 
             duration: Snackbar.LENGTH_LONG,
             textColor: '#FFF',
             backgroundColor: '#F55'
        } );
    };
    static showInfo = ( text : string ) => {
        Snackbar.show( { 
            text : text, 
            duration: Snackbar.LENGTH_LONG,
            textColor: '#FFF',
            backgroundColor: '#5AF'
        } );
    };
}
export default SnackbarUI;
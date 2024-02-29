import { MessageError } from "../../core/error/MessageError";
import SnackbarUI from "../ui/SnackbarUI";

export const handleError = ( error : any, setMessage : Function, setVisible : Function, setType : Function ) => {
    if ( error instanceof MessageError ) {       
        setMessage( error.message );
        setType( 'error' );
        setVisible( true );        
    } else {
        SnackbarUI.showDanger2( error.message );
        throw error;
    }
};
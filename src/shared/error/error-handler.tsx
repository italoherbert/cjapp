import { MessageError } from "../../core/error/MessageError";
import SnackbarUI from "../ui/SnackbarUI";

export const handleError = ( error : any ) => {
    if ( error instanceof MessageError ) {            
        SnackbarUI.showDanger( error.message );
    } else {
        SnackbarUI.showDanger2( error.message );
        throw error;
    }
};
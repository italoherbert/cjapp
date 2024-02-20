import { MessageError } from "../../core/error/MessageError";
import SnackbarUI from "../ui/SnackbarUI";

export const handleError = async ( error : any ) => {
    if ( error instanceof MessageError )            
        SnackbarUI.showDanger( error.message );
    throw error;
};

export const handleInfo = async ( info : string ) => {
    SnackbarUI.showInfo( info );
}
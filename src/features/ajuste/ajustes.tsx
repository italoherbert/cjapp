import React, { useState } from 'react';
import {
  Button,
  ScrollView,
  Text,
  View,
  Alert
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack'; 

import Dialog from 'react-native-dialog';

import { StackParamsList } from '../../shared/screens/StackParamsList';

import globalStyle from '../../shared/style/global-style';

import { persistence } from '../../core/persistence/persistence';
import SnackbarUI from '../../shared/ui/SnackbarUI';

const Ajustes = ( { navigation, route } : NativeStackScreenProps<StackParamsList, 'Ajustes'> ): React.JSX.Element => {

    const [resetarDialogVisivel, setResetarDialogVisivel] = useState<boolean>(false);

    const resetarOnPress = async () => {
        setResetarDialogVisivel( false );
        try {
          await persistence.lancamentoService.deletaTodosOsLancamentos();  
  
          SnackbarUI.showInfo( 'Lista de lançamentos resetada com sucesso.' );
        } catch ( error : any ) {
          Alert.alert( ''+error.message );
        }
    };

    const addColumnDoJogoOnPress = async () => {
        try {
            await persistence.ajustesService.addColumnDoJogo();  
    
            SnackbarUI.showInfo( 'Coluna adicionada com sucesso.' );
        } catch ( error : any ) {
            Alert.alert( ''+error.message );
        }
    }

    return (
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={globalStyle.mainScroll}>
            <View>
                <View style={globalStyle.titlePanel}>
                    <Text style={globalStyle.title}>
                        Ajustes
                    </Text>
                </View>
        
                <View style={globalStyle.buttonPanel}>
                    <Button 
                        title="Resetar lançamentos" 
                        color={globalStyle.buttonPrimary.color} 
                        onPress={() => setResetarDialogVisivel( !resetarDialogVisivel )} /> 
                        
                    <Dialog.Container visible={resetarDialogVisivel}>
                        <Dialog.Title>Exclusão de lançamentos</Dialog.Title>
                        <Dialog.Description>
                            Tem certeza que deseja excluir a lista de lançamentos?
                        </Dialog.Description>
                        <Dialog.Button label="Excluir" onPress={resetarOnPress} />
                        <Dialog.Button label="Cancelar" onPress={() => setResetarDialogVisivel( false )} />                  
                    </Dialog.Container>
                </View> 

                <Button 
                        title="Adicionar coluna 'Do Jogo'" 
                        color={globalStyle.buttonPrimary.color} 
                        onPress={addColumnDoJogoOnPress} /> 
            </View>
        </ScrollView>
    )
};

export default Ajustes;
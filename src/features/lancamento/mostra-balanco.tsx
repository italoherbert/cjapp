import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import globalStyle from '../../shared/style/global-style';

import { StackParamsList } from '../../shared/screens/StackParamsList';

import MostraBalancoUI from '../../shared/components/mostra-balanco-ui';
import ButtonIconUI from '../../shared/ui/ButtonIconUI';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import ScrollViewUI from '../../shared/ui/ScrollViewUI';

function MostraBalanco({ route, navigation } : NativeStackScreenProps<StackParamsList, 'MostraBalanco'> ): React.JSX.Element {

return (
      <ScrollViewUI>                   
        
        <ButtonIconUI
            label='Voltar'
            icon={faArrowAltCircleLeft}
            flex={1}
            onPress={() => navigation.goBack() }
        />                        

        <MostraBalancoUI 
            lancamentos={ route.params!.lancamentos } 
        />           
      </ScrollViewUI>
    );
    
  }
  
  const styles = StyleSheet.create({         
        
  });
  
  export default MostraBalanco;
  
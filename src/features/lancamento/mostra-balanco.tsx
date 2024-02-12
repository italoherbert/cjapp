import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import globalStyle from '../../shared/style/global-style';

import { StackParamsList } from '../../shared/screens/StackParamsList';

import MostraBalancoUI from '../../shared/components/mostra-balanco-ui';
import ButtonUI from '../../shared/ui/ButtonUI';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';

function MostraBalanco({ route, navigation } : NativeStackScreenProps<StackParamsList, 'MostraBalanco'> ): React.JSX.Element {

return (
      <ScrollView            
            contentInsetAdjustmentBehavior="automatic"
            style={globalStyle.mainScroll}>                   
        
        <View style={{flexDirection: 'row', flex: 3}}>
            <ButtonUI
                label='Voltar'
                icon={faArrowAltCircleLeft}
                color={globalStyle.buttonPrimary.color} 
                size={14}
                style={{flex : 1}}
                onPress={() => navigation.goBack() }
            />                        
        </View>  

        <MostraBalancoUI 
            lancamentos={ route.params!.lancamentos } 
        />           
      </ScrollView>
    );
    
  }
  
  const styles = StyleSheet.create({         
        
  });
  
  export default MostraBalanco;
  
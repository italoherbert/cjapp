import {
  ScrollView,
  StyleSheet,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import globalStyle from '../../shared/style/global-style';

import { StackParamsList } from '../../shared/screens/StackParamsList';

import MostraBalancoUI from '../../shared/components/mostra-balanco-ui';

function MostraBalanco({ route, navigation } : NativeStackScreenProps<StackParamsList, 'MostraBalanco'> ): React.JSX.Element {

return (
      <ScrollView            
            contentInsetAdjustmentBehavior="automatic"
            style={globalStyle.mainScroll}>                   
        
        <MostraBalancoUI 
            lancamentos={ route.params!.lancamentos } 
            goBack={ () => navigation.goBack() }
        />           
      </ScrollView>
    );
    
  }
  
  const styles = StyleSheet.create({         
        
  });
  
  export default MostraBalanco;
  
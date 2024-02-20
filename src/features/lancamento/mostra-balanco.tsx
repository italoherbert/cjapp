import { NativeStackScreenProps } from '@react-navigation/native-stack';

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
    
  export default MostraBalanco;
  
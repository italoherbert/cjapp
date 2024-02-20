import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParamsList } from '../../shared/screens/StackParamsList';

import MostraBalancoUI from '../../shared/components/mostra-balanco-ui';
import ButtonIconUI from '../../shared/ui/ButtonIconUI';
import ScrollViewUI from '../../shared/ui/ScrollViewUI';
import TitleUI from '../../shared/ui/TitleUI';

function MostraBalanco({ route, navigation } : NativeStackScreenProps<StackParamsList, 'MostraBalanco'> ): React.JSX.Element {

return (
      <ScrollViewUI>                   
        <ButtonIconUI
            label='Voltar'
            icon={faArrowAltCircleLeft}
            flex={1}
            onPress={() => navigation.goBack() }
        />                        

        <TitleUI title='Balanço' />

        <MostraBalancoUI 
            lancamentos={ route.params!.lancamentos } 
        />           
      </ScrollViewUI>
    );
    
  }
    
  export default MostraBalanco;
  
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Page1 } from './presentation/Page1';
import { Page2 } from './presentation/Page2';
import { Page3 } from './presentation/Page3';

const Stack = createNativeStackNavigator();

export function Routes(){
    return (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Page1" component={Page1} options={{
                headerShown:false
            }}/>
            <Stack.Screen name="Page2" component={Page2} options={{
                headerShown:false
            }}/>
            <Stack.Screen name="Page3" component={Page3} options={{
                headerShown:false
            }}/>
          </Stack.Navigator>
        </NavigationContainer>
      );
}
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './Home';
// import DateReportManage from './DateReportManage';
import DateReport from './DateReport';
import PhotoDateReport from './PhotoDateReport';
import UploadDate from './UploadDate';
import DateInput from './DateInput';
import ReceptionReport from './ReceptionReport';
import PhotoReceptionReport from './PhotoReceptionReport';
import UploadReception from './UploadReception';
import DateHistory from './DateHistory';
import DateHistoryDetail from './DateHistoryDetail';
import ReceptionHistory from './ReceptionHistory';
import ReceptionHistoryDetail from './ReceptionHistoryDetail';
import EditData from './EditDataDate';
import ReceptionInput from './ReceptionInput';
import EditDataDate from './EditDataDate';
import EditDataReception from './EditDataReception';
// import DateReportManage from './DateReportManage';


const Stack = createStackNavigator();

function HomeManage({route}): React.JSX.Element {
  const {user, goBack} = route.params;
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home"
          component={Home}
          initialParams={{ user, goBack }}
        />
        
        <Stack.Screen name="DateReport" component={DateReport} />
        <Stack.Screen name="PhotoDateReport" component={PhotoDateReport} />
        <Stack.Screen name="UploadDate" component={UploadDate} />
        <Stack.Screen name="DateInput" component={DateInput} />
        <Stack.Screen name="ReceptionReport" component={ReceptionReport} />
        <Stack.Screen name="PhotoReceptionReport" component={PhotoReceptionReport} />
        <Stack.Screen name="UploadReception" component={UploadReception} />
        <Stack.Screen name="DateHistory" component={DateHistory} />
        <Stack.Screen name="DateHistoryDetail" component={DateHistoryDetail}/>
        <Stack.Screen name="ReceptionHistory" component={ReceptionHistory} />
        <Stack.Screen name="ReceptionHistoryDetail" component={ReceptionHistoryDetail}/>
        <Stack.Screen name="ReceptionInput" component={ReceptionInput}/>
        <Stack.Screen name="EditDataDate" component={EditDataDate}/>
        <Stack.Screen name="EditDataReception" component={EditDataReception}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default HomeManage;

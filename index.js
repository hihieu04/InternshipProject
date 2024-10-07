/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import ReceptionReport from './src/screen/ReceptionReport';
import ReceptionInput from './src/screen/ReceptionInput';
import DateInput from './src/screen/DateInput';
import Manage from './src/screen/Manage';
import Home from './src/screen/Home';
import DateReport from './src/screen/DateReport';
import Report from './src/screen/Report';
import PhotoDateReport from './src/screen/PhotoDateReport';
import PhotoReceptionReport from './src/screen/PhotoReceptionReport';
import DateReportManage from './src/screen/DateReportManage';
import UploadDate from './src/screen/UploadDate';
import UploadReception from './src/screen/UploadReception';
import HomeManage from './src/screen/HomeManage';
import Login from './src/screen/Login';
import NavigatorLogin from './src/screen/NavigatorLogin';
import NamePersonList from './src/screen/NamePersonList';
AppRegistry.registerComponent(appName, () => NavigatorLogin);

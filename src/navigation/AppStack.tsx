// AppStack.tsx
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import MembersScreen from '../screens/MemberScreen';
import AddMemberScreen from '../screens/AddMemberScreen';
import CreateEventScreen from '../screens/CreateEvent';
import EventDetailScreen from '../screens/EventDetailScreen';
import ClockInScreen from '../screens/ClockInScreen';
import AttendanceScreen from '../screens/AttendanceScreen';
import ReportScreen from '../screens/ReportScreen';
import CustomDrawerContent from './CustomDrawerContent';
import EditMemberScreen from '../screens/EditMemberScreen';
import EditEventScreen from '../screens/EditEventScreen';
import EventAttendanceScreen from '../screens/EventAttendanceScreen';
import ContactUsScreen from '../screens/ContactUsScreen';
import FAQScreen from '../screens/FaqScreen'; // Assuming you have a FAQScreen
  
const Drawer = createDrawerNavigator();

const AppStack = () => (
  <Drawer.Navigator
    screenOptions={{ headerShown: false }}
    drawerContent={() => <CustomDrawerContent />}
  >
    <Drawer.Screen name="Home" component={HomeScreen} />
    <Drawer.Screen name="MemberDetail" component={MembersScreen} />
    <Drawer.Screen name="AddMember" component={AddMemberScreen} />
    <Drawer.Screen name="CreateEvent" component={CreateEventScreen} />
    <Drawer.Screen name="EventDetail" component={EventDetailScreen} />
    <Drawer.Screen name="ClockInScreen" component={ClockInScreen} />
    <Drawer.Screen name="AttendanceScreen" component={AttendanceScreen} />
    <Drawer.Screen name="ReportScreen" component={ReportScreen} />
    <Drawer.Screen name="EditMember" component={EditMemberScreen} />
    <Drawer.Screen name="EditEvent" component={EditEventScreen} />
    <Drawer.Screen name="EventAttendance" component={EventAttendanceScreen} />
    <Drawer.Screen name="ContactUs" component={ContactUsScreen} />
    <Drawer.Screen name="Faq" component={FAQScreen} />

    
  </Drawer.Navigator>
);

export default AppStack;

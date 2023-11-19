import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/Home/LoginScreen";
import SignupIdentityVerificationScreen from "../screens/Home/SignupIdentityVerificationScreen";
import SignupInformationScreen from "../screens/Home/SignupInformationScreen";
import SignupInformationEmailScreen from "../screens/Home/SignupInformationEmailScreen";

import SignupCompleteScreen from "../screens/Home/SignupCompleteScreen";
import HomeScreen from "../screens/Home/HomeScreen";
import AccountDetailScreen from "../screens/Account/AccountDetailScreen";
import AccountOverviewScreen from "../screens/Account/AccountOverviewScreen";
import AccountResetPasswordOneScreen from "../screens/Account/AccountResetPasswordOneScreen";
import AccountResetPasswordTwoScreen from "../screens/Account/AccountResetPasswordTwoScreen";
import AccountResetPasswordSucceessScreen from "../screens/Account/AccountResetPasswordSucceessScreen";
import TransferScreen from "../screens/Transfer/TransferScreen";
import TransferAmountScreen from "../screens/Transfer/TransferAmountScreen";
import TransferDetailScreen from "../screens/Transfer/TransferDetailScreen";
import TransferCompleteScreen from "../screens/Transfer/TransferCompleteScreen";
import AccountSetupScreen from "../screens/OpenAccount/AccountSetupScreen";
import AccountConfigurationScreen from "../screens/OpenAccount/AccountConfigurationScreen";
import AccountRestrictionScreen from "../screens/OpenAccount/AccountRestrictionScreen";
import OpenAccountCompleteScreen from "../screens/OpenAccount/OpenAccountCompleteScreen";
import AccountWhatMakeScreen from "../screens/OpenAccount/AccountWhatMakeScreen";
import AccountManagementScreen from "../screens/Account/AccountManagementScreen";
import AccountWithdrawalScreen from "../screens/CloseAccount/AccountWithdrawalScreen";
import TransactionDetailScreen from "../screens/Account/TransactionDetailScreen";
import MyPageScreen from "../screens/Home/MyPageScreen";
import FindIDScreen from "../screens/Home/FindIDScreen";
import ResetPasswordOneScreen from "../screens/Home/ResetPasswordOneScreen";
import ResetPasswordTwoScreen from "../screens/Home/ResetPasswordTwoScreen";
import FindIDSucceessScreen from "../screens/Home/FindIDSucceessScreen";
import ResetPasswordSucceessScreen from "../screens/Home/ResetPasswordSucceessScreen";
import ChangePasswordSucceessScreen from "../screens/Home/ChangePasswordSucceessScreen";
import ExamScreen from "../screens/Home/ExamScreen";
import ChangePasswordScreen from "../screens/Home/ChangePasswordScreen";
import WithdrawalScreen from "../screens/Home/WithdrawalScreen";
// import AccessTokenRefreshModalScreen from "../screens/Modal/AccessTokenRefreshModalScreen";

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="LoginScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen
        name="SignupIdentityVerificationScreen"
        component={SignupIdentityVerificationScreen}
      />
      <Stack.Screen
        name="SignupInformationScreen"
        component={SignupInformationScreen}
      />
      <Stack.Screen
        name="SignupInformationEmailScreen"
        component={SignupInformationEmailScreen}
      />

      <Stack.Screen
        name="SignupCompleteScreen"
        component={SignupCompleteScreen}
      />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen
        name="AccountOverviewScreen"
        component={AccountOverviewScreen}
      />
      <Stack.Screen
        name="AccountDetailScreen"
        component={AccountDetailScreen}
      />
      <Stack.Screen
        name="TransferScreen"
        component={TransferScreen}
      ></Stack.Screen>
      <Stack.Screen
        name="TransferAmountScreen"
        component={TransferAmountScreen}
      ></Stack.Screen>
      <Stack.Screen
        name="TransferDetailScreen"
        component={TransferDetailScreen}
      ></Stack.Screen>
      <Stack.Screen
        name="TransferCompleteScreen"
        component={TransferCompleteScreen}
      ></Stack.Screen>
      <Stack.Screen
        name="AccountSetupScreen"
        component={AccountSetupScreen}
      ></Stack.Screen>
      <Stack.Screen
        name="AccountConfigurationScreen"
        component={AccountConfigurationScreen}
      ></Stack.Screen>
      <Stack.Screen
        name="AccountRestrictionScreen"
        component={AccountRestrictionScreen}
      ></Stack.Screen>
      <Stack.Screen
        name="OpenAccountCompleteScreen"
        component={OpenAccountCompleteScreen}
      ></Stack.Screen>
      <Stack.Screen
        name="AccountWhatMakeScreen"
        component={AccountWhatMakeScreen}
      ></Stack.Screen>
      <Stack.Screen
        name="AccountManagementScreen"
        component={AccountManagementScreen}
      ></Stack.Screen>
      <Stack.Screen
        name="TransactionDetailScreen"
        component={TransactionDetailScreen}
      ></Stack.Screen>
      <Stack.Screen
        name="FindIDScreen"
        component={FindIDScreen}
      ></Stack.Screen>
      <Stack.Screen
        name="ResetPasswordOneScreen"
        component={ResetPasswordOneScreen}
      ></Stack.Screen>
      <Stack.Screen
        name="ResetPasswordTwoScreen"
        component={ResetPasswordTwoScreen}
      ></Stack.Screen>
      <Stack.Screen
        name="FindIDSucceessScreen"
        component={FindIDSucceessScreen}
      ></Stack.Screen>
      <Stack.Screen
        name="ResetPasswordSucceessScreen"
        component={ResetPasswordSucceessScreen}
      ></Stack.Screen>
      <Stack.Screen
        name="ChangePasswordSucceessScreen"
        component={ChangePasswordSucceessScreen}
      ></Stack.Screen>
      <Stack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
      ></Stack.Screen>
      <Stack.Screen
        name="WithdrawalScreen"
        component={WithdrawalScreen}
      ></Stack.Screen>
      <Stack.Screen
        name="AccountResetPasswordOneScreen"
        component={AccountResetPasswordOneScreen}
      ></Stack.Screen>
      <Stack.Screen
        name="AccountResetPasswordTwoScreen"
        component={AccountResetPasswordTwoScreen}
      ></Stack.Screen>
      <Stack.Screen
        name="AccountResetPasswordSucceessScreen"
        component={AccountResetPasswordSucceessScreen}
      ></Stack.Screen>
      <Stack.Screen
        name="AccountWithdrawalScreen"
        component={AccountWithdrawalScreen}
      ></Stack.Screen>
      {/* <Stack.Screen
        name="AccessTokenRefreshModalScreen"
        component={AccessTokenRefreshModalScreen}
      ></Stack.Screen> */}
      <Stack.Screen
        name="ExamScreen"
        component={ExamScreen}
      ></Stack.Screen>
      <Stack.Screen name="MyPageScreen" component={MyPageScreen}></Stack.Screen>
    </Stack.Navigator>
  );
}

export default AppNavigator;

import React from 'react';
import IconMa from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';

import Dashboard from '~/pages/Dashboard';
import ProvideAdmin from '~/pages/DashboardAdmin';
import FilaUser from '~/pages/Fila/FilaUser';
import SelectProviderFila from '~/pages/Fila/SelectProvider';
import Confirm from '~/pages/New/Confirm';
import SelectDateTime from '~/pages/New/SelectDateTime';
import SelectProvider from '~/pages/New/SelectProvider';
import Profile from '~/pages/Profile';
import ResetPassword from '~/pages/RecuperaPassword';
import RegulationReview from '~/pages/RegulationRaview';
import SignIn from '~/pages/SignIn';
import SignUp from '~/pages/SignUp';

function getInitialRoute(isSigned, acceped_regulation) {
  if (isSigned) {
    if (acceped_regulation) {
      return 'App';
    }
    return 'RegulationReview';
  }
  return 'Sign';
}

export default (isSigned = false, provider, acceped_regulation) =>
  createAppContainer(
    createSwitchNavigator(
      {
        Sign: createSwitchNavigator({SignIn, SignUp, ResetPassword}),
        RegulationReview: createSwitchNavigator({RegulationReview}),
        App: createBottomTabNavigator(
          provider
            ? {ProvideAdmin}
            : {
                Dashboard,
                New: {
                  screen: createStackNavigator(
                    {
                      SelectProvider,
                      SelectDateTime,
                      Confirm,
                    },
                    {
                      defaultNavigationOptions: {
                        headerTransparent: true,
                        headerTintColor: '#FFF',
                        headerLeftContainerStyle: {
                          marginLeft: 20,
                        },
                      },
                    }
                  ),
                  navigationOptions: {
                    tabBarVisible: false,
                    tabBarLabel: 'Agendar',
                    tabBarIcon: (
                      <Icon
                        name="add-circle-outline"
                        size={20}
                        color="rgba(255, 255, 255, 0.6)"
                      />
                    ),
                  },
                },
                Fila: {
                  screen: createStackNavigator(
                    {
                      SelectProviderFila,
                      FilaUser,
                    },
                    {
                      defaultNavigationOptions: {
                        headerTransparent: true,
                        headerTintColor: '#FFF',
                        headerLeftContainerStyle: {
                          marginLeft: 20,
                        },
                      },
                    }
                  ),
                  navigationOptions: {
                    tabBarVisible: false,
                    tabBarLabel: 'Fila',
                    tabBarIcon: (
                      <IconMa
                        name="hail"
                        size={20}
                        color="rgba(255, 255, 255, 0.6)"
                      />
                    ),
                  },
                },
                Profile,
              },
          {
            resetOnBlur: true,
            tabBarOptions: {
              keyboardHidesTabBar: true,
              activeTintColor: '#FFF',
              inactiveTintColor: 'rgba(255, 255, 255, 0.6)',
              style: {backgroundColor: '#8d41aB'},
            },
          }
        ),
      },
      {
        initialRouteName: getInitialRoute(isSigned, acceped_regulation),
      },
      {
        headerLayoutPreset: 'center',
        headerBackTitleVisible: false,
        defaultNavigationOptions: {
          headerStyle: {
            backgroundColor: '#7159c1',
          },
          headerTintColor: '#FFF',
        },
      }
    )
  );

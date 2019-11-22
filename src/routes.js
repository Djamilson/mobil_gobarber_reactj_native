import React from 'react';

import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';

import Icon from 'react-native-vector-icons/MaterialIcons';
import IconMa from 'react-native-vector-icons/MaterialCommunityIcons';

import SignIn from '~/pages/SignIn';
import SignUp from '~/pages/SignUp';
import ResetPassword from '~/pages/RecuperaPassword';
import Dashboard from '~/pages/Dashboard';
import ProvideAdmin from '~/pages/DashboardAdmin';
import Profile from '~/pages/Profile';
// import Fila from '~/pages/Fila';

import SelectProvider from '~/pages/New/SelectProvider';
import SelectDateTime from '~/pages/New/SelectDateTime';
import Confirm from '~/pages/New/Confirm';

import SelectProviderFila from '~/pages/Fila/SelectProvider';
import FilaUser from '~/pages/Fila/FilaUser';

export default (isSigned = false, provider) =>
  createAppContainer(
    createSwitchNavigator(
      {
        Sign: createSwitchNavigator({SignIn, SignUp, ResetPassword}),
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
                Profile,
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
        initialRouteName: isSigned ? 'App' : 'Sign',
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

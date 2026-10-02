import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  TasksTab: undefined;
  MapTab: undefined;
  HistoryTab: undefined;
  SettingsTab: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  TaskDetail: { taskId: string };
  CreateEditTask: { taskId?: string };
};

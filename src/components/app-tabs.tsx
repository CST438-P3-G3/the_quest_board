import { NativeTabs } from 'expo-router/native-tabs';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{
        selected: {
          color: colors.text,
        },
      }}
    >
      {/* Home tab */}
      <NativeTabs.Trigger name="home">
        <NativeTabs.Trigger.Label>
          Home
        </NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/home.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      {/* Organizations tab */}
      <NativeTabs.Trigger name="orgs">
        <NativeTabs.Trigger.Label>
          Orgs
        </NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          sf="building.2"
          md="groups"
        />
      </NativeTabs.Trigger>

      {/* Profile tab */}
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>
          Profile
        </NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          sf="person.crop.circle"
          md="person"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

import { metaObject } from '@/config/site.config';
import ManagementSettingsView from '@/app/shared/account-settings/management-settings';

export const metadata = {
  ...metaObject('Management'),
};

export default function IntegrationSettingsFormPage() {
  return <ManagementSettingsView />;
}

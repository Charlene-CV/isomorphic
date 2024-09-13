import { metaObject } from '@/config/site.config';
import AccountingSettingsView from '@/app/shared/account-settings/accounting-settings';

export const metadata = {
  ...metaObject('Accounting'),
};

export default function IntegrationSettingsFormPage() {
  return <AccountingSettingsView />;
}

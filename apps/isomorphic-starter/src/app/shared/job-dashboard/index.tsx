import ActiveUsers from './active-users';
import AllJobsTable from './alljobs-table';
import ShipmentListTable from '../logistics/shipment/list/table';
import DeviceAnalytics from './device-analytics';
import JobOverview from './job-overview';
import JobStats from './job-stats';
import OpenJobOverview from './open-job-status';
import JobScheduleList from './schedule-list';
import TopReferrers from './top-referrers';

export default function JobDashboard() {
  return (
    <div className="flex flex-col gap-10">
      <ShipmentListTable />
    </div>
  );
}

'use client';

import { Button } from 'rizzui';
import LoggedInDevices from '@/app/shared/account-settings/logged-in-devices/table';
import HorizontalFormBlockWrapper from '@/app/shared/account-settings/horiozontal-block';
import AddTeamMemberModalView from '@/app/shared/account-settings/modal/add-team-member';
import { useModal } from '@/app/shared/modal-views/use-modal';
import { PiPlusBold } from 'react-icons/pi';
import { loggedInDeviceData } from '@/data/logged-in-device';

export default function TeamSettingsView() {
  const { openModal } = useModal();
  return (
    <div className="@container">
      <HorizontalFormBlockWrapper
        childrenWrapperClassName="gap-0 @lg:gap-0"
        title="Teams"
        description="Manage your teams & user permissions."
        titleClassName="text-xl font-semibold"
      >
        <div className="col-span-2 flex justify-end gap-4">
          <Button
            type="button"
            onClick={() =>
              openModal({
                view: <AddTeamMemberModalView />,
              })
            }
            className="bg-[#a5a234]"
          >
            <PiPlusBold className="me-1.5 h-4 w-4" />
            Add Member
          </Button>
        </div>
      </HorizontalFormBlockWrapper>

      {/* <HorizontalFormBlockWrapper
        className="pb-0 sm:pb-10"
        childrenWrapperClassName="gap-0 @lg:gap-0"
        title="On Teams"
        description="You’re currently on these teams."
      >
        {currentActiveTeams.map((currentTeam, index) => {
          return (
            <div
              key={`team-${index}`}
              className="col-span-2 flex items-center gap-3 border-b border-muted py-6 last:border-none"
            >
              <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-muted">
                {currentTeam.icon}
              </div>
              <div className="flex flex-grow flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Title as="h3" className="mb-1 text-sm font-semibold">
                    {currentTeam.name}
                  </Title>
                  <Link
                    href={currentTeam.url}
                    className="truncate text-sm text-gray-500 transition-colors hover:text-gray-900"
                  >
                    {currentTeam.url}
                  </Link>
                </div>
                <Button
                  type="button"
                  variant="text"
                  className="w-auto flex-shrink-0 justify-start p-0 text-sm font-semibold text-gray-900 sm:justify-center"
                >
                  Leave
                </Button>
              </div>
            </div>
          );
        })}
      </HorizontalFormBlockWrapper> */}

      <HorizontalFormBlockWrapper
        childrenWrapperClassName="gap-0 @lg:gap-0"
        title="My Team"
        className="border-0 pb-0"
      >
        <LoggedInDevices
          data={loggedInDeviceData}
          className="@xs:col-span-full"
        />
      </HorizontalFormBlockWrapper>
    </div>
  );
}

interface IconProps extends React.SVGProps<SVGSVGElement> {
  iconOnly?: boolean;
}

export default function Logo({ iconOnly = false, ...props }: IconProps) {
  return (
    <div>
      {!iconOnly && (
        <img
          src="https://roserocket.com/api/v1/orgs/0ca800f3-a890-4a1b-82be-2a98a9228ebb/org_logo"
          alt="Site Logo"
          style={{ minHeight: '100px', minWidth: '200px' }}
        />
      )}
    </div>
  );
}

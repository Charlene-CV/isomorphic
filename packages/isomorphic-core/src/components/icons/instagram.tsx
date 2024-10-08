export default function InstagramIcon({ ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <g clipPath="url(#instagram_a)">
        <path
          fill="url(#instagram_b)"
          d="M23.93 7.05a8.81 8.81 0 0 0-.56-2.91c-.3-.8-.77-1.53-1.38-2.13A5.88 5.88 0 0 0 19.86.63a8.8 8.8 0 0 0-2.91-.56A84.81 84.81 0 0 0 12 0C8.74 0 8.33.01 7.05.07a8.81 8.81 0 0 0-2.91.56c-.8.3-1.53.77-2.13 1.38A5.88 5.88 0 0 0 .63 4.14a8.8 8.8 0 0 0-.56 2.91A84.82 84.82 0 0 0 0 12c0 3.26.01 3.67.07 4.95a8.8 8.8 0 0 0 .56 2.91c.3.8.77 1.53 1.38 2.13.6.6 1.33 1.08 2.13 1.38.76.3 1.64.5 2.91.56 1.28.06 1.7.07 4.95.07 3.26 0 3.67-.01 4.95-.07a8.8 8.8 0 0 0 2.91-.56 6.14 6.14 0 0 0 3.51-3.51c.3-.76.5-1.64.56-2.91.06-1.28.07-1.7.07-4.95 0-3.26-.01-3.67-.07-4.95Zm-2.16 9.8a6.64 6.64 0 0 1-.42 2.23 3.97 3.97 0 0 1-2.27 2.27c-.43.17-1.06.36-2.23.42a83.1 83.1 0 0 1-4.85.07c-3.2 0-3.58-.01-4.85-.07a6.64 6.64 0 0 1-2.23-.42c-.52-.19-.99-.5-1.38-.9-.4-.38-.7-.85-.9-1.37a6.64 6.64 0 0 1-.4-2.23A83.34 83.34 0 0 1 2.15 12c0-3.2.01-3.58.07-4.85.06-1.17.25-1.8.42-2.23.19-.52.5-.99.9-1.38.38-.4.85-.7 1.37-.9a6.64 6.64 0 0 1 2.23-.4c1.27-.07 1.65-.08 4.85-.08 3.2 0 3.58.01 4.85.07 1.17.06 1.8.25 2.23.42.52.19.99.5 1.38.9.4.38.7.85.9 1.37.16.43.35 1.06.4 2.23.07 1.27.08 1.65.08 4.85 0 3.2-.01 3.58-.07 4.85Z"
        />
        <path
          fill="url(#instagram_c)"
          d="M12 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"
        />
        <path
          fill="url(#instagram_d)"
          d="M19.85 5.6a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z"
        />
      </g>
      <defs>
        <linearGradient
          id="instagram_b"
          x1="2.01"
          x2="21.99"
          y1="21.99"
          y2="2.01"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFD600" />
          <stop
            offset=".5"
            stopColor="#FF0100"
          />
          <stop
            offset="1"
            stopColor="#D800B9"
          />
        </linearGradient>
        <linearGradient
          id="instagram_c"
          x1="7.64"
          x2="16.36"
          y1="16.36"
          y2="7.64"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF6400" />
          <stop
            offset=".5"
            stopColor="#FF0100"
          />
          <stop
            offset="1"
            stopColor="#FD0056"
          />
        </linearGradient>
        <linearGradient
          id="instagram_d"
          x1="17.39"
          x2="19.43"
          y1="6.61"
          y2="4.58"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F30072" />
          <stop
            offset="1"
            stopColor="#E50097"
          />
        </linearGradient>
        <clipPath id="instagram_a">
          <path
            fill="#fff"
            d="M0 0h24v24H0z"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

import React from "react";

interface AssetProps {
  size: number;
  fill: string;
}

export const AssetSpike: React.FC<AssetProps> = ({
  size = 16,
  fill = "#251E40",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.29912 1.11208L5.33333 16L7.36755 1.11208C7.57014 -0.370694 8.42986 -0.370694 8.63246 1.11208L10.6667 16L12.7009 1.11208C12.9035 -0.370694 13.7632 -0.370694 13.9658 1.11208L16 16H10.6667H5.33333H0L2.03421 1.11208C2.23681 -0.370694 3.09652 -0.370694 3.29912 1.11208Z"
        fill={fill}
      />
    </svg>
  );
};

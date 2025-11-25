export interface DotSvgProps {
  dotSize?: number;
}

export const DotSvg: React.FC<DotSvgProps> = ({
  dotSize = 8,
}) => {
  
  return (
    <svg width={dotSize} height={dotSize}>
      <circle
        r={dotSize/2}
        cx={dotSize/2}
        cy={dotSize/2}
        fill="black"
      />
    </svg>
  );
};

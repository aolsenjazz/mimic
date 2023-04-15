type PropTypes = {
  shape: string;
};

export default function Pad(props: PropTypes) {
  const { shape } = props;

  return (
    <div
      className="pad interactive-indicator"
      style={{
        borderRadius: shape === 'circle' ? '100%' : 0,
      }}
    />
  );
}

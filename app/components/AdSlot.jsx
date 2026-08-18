export default function AdSlot({ size = "medium" }) {
  return (
    <div className={`ad-slot ad-${size}`}>
      <span>REKLAM</span>
    </div>
  );
}
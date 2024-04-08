const NetworkBadge = ({ network, className }) => {
  const channels = {
    "optimism-sepolia": "OP",
    "base-sepolia": "BASE",
    "molten-magma": "MOLTEN",
  };

  return (
    <span
      className={`badge-${channels[
        network
      ].toLowerCase()} self-center absolute right-2 lg:static ${
        className ? className : ""
      }`}
    >
      {channels[network]}
    </span>
  );
};

export default NetworkBadge;

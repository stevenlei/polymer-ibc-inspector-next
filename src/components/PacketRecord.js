const Packet = ({ channel }) => (
  <div className="bg-white rounded-lg overflow-hidden ring-1 ring-slate-200">
    <div>
      <h4 className="flex flex-wrap lg:flex-nowrap justify-between items-center bg-slate-600 text-white px-3 py-2 w-full">
        <span className="flex items-center gap-x-2 flex-wrap lg:flex-nowrap flex-1">
          <div className="block md:flex relative items-center gap-x-2 w-full md:w-auto justify-between">
            <span
              className={`${
                channel.fromChannel.type === "UNIVERSAL"
                  ? "text-yellow-300"
                  : "text-blue-300"
              } bg-slate-800 text-slate-200 text-sm px-1 rounded`}
            >
              {channel.fromChannel.type === "UNIVERSAL"
                ? "Universal"
                : "Custom"}
            </span>
            <span className="w-full md:w-auto absolute md:static left-0 text-center">
              {channel.fromChannel.id}
            </span>
            <strong className="absolute md:static right-0 bg-slate-300 rounded px-1 text-sm text-slate-600">
              #{channel.sequence}
            </strong>
          </div>

          <span className="text-sm text-slate-400 w-full text-center md:w-auto md:text-left">
            <span className="hidden sm:inline">@ </span>
            {channel.states[0].timestamp &&
              new Date(channel.states[0].timestamp * 1000).toLocaleString()}
          </span>
        </span>
        <div className="flex gap-x-2 items-center w-full md:w-auto justify-center text-xs md:text-sm lg:text-base text-slate-200">
          {channel.fromChain.id}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 inline-block"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
            />
          </svg>
          {channel.toChain.id}
        </div>
      </h4>
      <ul>
        <li className="px-3 py-2 flex gap-x-2 items-center justify-between bg-slate-100 flex-wrap lg:flex-nowrap relative space-y-2 lg:space-y-0">
          <div className="flex gap-x-8 items-center flex-wrap lg:flex-nowrap space-y-2 lg:space-y-0">
            <span className="w-36 text-center bg-blue-200 text-blue-600 text-sm px-2 py-1 rounded self-center">
              SendPacket
            </span>
            {channel.states[0] ? (
              <>
                <div className="flex flex-col text-xs w-full lg:w-auto">
                  <span className="text-slate-500">sourcePort</span>
                  <span className="font-mono text-blue-600">
                    <a
                      href={explorerUrl(channel.states[0], "address")}
                      target="_blank"
                    >
                      {channel.states[0].portAddress}
                    </a>
                  </span>
                </div>
                <div className="flex flex-col text-xs w-full lg:w-auto">
                  <span className="text-slate-500">Timeout</span>
                  <span className="font-mono text-slate-800">
                    {new Date(channel.timeout * 1000).toLocaleString()}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex flex-col text-xs w-full lg:w-auto">
                <svg
                  className="animate-spin h-5 w-5 text-slate-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            )}
          </div>
          <div className="flex lg:space-x-8 flex-wrap lg:flex-nowrap w-full lg:w-auto space-y-2 lg:space-y-0">
            {channel.states[0] && (
              <>
                <div className="flex flex-col text-xs w-32 w-full lg:w-auto">
                  <span className="text-slate-500">Data</span>
                  <span className="font-mono text-slate-800">
                    (Coming Soon)
                  </span>
                </div>
                <div className="flex flex-col text-xs w-20 w-full lg:w-auto">
                  <span className="text-slate-500">Block</span>
                  <span className="font-mono text-slate-800">
                    <a href={explorerUrl(channel.states[0], "block")}>
                      {channel.states[0].block.number}
                    </a>
                  </span>
                </div>
                <div className="flex flex-col text-xs w-20 w-full lg:w-auto">
                  <span className="text-slate-500">Tx</span>
                  <span className="font-mono text-slate-800">
                    <a
                      href={explorerUrl(channel.states[0], "tx")}
                      target="_blank"
                    >
                      {shorten(channel.states[0].txHash)}
                    </a>
                  </span>
                </div>
              </>
            )}
            {channel.fromChain.id === "optimism-sepolia" ? (
              <span
                className={`badge-op self-center absolute ${
                  channel.states[0] ? "top-0" : "top-2"
                } right-2 lg:static`}
              >
                OP
              </span>
            ) : (
              <span
                className={`badge-base self-center absolute ${
                  channel.states[0] ? "top-0" : "top-2"
                } right-2 lg:static`}
              >
                BASE
              </span>
            )}
          </div>
        </li>
        <li className="px-3 py-2 flex gap-x-2 items-center justify-between flex-wrap lg:flex-nowrap relative space-y-2 lg:space-y-0">
          <div className="flex gap-x-8 items-center flex-wrap lg:flex-nowrap space-y-2 lg:space-y-0">
            <span className="w-36 text-center bg-yellow-300 text-yellow-700 text-sm px-2 py-1 rounded self-center">
              RecvPacket
            </span>
            {channel.states[1] ? (
              <>
                <div className="flex flex-col text-xs w-full lg:w-auto">
                  <span className="text-slate-500">destPort</span>
                  <span className="font-mono text-blue-600">
                    <a
                      href={explorerUrl(channel.states[1], "address")}
                      target="_blank"
                    >
                      {channel.states[1].portAddress}
                    </a>
                  </span>
                </div>
              </>
            ) : (
              <div className="flex flex-col text-xs w-full lg:w-auto">
                <svg
                  className="animate-spin h-5 w-5 text-slate-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            )}
          </div>
          <div className="flex lg:space-x-8 flex-wrap lg:flex-nowrap w-full lg:w-auto space-y-2 lg:space-y-0">
            {channel.states[1] && (
              <>
                <div className="flex flex-col text-xs w-32 w-full lg:w-auto">
                  <span className="text-slate-500">Arrival</span>
                  {channel.states[1] && channel.states[0] && (
                    <span className="font-mono text-slate-800">
                      + {channel.states[1].latency} seconds
                    </span>
                  )}
                </div>
                <div className="flex flex-col text-xs w-20 w-full lg:w-auto">
                  <span className="text-slate-500">Block</span>
                  <span className="font-mono text-slate-800">
                    <a href={explorerUrl(channel.states[1], "block")}>
                      {channel.states[1].block.number}
                    </a>
                  </span>
                </div>
                <div className="flex flex-col text-xs w-20 w-full lg:w-auto">
                  <span className="text-slate-500">Tx</span>
                  <span className="font-mono text-slate-800">
                    <a
                      href={explorerUrl(channel.states[1], "tx")}
                      target="_blank"
                    >
                      {shorten(channel.states[1].txHash)}
                    </a>
                  </span>
                </div>
              </>
            )}
            {channel.toChannel.id === "optimism-sepolia" ? (
              <span
                className={`badge-op self-center absolute ${
                  channel.states[1] ? "top-0" : "top-2"
                } right-2 lg:static`}
              >
                OP
              </span>
            ) : (
              <span
                className={`badge-base self-center absolute ${
                  channel.states[1] ? "top-0" : "top-2"
                } right-2 lg:static`}
              >
                BASE
              </span>
            )}
          </div>
        </li>
        <li className="px-3 py-2 flex gap-x-2 items-center justify-between bg-slate-100 flex-wrap lg:flex-nowrap relative space-y-2 lg:space-y-0">
          <div className="flex gap-x-8 items-center flex-wrap lg:flex-nowrap space-y-2 lg:space-y-0">
            <span className="w-36 text-center bg-gray-300 text-gray-600 text-sm px-2 py-1 rounded self-center">
              WriteAckPacket
            </span>
            {channel.states[2] ? (
              <div className="flex flex-col text-xs w-full lg:w-auto">
                <span className="text-slate-500">writerPort</span>
                <span className="font-mono text-blue-600">
                  <a
                    href={explorerUrl(channel.states[2], "address")}
                    target="_blank"
                  >
                    {channel.states[2].portAddress}
                  </a>
                </span>
              </div>
            ) : (
              <div className="flex flex-col text-xs w-full lg:w-auto">
                <svg
                  className="animate-spin h-5 w-5 text-slate-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            )}
          </div>
          <div className="flex lg:space-x-8 flex-wrap lg:flex-nowrap w-full lg:w-auto space-y-2 lg:space-y-0">
            {channel.states[2] && (
              <>
                <div className="flex flex-col text-xs w-32 w-full lg:w-auto">
                  <span className="text-slate-500">Arrival</span>
                  {channel.states[2] && channel.states[1] && (
                    <span className="font-mono text-slate-800">
                      + {channel.states[2].latency} seconds
                    </span>
                  )}
                </div>
                <div className="flex flex-col text-xs w-20 w-full lg:w-auto">
                  <span className="text-slate-500">Block</span>
                  <span className="font-mono text-slate-800">
                    <a href={explorerUrl(channel.states[2], "block")}>
                      {channel.states[2].block.number}
                    </a>
                  </span>
                </div>
                <div className="flex flex-col text-xs w-20 w-full lg:w-auto">
                  <span className="text-slate-500">Tx</span>
                  <span className="font-mono text-slate-800">
                    <a
                      href={explorerUrl(channel.states[2], "tx")}
                      target="_blank"
                    >
                      {shorten(channel.states[2].txHash)}
                    </a>
                  </span>
                </div>
              </>
            )}
            {channel.toChannel.id === "optimism-sepolia" ? (
              <span
                className={`badge-op self-center absolute ${
                  channel.states[2] ? "top-0" : "top-2"
                } right-2 lg:static`}
              >
                OP
              </span>
            ) : (
              <span
                className={`badge-base self-center absolute ${
                  channel.states[2] ? "top-0" : "top-2"
                } right-2 lg:static`}
              >
                BASE
              </span>
            )}
          </div>
        </li>
        <li className="px-3 py-2 flex gap-x-2 items-center justify-between flex-wrap lg:flex-nowrap relative space-y-2 lg:space-y-0">
          <div className="flex gap-x-8 items-center flex-wrap lg:flex-nowrap space-y-2 lg:space-y-0">
            <span className="w-36 text-center bg-green-300 text-green-700 text-sm px-2 py-1 rounded self-center">
              Acknowledgement
            </span>
            {channel.states[3] ? (
              <>
                <div className="flex flex-col text-xs w-full lg:w-auto">
                  <span className="text-slate-500">sourcePort</span>
                  <span className="font-mono text-blue-600">
                    <a
                      href={explorerUrl(channel.states[3], "address")}
                      target="_blank"
                    >
                      {channel.states[3].portAddress}
                    </a>
                  </span>
                </div>
              </>
            ) : (
              <div className="flex flex-col text-xs w-full lg:w-auto">
                <svg
                  className="animate-spin h-5 w-5 text-slate-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            )}
          </div>
          <div className="flex lg:space-x-8 flex-wrap lg:flex-nowrap w-full lg:w-auto space-y-2 lg:space-y-0">
            {channel.states[3] && (
              <>
                <div className="flex flex-col text-xs w-32 w-full lg:w-auto">
                  <span className="text-slate-500">Arrival</span>
                  {channel.states[3] && channel.states[2] && (
                    <span className="font-mono text-slate-800">
                      + {channel.states[3].latency} seconds
                    </span>
                  )}
                </div>
                <div className="flex flex-col text-xs w-20 w-full lg:w-auto">
                  <span className="text-slate-500">Block</span>
                  <span className="font-mono text-slate-800">
                    <a href={explorerUrl(channel.states[3], "block")}>
                      {channel.states[3].block.number}
                    </a>
                  </span>
                </div>
                <div className="flex flex-col text-xs w-20 w-full lg:w-auto">
                  <span className="text-slate-500">Tx</span>
                  <span className="font-mono text-slate-800">
                    <a
                      href={explorerUrl(channel.states[3], "tx")}
                      target="_blank"
                    >
                      {shorten(channel.states[3].txHash)}
                    </a>
                  </span>
                </div>
              </>
            )}
            {channel.fromChannel.id === "optimism-sepolia" ? (
              <span
                className={`badge-op self-center absolute ${
                  channel.states[3] ? "top-0" : "top-2"
                } right-2 lg:static`}
              >
                OP
              </span>
            ) : (
              <span
                className={`badge-base self-center absolute ${
                  channel.states[3] ? "top-0" : "top-2"
                } right-2 lg:static`}
              >
                BASE
              </span>
            )}
          </div>
        </li>
      </ul>
    </div>
  </div>
);

const explorerUrl = (packet, type) => {
  if (packet.op) {
    if (type === "tx") {
      return `https://optimism-sepolia.blockscout.com/tx/${packet.tx}`;
    } else if (type === "address") {
      return `https://optimism-sepolia.blockscout.com/address/${packet.tx}`;
    } else if (type === "block") {
      return `https://optimism-sepolia.blockscout.com/block/${packet.tx}`;
    }
  } else if (packet.base) {
    if (type === "tx") {
      return `https://base-sepolia.blockscout.com/tx/${packet.tx}`;
    } else if (type === "address") {
      return `https://base-sepolia.blockscout.com/address/${packet.tx}`;
    } else if (type === "block") {
      return `https://base-sepolia.blockscout.com/block/${packet.tx}`;
    }
  }
};

const shorten = (str) => {
  return str.slice(0, 6) + "..." + str.slice(-4);
};

export default Packet;

import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import { io } from "socket.io-client";
import Head from "next/head";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    //
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);

    socket.on("packet", (packet) => {
      // console.log(packet);

      if (packet.type === "SendPacket") {
        setData((prev) => {
          return [
            {
              channel: [
                "channel-10",
                "channel-11",
                "channel-16",
                "channel-17",
              ].includes(packet.sourceChainId)
                ? "universal"
                : "custom",
              id: packet.sourceChainId,
              sequence: packet.sequence,
              from: packet.op ? "optimism-sepolia" : "base-sepolia",
              to: packet.op ? "base-sepolia" : "optimism-sepolia",
              states: [packet, null, null, null],
            },
            ...prev,
          ];
        });
      } else if (packet.type === "RecvPacket") {
        setData((prev) => {
          const integerChannelId = Number(
            packet.destChainId.replace("channel-", "")
          );
          const integerChainId = Number(
            packet.destChainId.replace("channel-", "")
          );

          const potentialMatch =
            integerChannelId === integerChainId ||
            integerChannelId + 1 === integerChainId ||
            integerChannelId - 1 === integerChainId;

          return prev.map((channel) => {
            if (potentialMatch && channel.sequence === packet.sequence) {
              channel.states[1] = packet;
            }
            return channel;
          });
        });
      } else if (packet.type === "WriteAckPacket") {
        setData((prev) => {
          const integerChannelId = Number(
            packet.writerChainId.replace("channel-", "")
          );
          const integerChainId = Number(
            packet.writerChainId.replace("channel-", "")
          );

          const potentialMatch =
            integerChannelId === integerChainId ||
            integerChannelId + 1 === integerChainId ||
            integerChannelId - 1 === integerChainId;

          return prev.map((channel) => {
            if (potentialMatch && channel.sequence === packet.sequence) {
              channel.states[2] = packet;
            }
            return channel;
          });
        });
      } else if (packet.type === "Acknowledgement") {
        setData((prev) => {
          const integerChannelId = Number(
            packet.sourceChainId.replace("channel-", "")
          );
          const integerChainId = Number(
            packet.sourceChainId.replace("channel-", "")
          );

          const potentialMatch =
            integerChannelId === integerChainId ||
            integerChannelId + 1 === integerChainId ||
            integerChannelId - 1 === integerChainId;

          return prev.map((channel) => {
            if (potentialMatch && channel.sequence === packet.sequence) {
              channel.states[3] = packet;
            }

            return channel;
          });
        });
      }

      // setData((prev) => {
      //   // chainId += 1 can be the companion chain

      //   if (packet.type === "SendPacket") {
      //     // Create a new channel
      //     return [
      //       {
      //         channel: [
      //           "channel-10",
      //           "channel-11",
      //           "channel-16",
      //           "channel-17",
      //         ].includes(packet.sourceChainId)
      //           ? "universal"
      //           : "custom",
      //         id: packet.sourceChainId,
      //         sequence: packet.sequence,
      //         from: packet.op ? "optimism-sepolia" : "base-sepolia",
      //         to: packet.op ? "base-sepolia" : "optimism-sepolia",
      //         states: [packet, null, null, null],
      //       },
      //       ...prev,
      //     ];
      //   } else if (packet.type === "RecvPacket") {
      //     // Update the channel

      //     const integerChannelId = Number(
      //       packet.destChainId.replace("channel-", "")
      //     );
      //     const integerChainId = Number(
      //       packet.destChainId.replace("channel-", "")
      //     );

      //     const potentialMatch =
      //       integerChannelId === integerChainId ||
      //       integerChannelId + 1 === integerChainId ||
      //       integerChannelId - 1 === integerChainId;

      //     return prev.map((channel) => {
      //       if (potentialMatch && channel.sequence === packet.sequence) {
      //         channel.states[1] = packet;
      //       }
      //       return channel;
      //     });
      //   } else if (packet.type === "WriteAckPacket") {
      //     const integerChannelId = Number(
      //       packet.writerChainId.replace("channel-", "")
      //     );
      //     const integerChainId = Number(
      //       packet.writerChainId.replace("channel-", "")
      //     );

      //     const potentialMatch =
      //       integerChannelId === integerChainId ||
      //       integerChannelId + 1 === integerChainId ||
      //       integerChannelId - 1 === integerChainId;

      //     // Update the channel
      //     return prev.map((channel) => {
      //       if (potentialMatch && channel.sequence === packet.sequence) {
      //         channel.states[2] = packet;
      //       }
      //       return channel;
      //     });
      //   } else if (packet.type === "Acknowledgement") {
      //     const integerChannelId = Number(
      //       packet.sourceChainId.replace("channel-", "")
      //     );
      //     const integerChainId = Number(
      //       packet.sourceChainId.replace("channel-", "")
      //     );

      //     const potentialMatch =
      //       integerChannelId === integerChainId ||
      //       integerChannelId + 1 === integerChainId ||
      //       integerChannelId - 1 === integerChainId;

      //     // Update the channel
      //     return prev.map((channel) => {
      //       if (potentialMatch && channel.sequence === packet.sequence) {
      //         channel.states[3] = packet;
      //       }

      //       return channel;
      //     });
      //   }
      // });
    });
  }, []);

  const shorten = (str) => {
    return str.slice(0, 6) + "..." + str.slice(-4);
  };

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

  return (
    <main className={`p-12 ${inter.className} min-h-screen bg-slate-200`}>
      <Head>
        <title>Polymer IBC Inspector</title>
      </Head>

      <Script src="https://www.googletagmanager.com/gtag/js?id=G-HCMGB8T4Q3" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-HCMGB8T4Q3');
        `}
      </Script>

      <header className="flex justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          Polymer IBC Inspector
          <span className="text-sm font-normal ml-2 text-slate-400">
            v0.1 (MVP)
          </span>
        </h1>
        <a
          href="https://x.com/stevenkin"
          className="flex text-sm mr-2 pl-4 opacity-90 hover:opacity-100"
          target="_blank"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-8 h-8 fill-current text-slate-800"
          >
            <g>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </g>
          </svg>
        </a>
      </header>
      <div className="flex flex-col space-y-6 my-8">
        {data.map((channel, i) => (
          <div
            className="bg-white rounded-lg overflow-hidden ring-1 ring-slate-200"
            key={`${channel.id}-${channel.sequence}`}
          >
            <div className="overflow-x-auto">
              <h4 className="flex justify-between items-center bg-slate-600 text-white px-3 py-2">
                <span className="flex items-center gap-x-2">
                  <span
                    className={`${
                      channel.channel === "universal"
                        ? "text-yellow-300"
                        : "text-blue-300"
                    } bg-slate-800 text-slate-200 text-sm px-1 rounded`}
                  >
                    {channel.channel === "universal" ? "Universal" : "Custom"}
                  </span>
                  {channel.id}{" "}
                  <strong className="bg-slate-300 rounded px-1 text-sm text-slate-600">
                    #{channel.sequence}
                  </strong>
                  <span className="text-sm text-slate-400">
                    @{" "}
                    {channel.states[0].arrival &&
                      new Date(channel.states[0].arrival).toLocaleString()}
                  </span>
                </span>
                <div className="flex gap-x-2 items-center">
                  {channel.from}
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
                  {channel.to}
                </div>
              </h4>
              <ul>
                <li className="px-3 py-2 flex gap-x-2 items-center justify-between bg-slate-100">
                  <div className="flex gap-x-8 items-center">
                    <span className="w-36 text-center bg-blue-200 text-blue-600 text-sm px-2 py-1 rounded self-center">
                      SendPacket
                    </span>
                    {channel.states[0] ? (
                      <>
                        <div className="flex flex-col text-xs">
                          <span className="text-slate-500">sourcePort</span>
                          <span className="font-mono text-blue-600">
                            <a
                              href={explorerUrl(channel.states[0], "address")}
                              target="_blank"
                            >
                              {channel.states[0].sourcePort}
                            </a>
                          </span>
                        </div>
                        <div className="flex flex-col text-xs">
                          <span className="text-slate-500">Timeout</span>
                          <span className="font-mono text-slate-800">
                            {new Date(
                              channel.states[0].timeout * 1000
                            ).toLocaleString()}
                          </span>
                        </div>
                      </>
                    ) : (
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
                    )}
                  </div>
                  <div className="flex space-x-8">
                    {channel.states[0] && (
                      <>
                        <div className="flex flex-col text-xs w-32">
                          <span className="text-slate-500">Data</span>
                          <span className="font-mono text-slate-800">
                            (Coming Soon)
                          </span>
                        </div>
                        {/* <div className="flex flex-col text-xs w-32">
                          <span className="text-slate-500">Arrival</span>
                          <span className="font-mono text-slate-800">
                            + {channel.states[0].arrival} seconds
                          </span>
                        </div> */}
                        <div className="flex flex-col text-xs w-20">
                          <span className="text-slate-500">Block</span>
                          <span className="font-mono text-slate-800">
                            <a href={explorerUrl(channel.states[0], "block")}>
                              {channel.states[0].block}
                            </a>
                          </span>
                        </div>
                        <div className="flex flex-col text-xs w-20">
                          <span className="text-slate-500">Tx</span>
                          <span className="font-mono text-slate-800">
                            <a
                              href={explorerUrl(channel.states[0], "tx")}
                              target="_blank"
                            >
                              {shorten(channel.states[0].tx)}
                            </a>
                          </span>
                        </div>
                      </>
                    )}
                    {channel.from === "optimism-sepolia" ? (
                      <span className="badge-op self-center">OP</span>
                    ) : (
                      <span className="badge-base self-center">BASE</span>
                    )}
                  </div>
                </li>
                <li className="px-3 py-2 flex gap-x-2 items-center justify-between">
                  <div className="flex gap-x-8 items-center">
                    <span className="w-36 text-center bg-yellow-300 text-yellow-700 text-sm px-2 py-1 rounded self-center">
                      RecvPacket
                    </span>
                    {channel.states[1] ? (
                      <>
                        <div className="flex flex-col text-xs">
                          <span className="text-slate-500">destPort</span>
                          <span className="font-mono text-blue-600">
                            <a
                              href={explorerUrl(channel.states[1], "address")}
                              target="_blank"
                            >
                              {channel.states[1].destPort}
                            </a>
                          </span>
                        </div>
                      </>
                    ) : (
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
                    )}
                  </div>
                  <div className="flex space-x-8">
                    {channel.states[1] && (
                      <>
                        <div className="flex flex-col text-xs w-32">
                          <span className="text-slate-500">Arrival</span>
                          {channel.states[1] && channel.states[0] && (
                            <span className="font-mono text-slate-800">
                              +{" "}
                              {Math.round(
                                (channel.states[1].arrival -
                                  channel.states[0].arrival) /
                                  1000
                              )}{" "}
                              seconds
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col text-xs w-20">
                          <span className="text-slate-500">Block</span>
                          <span className="font-mono text-slate-800">
                            <a href={explorerUrl(channel.states[1], "block")}>
                              {channel.states[1].block}
                            </a>
                          </span>
                        </div>
                        <div className="flex flex-col text-xs w-20">
                          <span className="text-slate-500">Tx</span>
                          <span className="font-mono text-slate-800">
                            <a
                              href={explorerUrl(channel.states[1], "tx")}
                              target="_blank"
                            >
                              {shorten(channel.states[1].tx)}
                            </a>
                          </span>
                        </div>
                      </>
                    )}
                    {channel.from === "optimism-sepolia" ? (
                      <span className="badge-base self-center">BASE</span>
                    ) : (
                      <span className="badge-op self-center">OP</span>
                    )}
                  </div>
                </li>
                <li className="px-3 py-2 flex gap-x-2 items-center justify-between bg-slate-100">
                  <div className="flex gap-x-8 items-center">
                    <span className="w-36 text-center bg-gray-300 text-gray-600 text-sm px-2 py-1 rounded self-center">
                      WriteAckPacket
                    </span>
                    {channel.states[2] ? (
                      <div className="flex flex-col text-xs">
                        <span className="text-slate-500">writerPort</span>
                        <span className="font-mono text-blue-600">
                          <a
                            href={explorerUrl(channel.states[2], "address")}
                            target="_blank"
                          >
                            {channel.states[2].writerPort}
                          </a>
                        </span>
                      </div>
                    ) : (
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
                    )}
                  </div>
                  <div className="flex space-x-8">
                    {channel.states[2] && (
                      <>
                        <div className="flex flex-col text-xs w-32">
                          <span className="text-slate-500">Arrival</span>
                          {channel.states[2] && channel.states[1] && (
                            <span className="font-mono text-slate-800">
                              +{" "}
                              {Math.round(
                                (channel.states[2].arrival -
                                  channel.states[1].arrival) /
                                  1000
                              )}{" "}
                              seconds
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col text-xs w-20">
                          <span className="text-slate-500">Block</span>
                          <span className="font-mono text-slate-800">
                            <a href={explorerUrl(channel.states[2], "block")}>
                              {channel.states[2].block}
                            </a>
                          </span>
                        </div>
                        <div className="flex flex-col text-xs w-20">
                          <span className="text-slate-500">Tx</span>
                          <span className="font-mono text-slate-800">
                            <a
                              href={explorerUrl(channel.states[2], "tx")}
                              target="_blank"
                            >
                              {shorten(channel.states[2].tx)}
                            </a>
                          </span>
                        </div>
                      </>
                    )}
                    {channel.from === "optimism-sepolia" ? (
                      <span className="badge-base self-center">BASE</span>
                    ) : (
                      <span className="badge-op self-center">OP</span>
                    )}
                  </div>
                </li>
                <li className="px-3 py-2 flex gap-x-2 items-center justify-between">
                  <div className="flex gap-x-8 items-center">
                    <span className="w-36 text-center bg-green-300 text-green-700 text-sm px-2 py-1 rounded self-center">
                      Acknowledgement
                    </span>
                    {channel.states[3] ? (
                      <>
                        <div className="flex flex-col text-xs">
                          <span className="text-slate-500">sourcePort</span>
                          <span className="font-mono text-blue-600">
                            <a
                              href={explorerUrl(channel.states[3], "address")}
                              target="_blank"
                            >
                              {channel.states[3].sourcePort}
                            </a>
                          </span>
                        </div>
                      </>
                    ) : (
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
                    )}
                  </div>
                  <div className="flex space-x-8">
                    {channel.states[3] && (
                      <>
                        <div className="flex flex-col text-xs w-32">
                          <span className="text-slate-500">Arrival</span>
                          {channel.states[3] && channel.states[2] && (
                            <span className="font-mono text-slate-800">
                              +{" "}
                              {Math.round(
                                (channel.states[3].arrival -
                                  channel.states[2].arrival) /
                                  1000
                              )}{" "}
                              seconds
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col text-xs w-20">
                          <span className="text-slate-500">Block</span>
                          <span className="font-mono text-slate-800">
                            <a href={explorerUrl(channel.states[3], "block")}>
                              {channel.states[3].block}
                            </a>
                          </span>
                        </div>
                        <div className="flex flex-col text-xs w-20">
                          <span className="text-slate-500">Tx</span>
                          <span className="font-mono text-slate-800">
                            <a
                              href={explorerUrl(channel.states[3], "tx")}
                              target="_blank"
                            >
                              {shorten(channel.states[3].tx)}
                            </a>
                          </span>
                        </div>
                      </>
                    )}
                    {channel.from === "optimism-sepolia" ? (
                      <span className="badge-op self-center">OP</span>
                    ) : (
                      <span className="badge-base self-center">BASE</span>
                    )}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

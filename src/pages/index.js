import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Head from "next/head";
import Main from "../components/Main";
import Packet from "../components/Packet";
import Header from "../components/Header";

export default function Home() {
  const [data, setData] = useState([]);
  const socketRef = useRef();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    //
    setIsLoading(true);

    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL);

    socketRef.current.on("connect", () => {
      setIsLoading(false);
    });

    socketRef.current.on("packet", (packet) => {
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
    });

    return () => {
      // remove all listeners
      socketRef.current.off("packet");
      socketRef.current.disconnect();

      console.log("Socket Disconnected");
    };
  }, []);

  const shorten = (str) => {
    return str.slice(0, 6) + "..." + str.slice(-4);
  };

  return (
    <Main>
      <Head>
        <title>Polymer IBC Inspector</title>
      </Head>

      <Header page="Live" />

      {isLoading && (
        <div className="flex flex-col text-xs w-full lg:w-auto mt-4">
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

      <div className="flex flex-col space-y-6 my-4 md:my-8">
        {data.map((channel, i) => (
          <Packet channel={channel} key={`${channel.id}-${channel.sequence}`} />
        ))}
      </div>
    </Main>
  );
}

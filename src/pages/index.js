import { useState, useEffect, useRef } from "react";
import { Inter } from "next/font/google";
import { io } from "socket.io-client";
import Head from "next/head";
import Script from "next/script";
import Packet from "../components/Packet";
import Header from "../components/Header";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [data, setData] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    //
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL);

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

      <Header page="Live" />

      <div className="flex flex-col space-y-6 my-8">
        {data.map((channel, i) => (
          <Packet channel={channel} key={`${channel.id}-${channel.sequence}`} />
        ))}
      </div>
    </main>
  );
}

import { useState, useEffect, useRef } from "react";
import { Inter } from "next/font/google";
import Head from "next/head";
import Main from "../../components/Main";
import Packet from "../../components/PacketRecord";
import Header from "../../components/Header";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [tx, setTx] = useState("");
  const [data, setData] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      const { hash } = router.query;

      fetchPacket(hash);
      setTx(hash);
    }
  }, [router.isReady]);

  async function fetchPacket(tx) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query Packets {
            packet(
              tx: "${tx}"
            ) {
              id
              fromChain {
                id
                name
              }
              toChain {
                id
                name
              }
              fromChannel {
                id
                type
                client
              }
              toChannel {
                id
                type
                client
              }
              timeout
              timestamp
              sequence
              currentState
              states {
                id
                chain {
                  id
                  name
                }
                block {
                  number
                }
                type
                latency
                timestamp
                txHash
                portAddress
              }
            }
          }
        `,
      }),
    });
    const packet = await response.json();
    const data = packet.data.packet;

    if (data) {
      setData(packet.data.packet);
    } else {
      setNotFound(true);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchPackets();
    }
  };

  const shorten = (str) => {
    return str.slice(0, 6) + "..." + str.slice(-4);
  };

  return (
    <Main>
      <Head>
        <title>Polymer IBC Inspector - Packets</title>
      </Head>

      <Header page="Packets" />

      <div className="flex flex-col space-y-6 my-4 md:my-8">
        <div>
          <input
            type="text"
            placeholder="e.g. channel-10 or channel-10#123"
            className="w-full p-2 rounded outline-none bg-slate-100 text-slate-800 focus:ring-2 focus:ring-slate-300 text-sm md:text-base"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {data && (
          <>
            <div className="flex justify-between items-center text-slate-500 text-sm md:text-base">
              <p>
                Search result for transaction hash <strong>{tx}</strong>
              </p>
            </div>
            <Packet channel={data} tx={tx} />
          </>
        )}

        {notFound && (
          <p className="text-red-600 text-sm md:text-base">
            No packets found for transaction hash <strong>{tx}</strong>
          </p>
        )}
      </div>
    </Main>
  );
}

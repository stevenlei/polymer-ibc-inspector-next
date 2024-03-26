import { useState, useEffect, useRef } from "react";
import { Inter } from "next/font/google";
import Head from "next/head";
import Main from "../../components/Main";
import Packet from "../../components/PacketRecord";
import Header from "../../components/Header";
import Search from "../../components/Search";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [tx, setTx] = useState("");
  const [data, setData] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      const { hash } = router.query;
      fetchPacket(hash);
      setTx(hash);
    }
  }, [router.isReady, router.query]);

  async function fetchPacket(tx) {
    setIsLoading(true);

    try {
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
                  latencyStats {
                    p50: median
                    p90
                    p95
                    p99
                  }
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
        setNotFound(false);
      } else {
        setData(null);
        setNotFound(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
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
          <Search router={router} keyword={keyword} />
        </div>

        {isLoading && (
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

        {data && (
          <>
            <div className="flex justify-between items-center text-slate-500 text-sm md:text-base">
              <p>
                Search result for transaction hash{" "}
                <strong className="break-all">{tx}</strong>
              </p>
            </div>
            <Packet channel={data} tx={tx} />
          </>
        )}

        {notFound && (
          <p className="text-red-600 text-sm md:text-base">
            No packets found for transaction hash{" "}
            <strong className="break-all">{tx}</strong>
          </p>
        )}
      </div>
    </Main>
  );
}

import { useState, useEffect, useRef } from "react";
import { Inter } from "next/font/google";
import Head from "next/head";
import Main from "../components/Main";
import Packet from "../components/PacketRecord";
import Header from "../components/Header";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [data, setData] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(null);

  async function fetchPackets() {
    let queryKeyword = keyword;
    let sequenceQuery = "";

    if (keyword.includes("#")) {
      let parts = keyword.split("#");
      queryKeyword = parts[0];
      sequenceQuery = `, sequence: ${parts[1]}`;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query Packets {
            packets(fromChannelId: "${queryKeyword}", limit: ${limit}, offset: ${offset}${sequenceQuery}) {
              totalCount
              limit
              offset
              list {
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
                }
                toChannel {
                  id
                  type
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
          }
        `,
      }),
    });
    const packets = await response.json();

    setData(packets.data.packets.list);
    setTotal(packets.data.packets.totalCount);
  }

  useEffect(() => {
    // fetchPackets();
  }, []);

  useEffect(() => {
    //
    fetchPackets();
  }, [offset]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setOffset(0);
      setTotal(null);
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

        <div className="flex justify-between items-center text-slate-500 text-sm md:text-base">
          <p>
            Showing {offset + 1} to {offset + limit} of {total || "-"} packets
          </p>
          <ul className="flex space-x-1">
            <li>
              <button
                className="inline-block px-2 py-1 rounded bg-slate-300 hover:bg-slate-400 text-slate-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-300"
                onClick={() => setOffset(offset - limit)}
                disabled={offset === 0}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </li>
            <li>
              <button
                className="inline-block px-2 py-1 rounded bg-slate-300 hover:bg-slate-400 text-slate-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-300"
                onClick={() => setOffset(offset + limit)}
                disabled={offset + limit >= total}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </li>
          </ul>
        </div>

        {data.map((channel, i) => (
          <Packet channel={channel} key={`${channel.id}-${channel.sequence}`} />
        ))}
      </div>
    </Main>
  );
}

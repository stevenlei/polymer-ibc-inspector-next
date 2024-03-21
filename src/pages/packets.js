import { useState, useEffect, useRef } from "react";
import { Inter } from "next/font/google";
import Head from "next/head";
import Script from "next/script";
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
    <main className={`p-12 ${inter.className} min-h-screen bg-slate-200`}>
      <Head>
        <title>Polymer IBC Inspector - Packets</title>
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

      <Header page="Packets" />

      <div className="flex flex-col space-y-6 my-8">
        <div>
          <input
            type="text"
            placeholder="Search by channel ID: e.g. channel-10 or channel-10#123"
            className="w-full p-2 rounded outline-none bg-slate-100 text-slate-800 focus:ring-2 focus:ring-slate-300 text-base"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="flex justify-between items-center text-slate-500">
          <p>
            Showing {offset + 1} to {offset + limit} of {total || "-"} packets
          </p>
          <ul className="flex gap-x-2">
            <li>
              <button
                className="inline-block px-2 py-1 rounded bg-slate-300 hover:bg-slate-400 text-slate-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-300"
                onClick={() => setOffset(offset - limit)}
                disabled={offset === 0}
              >
                Previous
              </button>
            </li>
            <li>
              <button
                className="inline-block px-2 py-1 rounded bg-slate-300 hover:bg-slate-400 text-slate-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-300"
                onClick={() => setOffset(offset + limit)}
                disabled={offset + limit >= total}
              >
                Next
              </button>
            </li>
          </ul>
        </div>

        {data.map((channel, i) => (
          <Packet channel={channel} key={`${channel.id}-${channel.sequence}`} />
        ))}
      </div>
    </main>
  );
}

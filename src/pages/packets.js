import { useState, useEffect, useRef } from "react";
import { Inter } from "next/font/google";
import Head from "next/head";
import Script from "next/script";
import Packet from "../components/PacketRecord";

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

    console.log(packets);

    setData(packets.data.packets.list);
    setTotal(packets.data.packets.totalCount);
  }

  useEffect(() => {
    fetchPackets();
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

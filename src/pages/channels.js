import { useState, useEffect, useRef } from "react";
import { Inter } from "next/font/google";
import Head from "next/head";
import Script from "next/script";
import Packet from "../components/Packet";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [channels, setChannels] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(null);

  useEffect(() => {
    //
    fetchChannels();
  }, []);

  useEffect(() => {
    //
    fetchChannels();
  }, [offset]);

  async function fetchChannels() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query {
            channels(order:DESC, limit: ${limit}, offset: ${offset}, channelId: "${keyword}") {
              totalCount
              offset
              limit
              list {
                id
                counterparty {
                  id
                  portAddress
                  portId
                  connectionHops
                  chain {
                    id
                    name
                  }
                  client
                }
                status
                chain {
                  id
                  name
                }
                portAddress
                portId
                connectionHops
                client
              }
            }
          }
        `,
      }),
    });
    const channels = await response.json();
    setChannels(channels.data.channels.list);
    setTotal(channels.data.channels.totalCount);
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setOffset(0);
      setTotal(null);
      fetchChannels();
    }
  };

  const shorten = (str) => {
    return str.slice(0, 6) + "..." + str.slice(-4);
  };

  return (
    <main className={`p-12 ${inter.className} min-h-screen bg-slate-200`}>
      <Head>
        <title>Polymer IBC Inspector - Channels</title>
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
            placeholder="Search by channel ID..."
            className="w-full p-2 rounded outline-none bg-slate-100 text-slate-800 focus:ring-2 focus:ring-slate-300 text-base"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="flex justify-between items-center text-slate-500">
          <p>
            Showing {offset + 1} to {offset + limit} of {total || "-"} channels
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

        {channels.map((channel, i) => (
          <div
            key={i}
            className="bg-white rounded-lg overflow-hidden ring-1 ring-slate-200"
          >
            <div className="overflow-x-auto">
              <ul className="text-white">
                <li className="flex relative">
                  <span
                    className={`absolute left-1/2 w-20 -ml-10 rounded top-1/2 h-6 -mt-3 text-center text-xs flex items-center justify-center ${
                      channel.status === "OPEN"
                        ? "bg-green-600"
                        : "bg-yellow-600"
                    }`}
                  >
                    {channel.status}
                  </span>
                  <div className="w-1/2 px-3 py-2 bg-slate-700">
                    {channel.id}
                    <span className="bg-slate-500 text-slate-200 px-1 py-0.5 rounded text-sm ml-2">
                      {channel.client}
                    </span>
                  </div>
                  <div className="w-1/2 px-3 py-2 bg-gray-600 text-right">
                    <span className="bg-gray-500 text-gray-200 px-1 py-0.5 rounded text-sm mr-2">
                      {channel.counterparty.client}
                    </span>
                    {channel.counterparty.id}
                  </div>
                </li>
                <li className="px-3 py-2 flex gap-x-2 items-center justify-between bg-slate-100 border-b border-slate-200">
                  <div className="w-1/2 flex flex-col text-xs">
                    <span className="text-slate-500">portAddress</span>
                    <span className="font-mono text-blue-600">
                      {channel.portAddress}
                    </span>
                  </div>
                  <div className="w-1/2 flex flex-col text-xs text-right">
                    <span className="text-slate-500">portAddress</span>
                    <span className="font-mono text-blue-600">
                      {channel.counterparty.portAddress}
                    </span>
                  </div>
                </li>
                <li className="px-3 py-2 flex gap-x-2 items-center justify-between bg-slate-100 border-b border-slate-200">
                  <div className="w-1/2 flex flex-col text-xs">
                    <span className="text-slate-500">portId</span>
                    <span className="font-mono text-blue-600">
                      {channel.portId}
                    </span>
                  </div>
                  <div className="w-1/2 flex flex-col text-xs text-right">
                    <span className="text-slate-500">portId</span>
                    <span className="font-mono text-blue-600">
                      {channel.counterparty.portId}
                    </span>
                  </div>
                </li>
                <li className="px-3 py-2 flex gap-x-2 items-center justify-between bg-slate-100 border-b border-slate-200">
                  <div className="w-1/2 flex flex-col text-xs">
                    <span className="text-slate-500">connectionHops</span>
                    <span className="font-mono text-blue-600">
                      {JSON.stringify(channel.connectionHops)}
                    </span>
                  </div>
                  <div className="w-1/2 flex flex-col text-xs text-right">
                    <span className="text-slate-500">connectionHops</span>
                    <span className="font-mono text-blue-600">
                      {JSON.stringify(channel.counterparty.connectionHops)}
                      channel.counterparty.connectionHops
                    </span>
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

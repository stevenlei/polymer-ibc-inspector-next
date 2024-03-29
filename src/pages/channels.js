import { useState, useEffect, useRef } from "react";
import { Inter } from "next/font/google";
import Head from "next/head";
import Main from "../components/Main";
import Header from "../components/Header";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [channels, setChannels] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    //
    // fetchChannels();
  }, []);

  useEffect(() => {
    //
    fetchChannels();
  }, [offset]);

  async function fetchChannels() {
    setIsLoading(true);

    try {
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
                    timestamp
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
                  timestamp
                }
              }
            }
          `,
        }),
      });
      const channels = await response.json();
      setChannels(channels.data.channels.list);
      setTotal(channels.data.channels.totalCount);
    } catch (error) {
      console.error("Failed to fetch channels", error);
    } finally {
      setIsLoading(false);
    }
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
    <Main>
      <Head>
        <title>Polymer IBC Inspector - Channels</title>
      </Head>

      <Header page="Channels" />

      <div className="flex flex-col space-y-6 my-4 md:my-8">
        <div>
          <input
            type="text"
            placeholder="Search by channel ID..."
            className="w-full p-2 rounded outline-none bg-slate-100 text-slate-800 focus:ring-2 focus:ring-slate-300 text-sm md:text-base"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="flex justify-between items-center text-slate-500 text-sm md:text-base">
          <p>
            Showing {offset + 1} to {offset + limit} of {total || "-"} channels
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
                  <div className="w-1/2 px-3 py-2 bg-slate-700 flex flex-wrap md:flex-nowrap gap-x-2 gap-y-0.5">
                    <span className="text-sm sm:text-base w-full sm:w-auto">
                      {channel.id}
                    </span>
                    <span className="bg-slate-500 text-slate-200 px-1 py-0.5 rounded text-xs sm:text-sm">
                      {channel.client}
                    </span>
                  </div>
                  <div className="w-1/2 px-3 py-2 bg-gray-600 flex justify-end flex-wrap md:flex-nowrap gap-x-2 gap-y-0.5">
                    <span className="bg-gray-500 text-gray-200 px-1 py-0.5 rounded text-xs sm:text-sm order-2 md:order-1">
                      {channel.counterparty.client}
                    </span>
                    <span className="order-1 md:order-2 text-sm sm:text-base w-full sm:w-auto text-right">
                      {channel.counterparty.id}
                    </span>
                  </div>
                </li>
                <li className="flex justify-between bg-slate-100 border-b border-slate-200">
                  <div className="px-3 py-2 w-1/2 flex flex-col text-xs bg-slate-100">
                    <span className="text-slate-500">portAddress</span>
                    <span className="font-mono text-blue-600 break-all">
                      {channel.portAddress}
                    </span>
                  </div>
                  <div className="px-3 py-2 w-1/2 flex flex-col text-xs text-right bg-white">
                    <span className="text-slate-500">portAddress</span>
                    <span className="font-mono text-blue-600 break-all">
                      {channel.counterparty.portAddress}
                    </span>
                  </div>
                </li>
                <li className="flex justify-between bg-slate-100 border-b border-slate-200">
                  <div className="px-3 py-2 w-1/2 flex flex-col text-xs bg-slate-100">
                    <span className="text-slate-500">portId</span>
                    <span className="font-mono text-blue-600 break-all">
                      {channel.portId}
                    </span>
                  </div>
                  <div className="px-3 py-2 w-1/2 flex flex-col text-xs text-right bg-white">
                    <span className="text-slate-500">portId</span>
                    <span className="font-mono text-blue-600 break-all">
                      {channel.counterparty.portId}
                    </span>
                  </div>
                </li>
                <li className="flex justify-between bg-slate-100 border-b border-slate-200">
                  <div className="px-3 py-2 w-1/2 flex flex-col text-xs bg-slate-100">
                    <span className="text-slate-500">connectionHops</span>
                    <span className="font-mono text-blue-600 break-all">
                      {JSON.stringify(channel.connectionHops)}
                    </span>
                  </div>
                  <div className="px-3 py-2 w-1/2 flex flex-col text-xs text-right bg-white">
                    <span className="text-slate-500">connectionHops</span>
                    <span className="font-mono text-blue-600 break-all">
                      {JSON.stringify(channel.counterparty.connectionHops)}
                    </span>
                  </div>
                </li>
                <li className="flex justify-between bg-slate-100 border-b border-slate-200">
                  <div className="px-3 py-2 w-1/2 flex flex-col text-xs bg-slate-100">
                    <span className="text-slate-500">Established</span>
                    <span className="font-mono text-blue-600 break-all">
                      {channel.timestamp} (
                      {new Date(channel.timestamp * 1000).toLocaleString()})
                    </span>
                  </div>
                  <div className="px-3 py-2 w-1/2 flex flex-col text-xs text-right bg-white">
                    <span className="text-slate-500">Established</span>
                    <span className="font-mono text-blue-600 break-all">
                      {channel.counterparty.timestamp} (
                      {new Date(
                        channel.counterparty.timestamp * 1000
                      ).toLocaleString()}
                      )
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </Main>
  );
}

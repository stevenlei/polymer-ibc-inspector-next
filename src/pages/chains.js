import { useState, useEffect, useRef } from "react";
import { Inter } from "next/font/google";
import Head from "next/head";
import Main from "../components/Main";
import Header from "../components/Header";

export default function Home() {
  const [chains, setChains] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    //
    fetchChain();
  }, []);

  async function fetchChain() {
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query Chain {
              chains {
                id
                name
                availableClients
                universalChannels {
                  id
                  type
                }
                packetsCount
                channelsCount
              }
            }
          `,
        }),
      });
      const chains = await response.json();
      setChains(chains.data.chains);
    } catch (error) {
      console.error("Failed to fetch chains", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Main>
      <Head>
        <title>Polymer IBC Inspector - Chains</title>
      </Head>

      <Header page="Chains" />

      <div className="flex flex-col space-y-6 my-4 md:my-8">
        <div className="flex justify-between items-center text-slate-500 text-sm md:text-base">
          <p>Showing {chains.length || "-"} chains</p>
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

        {chains.map((chain, i) => (
          <div
            key={i}
            className="bg-white rounded-lg overflow-hidden ring-1 ring-slate-200"
          >
            <div className="overflow-x-auto">
              <ul className="text-white">
                <li className="flex relative">
                  <div className="w-full px-3 py-2 bg-slate-700 flex flex-wrap md:flex-nowrap gap-x-2 gap-y-0.5">
                    <span className="text-sm sm:text-base w-full sm:w-auto">
                      {chain.name}
                    </span>
                  </div>
                </li>
                <li className="flex flex-wrap justify-between bg-slate-100 border-b border-slate-200">
                  <div className="w-full md:w-1/2 lg:w-1/4 px-3 py-2 flex flex-col text-xs bg-white">
                    <span className="text-slate-500">Clients</span>
                    <div className="font-mono text-blue-600 flex flex-wrap mt-1">
                      {chain.availableClients.map((client) => (
                        <span
                          key={client}
                          className="bg-slate-200 px-1 py-0.5 rounded self-start mr-2 mb-2"
                        >
                          {client}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 lg:w-1/4 px-3 py-2 flex flex-col text-xs bg-white">
                    <span className="text-slate-500">Universal Channels</span>
                    <div className="font-mono text-blue-600 flex flex-wrap mt-1">
                      {chain.universalChannels.map((channel) => (
                        <span
                          key={channel.id}
                          className="bg-slate-200 px-1 py-0.5 rounded self-start mr-2 mb-2"
                        >
                          {channel.id}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 lg:w-1/4 px-3 py-2 flex flex-col text-xs bg-white">
                    <span className="text-slate-500">Packets Count</span>
                    <span className="font-mono text-blue-600 mt-1">
                      {chain.packetsCount}
                    </span>
                  </div>
                  <div className="w-full md:w-1/2 lg:w-1/4 px-3 py-2 flex flex-col text-xs bg-white">
                    <span className="text-slate-500">Channels Count</span>
                    <span className="font-mono text-blue-600 mt-1">
                      {chain.channelsCount}
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

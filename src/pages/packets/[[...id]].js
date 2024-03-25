import { useState, useEffect, useRef } from "react";
import { Inter } from "next/font/google";
import Head from "next/head";
import Main from "../../components/Main";
import Packet from "../../components/PacketRecord";
import Header from "../../components/Header";
import Search from "../../components/Search";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      const { id } = router.query;

      if (id) {
        const parts = id[0].split(".");

        if (parts.length === 1) {
          setKeyword(parts[0]);
        } else {
          setKeyword(`${parts[0]}#${parts[1]}`);
        }
      } else {
        setKeyword("");
      }

      setOffset(0);
      setLoaded(true);
    }
  }, [router.isReady, router.query]);

  async function fetchPackets() {
    let queryKeyword = keyword;
    let sequenceQuery = "";

    if (keyword.includes("#")) {
      let parts = keyword.split("#");
      queryKeyword = parts[0];
      sequenceQuery = `, sequence: ${parts[1]}`;
    }

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
            }
          `,
        }),
      });
      const packets = await response.json();
      if (packets.data.packets.totalCount === 0) {
        setNotFound(true);
        setData([]);
      } else {
        setData(packets.data.packets.list);
        setTotal(packets.data.packets.totalCount);
        setNotFound(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    //
    if (loaded) {
      fetchPackets();
    }
  }, [loaded, offset, keyword]);

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

        {data.length > 0 && (
          <>
            <div className="flex justify-between items-center text-slate-500 text-sm md:text-base">
              <p>
                Showing {offset + 1} to {offset + limit} of {total || "-"}{" "}
                packets
                {keyword && (
                  <>
                    {" "}
                    for <strong className="break-all">{keyword}</strong>
                  </>
                )}
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
              <Packet
                channel={channel}
                key={`${channel.id}-${channel.sequence}`}
              />
            ))}
          </>
        )}

        {notFound && (
          <p className="text-red-600 text-sm md:text-base">
            No packets found for{" "}
            <strong className="break-all">{keyword}</strong>
          </p>
        )}
      </div>
    </Main>
  );
}

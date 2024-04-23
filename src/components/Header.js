import Link from "next/link";

const Header = ({ page, version = "v0.1 (MVP)" }) => (
  <header className="flex justify-between flex-wrap">
    <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">
      <Link href="/">Polymer IBC Inspector</Link>
      <span className="text-sm font-normal ml-2 text-slate-400">v0.3</span>
    </h1>
    <div className="flex gap-x-8 items-center w-full md:w-auto">
      <ul className="mt-4 md:mt-0 flex gap-x-8 lg:gap-x-12 text-sm md:text-base lg:text-lg">
        {/* <li>
          <Link
            href="/"
            className={`${
              page === "Live" ? "text-slate-800" : "text-slate-500"
            }`}
          >
            Live
          </Link>
        </li> */}
        <li>
          <Link
            href="/packets"
            className={`${
              page === "Packets" ? "text-slate-800" : "text-slate-500"
            }`}
          >
            Packets
          </Link>
        </li>
        <li>
          <Link
            href="/channels"
            className={`${
              page === "Channels" ? "text-slate-800" : "text-slate-500"
            }`}
          >
            Channels
          </Link>
        </li>
        <li>
          <Link
            href="/chains"
            className={`${
              page === "Chains" ? "text-slate-800" : "text-slate-500"
            }`}
          >
            Chains
          </Link>
        </li>
      </ul>
      <a
        href="https://x.com/stevenkin"
        className="absolute top-2 right-0 md:static flex text-sm mr-2 ml-4 opacity-90 hover:opacity-100 hover:bg-slate-300 rounded-full p-2"
        target="_blank"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6 fill-current text-slate-800"
        >
          <g>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
          </g>
        </svg>
      </a>
    </div>
  </header>
);

export default Header;

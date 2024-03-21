import Link from "next/link";

const Header = ({ page, version = "v0.1 (MVP)" }) => (
  <header className="flex justify-between">
    <h1 className="text-2xl font-bold text-slate-800">
      Polymer IBC Inspector
      <span className="text-sm font-normal ml-2 text-slate-400">
        v0.2 (MVP)
      </span>
    </h1>
    <div className="flex gap-x-12 items-center">
      <ul className="flex gap-x-12">
        <li>
          <Link
            href="/"
            className={`text-lg ${
              page === "Live" ? "text-slate-800" : "text-slate-500"
            }`}
          >
            Live
          </Link>
        </li>
        <li>
          <Link
            href="/packets"
            className={`text-lg ${
              page === "Packets" ? "text-slate-800" : "text-slate-500"
            }`}
          >
            Packets
          </Link>
        </li>
        <li>
          <Link
            href="/channels"
            className={`text-lg ${
              page === "Channels" ? "text-slate-800" : "text-slate-500"
            }`}
          >
            Channels
          </Link>
        </li>
      </ul>
      <a
        href="https://x.com/stevenkin"
        className="flex text-sm mr-2 ml-4 opacity-90 hover:opacity-100 hover:bg-slate-300 rounded-full p-2"
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

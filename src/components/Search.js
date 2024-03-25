import { useState, useEffect } from "react";

const Search = ({ router, keyword: theKeyword }) => {
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    setKeyword(theKeyword);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // check if it is an address, a tx hash or a packet keyword

      if (keyword.startsWith("0x") && keyword.length === 42) {
        router.push(`/address/${keyword}`);
      } else if (keyword.startsWith("0x") && keyword.length === 66) {
        router.push(`/tx/${keyword}`);
      } else {
        router.push(`/packets/${keyword.replace("#", ".")}`);
      }
    }
  };

  return (
    <>
      <input
        type="text"
        placeholder="address, tx hash, or packet keyword"
        className="w-full p-2 rounded outline-none bg-slate-100 text-slate-800 focus:ring-2 focus:ring-slate-300 text-sm md:text-base"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <p className="text-sm text-slate-400 mt-1">
        Packet keyword: channel-10 / channel-10#123
      </p>
    </>
  );
};

export default Search;

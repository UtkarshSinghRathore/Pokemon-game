"use client"
import { useState, useEffect } from 'react';
import usePokemon from './hooks/usePokemon';
import Link from 'next/link';

const Home = () => {
  const { types, pokemonList, loading, hasMore, setPage, updateType, setSearchTerm, searchPokemon } = usePokemon();

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && hasMore && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchPokemon();
  };

  return (
    <div className="w-full p-4 bg-[#F0f0f0]">
      <h1 className="text-2xl font-bold mb-4">Pokémon Search</h1>
      <form className="mb-4" onSubmit={handleSearch}>
        <div className="flex flex-col md:flex-row gap-5">
          <select 
            className="border p-2" 
            onChange={(e) => updateType(e.target.value)}
            disabled={loading}
          >
            <option value="">All Types</option>
            {types.map(type => (
              <option key={type.name} value={type.name}>{type.name}</option>
            ))}
          </select>
          <input 
            type="text" 
            className="border p-2" 
            placeholder="Search Pokémon" 
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
          />
          <button 
            type="submit" 
            className="border p-2 bg-blue-500 text-white"
            disabled={loading}
          >
            Search
          </button>
        </div>
      </form>
      {loading && pokemonList.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {pokemonList.map(pokemon => (
            <div  key={pokemon.name}>
              <div className="border rounded-2xl hover:shadow-lg bg-[#FFF]">
                <div className='flex items-center justify-center h-[150px] '>
                  <img src={pokemon.image} alt={pokemon.name} className="w-1/2" />
                </div>
                <div className='items-start rounded-b-2xl flex gap-16 flex-col p-4 bg-[#FAFAFA] w-full'>
                  <h2 className="text-lg font-bold h-1/2">{pokemon.name.charAt(0).toLocaleUpperCase()+pokemon.name.slice(1)}</h2>
                  <Link className='cursor-pointer text-blue-500' href={`/pokemon/${pokemon.name}`} key={pokemon.name} passHref>Details &#8594;</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {loading && <p>Loading more Pokémon...</p>}
    </div>
  );
};

export default Home;

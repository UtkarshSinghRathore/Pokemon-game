import { useState, useEffect } from 'react';

interface PokemonType {
  name: string;
  url: string;
}

interface Pokemon {
  name: string;
  url: string;
  type: string[];
  image: string;
}

const usePokemon = () => {
  const [types, setTypes] = useState<PokemonType[]>([]);
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [selectedType, setSelectedType] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    const res = await fetch('https://pokeapi.co/api/v2/type');
    const data = await res.json();
    setTypes(data.results);
  };

  const fetchPokemon = async () => {
    setLoading(true);
    let url = `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${(page - 1) * 20}`;
    if (selectedType) {
      url = `https://pokeapi.co/api/v2/type/${selectedType}`;
    }

    const res = await fetch(url);
    const data = await res.json();

    let pokemonDetails = [];
    if (selectedType) {
      pokemonDetails = await Promise.all(data.pokemon.slice((page - 1) * 20, page * 20).map(async (pokemonData: any) => {
        const detailsRes = await fetch(pokemonData.pokemon.url);
        const details = await detailsRes.json();
        return {
          name: details.name,
          url: pokemonData.pokemon.url,
          type: details.types.map((typeInfo: any) => typeInfo.type.name),
          image: details.sprites.front_default
        };
      }));
    } else {
      pokemonDetails = await Promise.all(data.results.map(async (pokemon: any) => {
        const detailsRes = await fetch(pokemon.url);
        const details = await detailsRes.json();
        return {
          name: details.name,
          url: pokemon.url,
          type: details.types.map((typeInfo: any) => typeInfo.type.name),
          image: details.sprites.front_default
        };
      }));
    }

    setPokemonList(prev => (page === 1 ? pokemonDetails : [...prev, ...pokemonDetails]));
    setHasMore(selectedType ? data.pokemon.length > page * 20 : data.results.length > 0);
    setLoading(false);
  };

  useEffect(() => {
    fetchPokemon();
  }, [page, selectedType]);

  const updateType = (type: string) => {
    setSelectedType(type);
    setPokemonList([]);
    setPage(1);
  };

  const searchPokemon = async () => {
    if (!searchTerm) return;
    setLoading(true);
    setPage(1);
    setPokemonList([]);

    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`);
    if (res.status === 200) {
      const details = await res.json();
      const pokemonDetails = [{
        name: details.name,
        url: `https://pokeapi.co/api/v2/pokemon/${details.id}`,
        type: details.types.map((typeInfo: any) => typeInfo.type.name),
        image: details.sprites.front_default
      }];
      setPokemonList(pokemonDetails);
      setHasMore(false);
    } else {
      setPokemonList([]);
    }
    setLoading(false);
  };

  return { types, pokemonList, loading, hasMore, setPage, updateType, setSearchTerm, searchPokemon };
};

export default usePokemon;

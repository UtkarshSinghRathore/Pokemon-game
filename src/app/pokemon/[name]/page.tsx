"use client"
import { useParams } from 'next/navigation';
import Link from 'next/link';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const PokemonDetail = () => {
  const { name } = useParams() as { name: string };
  const { data, error } = useSWR(name ? `https://pokeapi.co/api/v2/pokemon/${name}` : null, fetcher);

  if (error) return <div>Failed to load Pokémon details</div>;
  if (!data) return <div>Loading...</div>;

  console.log(data)
  return (
    <div className="container mx-auto p-4">
      <nav className="mb-4">
        <Link href="/">
          <span className="text-blue-500 cursor-pointer">Home</span>
        </Link>
        {' > '}
        <span>{data.name}</span>
      </nav>
      <div className='w-full flex items-center justify-center mt-0 md:mt-32'>
        <div className="border rounded flex flex-col w-full md:w-1/2 bg-[#FCC666]">
          <div className='bg-[#60E2C9] w-full flex justify-center items-center'>
            <img src={data.sprites.front_default} alt={data.name} className='h-auto w-1/2'/>
          </div>
          <div className='p-4'>
            <p><span className='font-bold'>Name: </span> {data.name.charAt(0).toLocaleUpperCase()+data.name.slice(1)}</p>
            <p><span className='font-bold'>Type: </span> {data.types.map( (item: { type: { name: string; }; }, index: number) => {
              if(index === data.types.length -1) {
                return item.type.name
              }
              else {
                return item.type.name+", "
              }
              
              })}</p>
            <p><span className='font-bold'>Base Experience: </span> {data.stats.map( (item: { stat: { name: string; }; }, index: number) => {
              if(index === data.stats.length -1) {
                return item.stat.name
              }
              else {
                return item.stat.name+", "
              }
              })}</p>
              <p><span className='font-bold'>Abilities: </span> {data.abilities.map( (item: { ability: { name: string; }; }, index: number) => {
              if(index === data.abilities.length -1) {
                return item.ability.name
              }
              else {
                return item.ability.name+", "
              }
              })}</p>
              <p><span className='font-bold'>Some Moves: </span> {data.moves.slice(0,7).map( (item: { move: { name: string; }; }, index: number) => {
              if(index === 6) {
                return item.move.name
              }
              else {
                return item.move.name+", "
              }
              })}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;

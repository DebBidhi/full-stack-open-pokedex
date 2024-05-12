import React from 'react'
import { Link, useParams } from 'react-router-dom'
import LoadingSpinner from './LoadingSpinner'
import { useApi } from './useApi'
import PokemonAbility from './PokemonAbility'
import ErrorMessage from './ErrorMessage'

const formatName = (nameWithDash) => nameWithDash.replace('-', ' ')

const PokemonPage = ({ previous, next }) => {
  const { name } = useParams()
  const { data: pokemon, error, isLoading } = useApi(`https://pokeapi.co/api/v2/pokemon/${name}`)

  if (isLoading) {
    return <LoadingSpinner />
  }
  if (error) {
    return <ErrorMessage error={error} />
  }
  const stats = pokemon.stats.map((stat) => ({
    name: formatName(stat.stat.name),
    value: stat.base_stat
  })).reverse()
  const normalAbility = pokemon.abilities.find((ability) => !ability.is_hidden)
  const hiddenAbility = pokemon.abilities.find((ability) => ability.is_hidden === true)

  // console.log('hiddenAbility=', hiddenAbility)
  // Assuming pokemon.types is an array and we're interested in the first type
  const type = pokemon.types && pokemon.types.length > 0 ? pokemon.types[0].type : null

  return (
    <>
      <div className="links">
        {previous && <Link to={`/pokemon/${previous.name}`}>Previous</Link>}
        <Link to="/">Home</Link>
        {next && <Link to={`/pokemon/${next.name}`}>Next</Link>} {/* Fixed typo from previous.name to next.name */}
      </div>
      <div className={`pokemon-page ${type ? `pokemon-type-${type.name}` : ''}`}>
        <div className="pokemon-image" style={{ backgroundImage: `url(${pokemon.sprites.front_default})` }} />
        <div className="pokemon-info">
          <div className="pokemon-name">{pokemon.name}</div>
          <div className="pokemon-stats" data-testid="stats">
            <table>
              <tbody>
                {stats.map(({ name, value }) => (
                  <tr key={name}>
                    <td className="pokemon-stats-name">{name}</td>
                    <td className="pokemon-stats-value">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pokemon-abilities">
            {normalAbility && <PokemonAbility abilityName={formatName(normalAbility.ability.name)} />}
            {hiddenAbility && <PokemonAbility abilityName={formatName(hiddenAbility.ability.name)} />}
          </div>
        </div>
      </div>
    </>
  )
}

export default PokemonPage

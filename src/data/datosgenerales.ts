
import type { Player, Team } from './../types/index';
import { futsalTeams } from './teams';

// Generamos un mapeo de avatares para cada jugador
// basado en el equipo al que pertenecen.

// Creamos un tipo para definir la estructura de nuestro objeto de avatares.
export type PlayerAvatars = {
  [playerId: number]: string;
};

// Inicializamos el objeto que contendrá los avatares.
const playerAvatars: PlayerAvatars = {};

// Iteramos sobre cada equipo para acceder a sus jugadores.
futsalTeams.forEach((team: Team) => {
  // Para cada jugador en el equipo, creamos una URL de avatar.
  team.players.forEach((player: Player) => {
    // La URL se basa en el 'slug' del equipo para asegurar un nombre de archivo único y consistente.
    // Por ejemplo, para el equipo "CAPINCHO", la URL será:
    // '/equipos/jugadores_individuales/avatar_capincho.png'
    playerAvatars[player.id] = `/equipos/jugadores_individuales/avatar_${team.slug}.png`;
  });
});

// Exportamos el objeto de avatares para que pueda ser utilizado en otros componentes.
export { playerAvatars };

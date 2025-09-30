'use client';

import type { GameState, FullMatch, GameEvent, SelectedPlayer, MatchStatus, PlayerPosition, PlayerTimeTracker, PlayerMatchStats } from '@/types';
import React,
{
  useReducer,
  useCallback,
  useEffect,
  createContext,
  useContext,
  useRef
} from 'react';
import { useToast } from '@/hooks/use-toast';
import { saveMatchState, createGameEvent } from '@/actions/match-actions';

type GameAction =
  | { type: 'LOAD_MATCH'; payload: { match: FullMatch; state: GameState | null } }
  | { type: 'UPDATE_SCORE'; payload: { team: 'A' | 'B'; delta: number } }
  | { type: 'UPDATE_FOULS'; payload: { team: 'A' | 'B'; delta: number } }
  | { type: 'UPDATE_TIMEOUTS'; payload: { team: 'A' | 'B'; delta: number } }
  | { type: 'SET_PERIOD'; payload: number }
  | { type: 'SET_STATUS'; payload: MatchStatus }
  | { type: 'TOGGLE_TIMER' }
  | { type: 'RESET_TIMER' }
  | { type: 'SET_TIME'; payload: number }
  | { type: 'TICK'; payload: { timePassed: number } }
  | { type: 'SELECT_PLAYER'; payload: SelectedPlayer }
  | { type: 'ADD_EVENT'; payload: { event: Omit<GameEvent, 'id' | 'matchId'> } }
  | { type: 'INITIATE_SUBSTITUTION'; payload: { playerOut: NonNullable<SelectedPlayer> } }
  | { type: 'CANCEL_SUBSTITUTION' }
  | { type: 'COMPLETE_SUBSTITUTION'; payload: { playerInId: number } }
  | { type: 'TOGGLE_ACTIVE_PLAYER'; payload: { teamId: 'A' | 'B'; playerId: number } }
  | { type: 'SET_INITIAL_POSITIONS' }
  | { type: 'UPDATE_PLAYER_POSITION'; payload: { playerId: number; position: PlayerPosition } }
  | { type: 'UPDATE_PLAYER_TIME' }
  | { type: 'UPDATE_STATE_FROM_WS'; payload: GameState }
  | { type: 'RESET_STATE' };


const initialState: GameState = {
  matchId: null,
  status: 'SCHEDULED',
  teamA: null,
  teamB: null,
  scoreA: 0,
  scoreB: 0,
  foulsA: 0,
  foulsB: 0,
  timeoutsA: 0,
  timeoutsB: 0,
  period: 1,
  time: 1200,
  isRunning: false,
  events: [],
  selectedPlayer: null,
  substitutionState: null,
  activePlayersA: [],
  activePlayersB: [],
  playerPositions: {},
  playerTimeTracker: {},
  updatedAt: null,
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'LOAD_MATCH': {
      let baseState = action.payload.state || {
        ...initialState,
        matchId: action.payload.match.id,
        status: action.payload.match.status,
        teamA: action.payload.match.teamA,
        teamB: action.payload.match.teamB,
        scoreA: action.payload.match.scoreA ?? 0,
        scoreB: action.payload.match.scoreB ?? 0,
        foulsA: action.payload.match.foulsA ?? 0,
        foulsB: action.payload.match.foulsB ?? 0,
        timeoutsA: action.payload.match.timeoutsA ?? 1,
        timeoutsB: action.payload.match.timeoutsB ?? 1,
        period: action.payload.match.period ?? 1,
        time: action.payload.match.time ?? 1200,
        isRunning: action.payload.match.isRunning ?? false,
        events: action.payload.match.events || [],
        activePlayersA: action.payload.match.activePlayersA || [],
        activePlayersB: action.payload.match.activePlayersB || [],
        playerPositions: {},
        updatedAt: action.payload.match.updatedAt,
      };
      
      const timeTracker: PlayerTimeTracker = {};
       (action.payload.match.playerMatchStats as PlayerMatchStats[])?.forEach(stat => {
          timeTracker[stat.playerId] = {
              startTime: state.time,
              totalTime: stat.timePlayedInSeconds,
          };
       });

       baseState = { ...baseState, playerTimeTracker: timeTracker, substitutionState: null };
       
      if (!baseState.activePlayersA) baseState.activePlayersA = [];
      if (!baseState.activePlayersB) baseState.activePlayersB = [];
      return baseState;
    }
    case 'UPDATE_SCORE':
      if (action.payload.team === 'A') {
        return { ...state, scoreA: Math.max(0, state.scoreA + action.payload.delta) };
      }
      return { ...state, scoreB: Math.max(0, state.scoreB + action.payload.delta) };
    case 'UPDATE_FOULS':
      if (action.payload.team === 'A') {
        return { ...state, foulsA: Math.max(0, state.foulsA + action.payload.delta) };
      }
      return { ...state, foulsB: Math.max(0, state.foulsB + action.payload.delta) };
    case 'UPDATE_TIMEOUTS':
       if (action.payload.team === 'A') {
        return { ...state, timeoutsA: Math.max(0, state.timeoutsA + action.payload.delta) };
      }
      return { ...state, timeoutsB: Math.max(0, state.timeoutsB + action.payload.delta) };
    case 'SET_PERIOD': {
        const newPeriod = action.payload;
        if (state.period === newPeriod) return state;

        let newState = {
            ...state,
            period: newPeriod,
            time: 1200, // Reset time for the new period (20 minutes)
            isRunning: false,
        };

        // If moving to the second period, reset fouls and timeouts
        if (newPeriod === 2) {
            newState.foulsA = 0;
            newState.foulsB = 0;
            newState.timeoutsA = 1;
            newState.timeoutsB = 1;
        }

        if (state.matchId) {
            const periodEvent: Omit<GameEvent, 'id' | 'matchId'> = {
                type: 'PERIOD_START',
                teamId: 0,
                playerId: null,
                playerName: '',
                teamName: '',
                timestamp: 1200, // Timestamp for start of 2nd period
                playerInId: null,
                playerInName: null,
                x: null,
                y: null,
            };
            return gameReducer(newState, { type: 'ADD_EVENT', payload: { event: periodEvent } });
        }
        return newState;
    }
    case 'SET_TIME':
        return { ...state, time: action.payload, isRunning: false };
    case 'SET_STATUS': {
        const newStatus = action.payload;
        let newState = {
            ...state,
            status: newStatus,
            isRunning: newStatus === 'LIVE' ? state.isRunning : false,
            time: newStatus === 'FINISHED' ? 0 : state.time,
        };

        if (newStatus === 'LIVE' && state.status !== 'LIVE') {
             const startEvent: Omit<GameEvent, 'id' | 'matchId'> = {
                type: 'MATCH_START',
                teamId: 0,
                playerId: null,
                playerName: '',
                teamName: '',
                timestamp: 0,
                playerInId: null,
                playerInName: null,
                x: null,
                y: null,
            };
            newState = gameReducer(newState, { type: 'ADD_EVENT', payload: { event: startEvent } });
        } else if (newStatus === 'FINISHED' && state.status !== 'FINISHED') {
             const endEvent: Omit<GameEvent, 'id' | 'matchId'> = {
                type: 'MATCH_END',
                teamId: 0,
                playerId: null,
                playerName: '',
                teamName: '',
                timestamp: 2400,
                playerInId: null,
                playerInName: null,
                x: null,
                y: null,
            };
            newState = gameReducer(newState, { type: 'ADD_EVENT', payload: { event: endEvent } });
        }
        
        return newState;
    }
    case 'TOGGLE_TIMER':
      return { ...state, isRunning: !state.isRunning };
    case 'RESET_TIMER':
      return { ...state, time: 1200, isRunning: false };
    case 'TICK': {
      if (state.isRunning && state.time > 0) {
        const newTime = Math.max(0, state.time - action.payload.timePassed);
        return { ...state, time: newTime };
      }
       if (state.isRunning && state.time <= 0) {
          if (state.period >= 2) {
              return { ...state, time: 0, isRunning: false, status: 'FINISHED' };
          }
          return { ...state, time: 0, isRunning: false };
      }
      return state;
    }
    case 'SELECT_PLAYER': {
        const selected = action.payload;
        if (state.substitutionState) {
            return state;
        }
        if (!selected) {
            return { ...state, selectedPlayer: null };
        }
        if (state.selectedPlayer?.playerId === selected.playerId && state.selectedPlayer?.teamId === selected.teamId) {
            return { ...state, selectedPlayer: null };
        }

        return { ...state, selectedPlayer: selected };
    }
    case 'ADD_EVENT': {
        if (!state.matchId) return state;

        const newEvent = { ...action.payload.event, id: Date.now(), matchId: state.matchId };
        
        let newState: GameState = { 
            ...state, 
            events: [...state.events, newEvent], 
            selectedPlayer: null,
        };

        if (action.payload.event.type === 'GOAL' && action.payload.event.teamId) {
            const team = action.payload.event.teamId === state.teamA?.id ? 'A' : 'B';
            newState = gameReducer(newState, { type: 'UPDATE_SCORE', payload: { team, delta: 1 } });
        }
        if (action.payload.event.type === 'FOUL' && action.payload.event.teamId) {
            const team = action.payload.event.teamId === state.teamA?.id ? 'A' : 'B';
            newState = gameReducer(newState, { type: 'UPDATE_FOULS', payload: { team, delta: 1 } });
        }
        if (action.payload.event.type === 'TIMEOUT' && action.payload.event.teamId) {
            const team = action.payload.event.teamId === state.teamA?.id ? 'A' : 'B';
            newState = gameReducer(newState, { type: 'UPDATE_TIMEOUTS', payload: { team, delta: -1 } });
        }

        return newState;
    }
    case 'INITIATE_SUBSTITUTION':
        return {
            ...state,
            substitutionState: { playerOut: action.payload.playerOut },
            selectedPlayer: null,
        };
    case 'CANCEL_SUBSTITUTION':
        return { ...state, substitutionState: null };
    
    case 'COMPLETE_SUBSTITUTION': {
        if (!state.substitutionState || !state.matchId) return state;

        const { playerOut } = state.substitutionState;
        const playerInId = action.payload.playerInId;

        if (playerOut.playerId === playerInId) return state;

        const team = playerOut.teamId === 'A' ? state.teamA : state.teamB;
        if (!team) return state;

        const pOut = team.players.find(p => p.id === playerOut.playerId);
        const pIn = team.players.find(p => p.id === playerInId);
        if (!pOut || !pIn) return state;

        const activePlayersKey = playerOut.teamId === 'A' ? 'activePlayersA' : 'activePlayersB';
        const currentActivePlayers = state[activePlayersKey];
        const updatedActivePlayers = currentActivePlayers.filter(id => id !== pOut.id).concat(pIn.id);
        
        const newPlayerPositions = { ...state.playerPositions };
        const playerOutPosition = newPlayerPositions[pOut.id];
        if (playerOutPosition) {
            newPlayerPositions[pIn.id] = playerOutPosition;
        }
        delete newPlayerPositions[pOut.id];
        
        // Correct timestamp calculation
        const timeElapsed = 1200 - state.time;
        const absoluteTimestamp = state.period === 1 ? timeElapsed : 1200 + timeElapsed;


        const substitutionEvent: Omit<GameEvent, 'id' | 'matchId'> = {
            type: 'SUBSTITUTION',
            teamId: team.id,
            teamName: team.name,
            playerId: pOut.id,
            playerName: pOut.name,
            playerInId: pIn.id,
            playerInName: pIn.name,
            timestamp: absoluteTimestamp,
            x: null,
            y: null,
        };
        
        const stateWithSub = {
            ...state,
            [activePlayersKey]: updatedActivePlayers,
            playerPositions: newPlayerPositions,
            substitutionState: null,
            selectedPlayer: null,
        }

        return gameReducer(stateWithSub, { type: 'ADD_EVENT', payload: { event: substitutionEvent }});
    }
    
    case 'TOGGLE_ACTIVE_PLAYER': {
        const { teamId, playerId } = action.payload;
        const activePlayersKey = teamId === 'A' ? 'activePlayersA' : 'activePlayersB';
        const currentActivePlayers: number[] = state[activePlayersKey];
        const isCurrentlyActive = currentActivePlayers.includes(playerId);
        
        let updatedActivePlayers: number[];
        
        if (isCurrentlyActive) {
            updatedActivePlayers = currentActivePlayers.filter(id => id !== playerId);
        } else {
            if (currentActivePlayers.length < 5) {
                updatedActivePlayers = [...currentActivePlayers, playerId];
            } else {
                console.warn(`Team ${teamId} already has 5 active players.`);
                return state;
            }
        }
        
        return {
            ...state,
            [activePlayersKey]: updatedActivePlayers,
        };
    }
    case 'SET_INITIAL_POSITIONS': {
        if (!state.teamA || !state.teamB) return state;
    
        const newPositions: { [playerId: number]: PlayerPosition } = {};
    
        const setPositionsForTeam = (playerIds: number[], team: 'A' | 'B') => {
            const xPosition = team === 'A' ? 25 : 75; 
            const yStart = 15;
            const yIncrement = 17.5;
    
            playerIds.forEach((playerId, index) => {
                newPositions[playerId] = {
                    x: xPosition,
                    y: yStart + (index * yIncrement),
                };
            });
        };
    
        setPositionsForTeam(state.activePlayersA, 'A');
        setPositionsForTeam(state.activePlayersB, 'B');
    
        return { ...state, playerPositions: newPositions };
    }
    case 'UPDATE_PLAYER_POSITION': {
        const { playerId, position } = action.payload;
        return {
            ...state,
            playerPositions: {
                ...state.playerPositions,
                [playerId]: position,
            },
        };
    }
    case 'UPDATE_STATE_FROM_WS': {
        const { teamA, teamB, ...wsState } = action.payload;
        return {
            ...state,
            ...wsState,
            teamA: { ...state.teamA!, ...teamA },
            teamB: { ...state.teamB!, ...teamB }
        };
    }
    case 'RESET_STATE': {
      return {
        ...initialState,
        matchId: state.matchId,
        teamA: state.teamA,
        teamB: state.teamB,
        updatedAt: new Date().toISOString(),
      };
    }
    default:
      return state;
  }
};

type GameProviderProps = {
  children: React.ReactNode;
  match: FullMatch;
}

const GameContext = createContext<{ 
    state: GameState; 
    dispatch: React.Dispatch<GameAction>;
    handleSaveChanges: (stateOverride?: GameState) => Promise<void>;
    handleCreateGameEvent: (event: Omit<GameEvent, 'id'|'matchId'>) => Promise<void>;
} | undefined>(undefined);

export const GameProvider: React.FC<GameProviderProps> = ({ children, match }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { toast } = useToast();
  const lastTickRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getInitialState = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedState = localStorage.getItem(`futsal-match-state-${match.id}`);
        const parsedState = savedState ? JSON.parse(savedState) : null;
        
        if (parsedState && new Date(parsedState.updatedAt) > new Date(match.updatedAt)) {
             // Local state is newer, use it but merge with fresh team data from server
            return {
                ...parsedState,
                teamA: match.teamA,
                teamB: match.teamB,
            };
        }
      }
    } catch {
      console.error("Failed to read state from localStorage");
    }
    // Default to server state if no local state, or if server state is newer
    return null;
  }, [match]);

  useEffect(() => {
    dispatch({ type: 'LOAD_MATCH', payload: { match, state: getInitialState() } });
  }, [match, getInitialState]);
  
  const handleSaveChanges = useCallback(async (overrideState?: GameState) => {
    const stateToSave = overrideState || state;
    if (!stateToSave.matchId) {
        console.error("No match ID, cannot save state.");
        return;
    }
    try {
        await saveMatchState(stateToSave.matchId, {...stateToSave, updatedAt: new Date().toISOString()});
    } catch {
        toast({
            variant: "destructive",
            title: "Error de Sincronización",
            description: "No se pudo guardar el estado del partido.",
        });
    }
  }, [state, toast]);

 const handleCreateGameEvent = useCallback(async (event: Omit<GameEvent, 'id'|'matchId'>) => {
    if (!state.matchId) {
        console.error("No match ID, cannot create event.");
        return;
    }
    try {
        await createGameEvent(state.matchId, event);
    } catch {
         toast({
            variant: "destructive",
            title: "Error de Sincronización",
            description: "No se pudo registrar el evento del partido.",
        });
    }
 }, [state.matchId, toast]);

  useEffect(() => {
    if (state.matchId) {
        try {
            localStorage.setItem(`futsal-match-state-${state.matchId}`, JSON.stringify({...state, updatedAt: new Date().toISOString()}));
        } catch {
            console.error("Failed to write state to localStorage");
        }
    }
  }, [state]);

  useEffect(() => {
    if (state.isRunning && state.time > 0) {
      lastTickRef.current = Date.now();
      timerRef.current = setInterval(() => {
        if (lastTickRef.current) {
          const now = Date.now();
          const timePassed = (now - lastTickRef.current) / 1000;
          lastTickRef.current = now;
          dispatch({ type: 'TICK', payload: { timePassed } });
        }
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        lastTickRef.current = null;
      }
    };
  }, [state.isRunning, state.time]);
  
  return (
    <GameContext.Provider value={{ state, dispatch, handleSaveChanges, handleCreateGameEvent }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

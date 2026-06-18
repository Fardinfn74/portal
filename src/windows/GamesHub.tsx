import { useState } from 'react';
import { SnakeGame } from '../games/SnakeGame';
import { TetrisGame } from '../games/TetrisGame';
import { MinesweeperGame } from '../games/MinesweeperGame';
import { BreakoutGame } from '../games/BreakoutGame';
import { Game2048 } from '../games/Game2048';
import { MemoryGame } from '../games/MemoryGame';
import { SimonGame } from '../games/SimonGame';
import { FlappyGame } from '../games/FlappyGame';
import { TicTacToeGame } from '../games/TicTacToeGame';
import { SpaceGame } from '../games/SpaceGame';
import { JumperGame } from '../games/JumperGame';
import { RunnerGame } from '../games/RunnerGame';
import { ArrowLeft } from 'lucide-react';

type GameId = 'snake' | 'tetris' | 'minesweeper' | 'breakout' | '2048' | 'memory' | 'simon' | 'flappy' | 'tictactoe' | 'space' | 'jumper' | 'runner';

type GameInfo = {
  id: GameId;
  title: string;
  description: string;
  emoji: string;
  accent: string;
};

const GAMES: GameInfo[] = [
  { id: 'snake', title: 'Snake', description: 'Eat dots, grow longer, don\'t crash.', emoji: '🐍', accent: '#4ade80' },
  { id: 'tetris', title: 'Tetris', description: 'Stack blocks, clear lines, level up.', emoji: '🧱', accent: '#c084fc' },
  { id: 'runner', title: 'Cyber Run', description: 'Dodge obstacles, slide & jump.', emoji: '🏃', accent: '#0ea5e9' },
  { id: 'space', title: 'Space Shooter', description: 'Blast alien ships to survive.', emoji: '🚀', accent: '#38bdf8' },
  { id: 'jumper', title: 'Doodle Jump', description: 'Jump on platforms, reach the sky.', emoji: '🐸', accent: '#a3e635' },
  { id: 'flappy', title: 'Flappy Bird', description: 'Tap to fly through the pipes.', emoji: '🐤', accent: '#fbbf24' },
  { id: '2048', title: '2048', description: 'Slide tiles, merge to reach 2048.', emoji: '🔢', accent: '#edc22e' },
  { id: 'minesweeper', title: 'Minesweeper', description: 'Find all mines without exploding.', emoji: '💣', accent: '#67e8f9' },
  { id: 'breakout', title: 'Breakout', description: 'Bounce ball, smash all bricks.', emoji: '🏓', accent: '#fb923c' },
  { id: 'memory', title: 'Memory Match', description: 'Flip cards, find all matching pairs.', emoji: '🧠', accent: '#f472b6' },
  { id: 'simon', title: 'Simon Says', description: 'Watch the pattern, repeat it back.', emoji: '🎨', accent: '#60a5fa' },
  { id: 'tictactoe', title: 'Tic Tac Toe', description: 'Beat the unbeatable AI. Can you draw?', emoji: '❌', accent: '#a78bfa' },
];

const GameComponent: Record<GameId, React.FC> = {
  snake: SnakeGame,
  tetris: TetrisGame,
  minesweeper: MinesweeperGame,
  breakout: BreakoutGame,
  '2048': Game2048,
  memory: MemoryGame,
  simon: SimonGame,
  flappy: FlappyGame,
  tictactoe: TicTacToeGame,
  space: SpaceGame,
  jumper: JumperGame,
  runner: RunnerGame,
};

export function GamesHub() {
  const [activeGame, setActiveGame] = useState<GameId | null>(null);

  if (activeGame) {
    const Game = GameComponent[activeGame];
    const info = GAMES.find(g => g.id === activeGame)!;

    return (
      <div className="ghost-scrollbar h-full overflow-y-auto bg-transparent p-4 text-slate-100">
        <div className="mb-5 flex items-center gap-3">
          <button
            onClick={() => setActiveGame(null)}
            className="p-2 rounded-full text-white/40 hover:text-white/90 hover:bg-white/10 transition-all"
            title="Back to Arcade"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">Ghost Arcade</p>
            <h3 className="text-lg font-bold uppercase tracking-wider text-white">
              {info.emoji} {info.title}
            </h3>
          </div>
        </div>
        <Game />
      </div>
    );
  }

  return (
    <div className="ghost-scrollbar flex h-full flex-col overflow-y-auto bg-transparent p-6 text-slate-100">
      <div className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">Ghost Arcade</p>
        <h3 className="mt-1 text-2xl font-bold uppercase tracking-wider text-white">Choose a Game</h3>
        <p className="mt-1 text-sm text-white/40 font-light">{GAMES.length} games available • All scores saved locally</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
        {GAMES.map((game) => (
          <button
            key={game.id}
            onClick={() => setActiveGame(game.id)}
            className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/8 bg-white/5 p-5 transition-all duration-200 hover:bg-white/10 hover:border-white/20 hover:scale-[1.04] active:scale-95"
          >
            <span className="text-4xl transition-transform duration-300 group-hover:scale-125 group-hover:drop-shadow-lg">
              {game.emoji}
            </span>
            <span
              className="font-mono text-xs font-bold tracking-wider uppercase"
              style={{ color: game.accent }}
            >
              {game.title}
            </span>
            <span className="text-[11px] text-white/40 text-center font-light leading-tight">{game.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

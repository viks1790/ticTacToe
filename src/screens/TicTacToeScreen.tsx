import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import Board from '../components/Board';
import PlayerSetupModal, { GameConfig } from '../components/PlayerSetupModal';
import ResultModal from '../components/ResultModal';
import { 
  createBoard, 
  makeMove, 
  checkWin, 
  checkDraw, 
  getBestMove, 
  getRandomMove, 
  Player, 
  BoardState 
} from '../services/GameEngine';
import { usePersistentState } from '../hooks/usePersistentState';

const TicTacToeScreen: React.FC = () => {
  // Persistent State
  const [savedNames, setSavedNames] = usePersistentState('playerNames', { player1: '', player2: '' });
  const [scores, setScores] = usePersistentState('scores', { player1: 0, player2: 0, draws: 0 });

  // Game State
  const [board, setBoard] = useState<BoardState>(createBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [winner, setWinner] = useState<Player | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [isCpuThinking, setIsCpuThinking] = useState(false);

  // Modals
  const [setupVisible, setSetupVisible] = useState(true);
  const [resultVisible, setResultVisible] = useState(false);
  const showCancelCta = useRef(false)

  // Initialize game
  const startGame = (config: GameConfig) => {
    setGameConfig(config);
    setSavedNames({ player1: config.player1Name, player2: config.player2Name });
    setScores({ player1: 0, player2: 0, draws: 0 }); // Reset scores on new game
    setSetupVisible(false);
    resetGame(config.startingPlayer);
    showCancelCta.current = false;
  };

  const resetGame = (startingPlayer: Player = 'X') => {
    setBoard(createBoard());
    setCurrentPlayer(startingPlayer);
    setWinner(null);
    setWinningLine(null);
    setIsDraw(false);
    setResultVisible(false);
    setIsCpuThinking(false);
    showCancelCta.current = false;
  };

  const handleCellPress = useCallback((index: number) => {
    if (board[index] || winner || isDraw || isCpuThinking) return;

    const newBoard = makeMove(board, index, currentPlayer);
    setBoard(newBoard);

    const winResult = checkWin(newBoard);
    if (winResult.winner) {
      handleGameEnd(winResult.winner, winResult.winningLine);
    } else if (winResult.isDraw) {
      handleGameEnd(null, null, true);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  }, [board, currentPlayer, winner, isDraw, isCpuThinking]);

  const handleGameEnd = (winnerPlayer: Player | null, line: number[] | null, draw: boolean = false) => {
    setWinner(winnerPlayer);
    setWinningLine(line);
    setIsDraw(draw);
    
    if (winnerPlayer) {
      setScores(prev => ({
        ...prev,
        player1: winnerPlayer === 'X' ? prev.player1 + 1 : prev.player1,
        player2: winnerPlayer === 'O' ? prev.player2 + 1 : prev.player2,
      }));
    } else if (draw) {
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
    }

    setTimeout(() => setResultVisible(true), 500);
  };

  // CPU Turn Effect
  useEffect(() => {
    if (!gameConfig || gameConfig.mode !== 'SINGLE' || winner || isDraw) return;

    if (currentPlayer === 'O') {
      setIsCpuThinking(true);
      const timer = setTimeout(() => {
        const boardCopy = [...board];
        const moveIndex = gameConfig.difficulty === 'HARD' 
          ? getBestMove(boardCopy, 'O') 
          : getRandomMove(boardCopy);
        
        if (moveIndex !== -1) {
          const newBoard = makeMove(board, moveIndex, 'O');
          setBoard(newBoard);
          
          const winResult = checkWin(newBoard);
          if (winResult.winner) {
            handleGameEnd(winResult.winner, winResult.winningLine);
          } else if (winResult.isDraw) {
            handleGameEnd(null, null, true);
          } else {
            setCurrentPlayer('X');
          }
        }
        setIsCpuThinking(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, board, gameConfig, winner, isDraw]);

  const getPlayerName = (player: Player) => {
    if (!gameConfig) return '';
    return player === 'X' ? gameConfig.player1Name : gameConfig.player2Name;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tic Tac Toe</Text>
        <View style={styles.scoreBoard}>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>{gameConfig?.player1Name || 'P1'} (X)</Text>
            <Text style={styles.scoreValue}>{scores.player1}</Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>Draws</Text>
            <Text style={styles.scoreValue}>{scores.draws}</Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>{gameConfig?.player2Name || 'P2'} (O)</Text>
            <Text style={styles.scoreValue}>{scores.player2}</Text>
          </View>
        </View>
      </View>

      <View style={styles.gameArea}>
        <Text style={styles.turnText}>
          {winner 
            ? `${getPlayerName(winner)} Wins!` 
            : isDraw 
              ? "It's a Draw!" 
              : `${getPlayerName(currentPlayer)}'s Turn`}
        </Text>
        
        <Board 
          board={board} 
          onCellPress={handleCellPress} 
          disabled={isCpuThinking || !!winner || isDraw}
          winningLine={winningLine}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.resetBtn} onPress={() => resetGame(gameConfig?.startingPlayer)}>
          <Text style={styles.btnText}>Restart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsBtn} onPress={() => {
          showCancelCta.current = true;
          setSetupVisible(true)          
        }}>
          <Text style={styles.btnText}>New Game</Text>
        </TouchableOpacity>
      </View>

      <PlayerSetupModal 
        visible={setupVisible} 
        onStartGame={startGame}
        initialNames={savedNames}
        showCancelCta={showCancelCta.current}
        onCloseModel={()=>{
          showCancelCta.current = false;
          setSetupVisible(false);
        }}
      />

      <ResultModal 
        visible={resultVisible}
        winner={winner}
        winnerName={winner ? getPlayerName(winner) : ''}
        isDraw={isDraw}
        onRestart={() => resetGame(gameConfig?.startingPlayer)}
        onNewGame={() => {
          showCancelCta.current = true;
          setResultVisible(false);
          setSetupVisible(true);
        }}        
      />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height:'100%',
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    alignItems: 'center',
    zIndex: 10,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 10,
    color: '#333',
  },
  scoreBoard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  scoreItem: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 70,
  },
  scoreLabel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 2,
    fontWeight: '600',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  gameArea: {      
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20
  },
  turnText: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 30,
    color: '#444',
  },
  footer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    position:'absolute',
    bottom:0,
    left:0,
    right:0,
    zIndex:10,
    elevation:4
  },
  resetBtn: {
    backgroundColor: '#FF5252',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginRight: 15,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsBtn: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default TicTacToeScreen;

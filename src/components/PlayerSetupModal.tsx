import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { Player } from '../services/GameEngine';

interface PlayerSetupModalProps {
  visible: boolean;
  onStartGame: (config: GameConfig) => void;
  initialNames: { player1: string; player2: string };
  onCloseModel: () => void
  showCancelCta: boolean
}

export interface GameConfig {
  mode: 'SINGLE' | 'MULTI';
  difficulty: 'EASY' | 'HARD';
  player1Name: string;
  player2Name: string; // In single player, this is CPU name
  startingPlayer: Player;
  
}

const PlayerSetupModal: React.FC<PlayerSetupModalProps> = ({ visible, onStartGame, initialNames, onCloseModel, showCancelCta= false }) => {
  const [mode, setMode] = useState<'SINGLE' | 'MULTI'>('SINGLE');
  const [difficulty, setDifficulty] = useState<'EASY' | 'HARD'>('HARD');
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [startingPlayer, setStartingPlayer] = useState<Player>('X');

  useEffect(() => {
    if (visible) {
      setPlayer1Name(initialNames.player1 || 'Player 1');
      setPlayer2Name(initialNames.player2 || 'Player 2');
    }
  }, [visible, initialNames]);

  const handleStart = () => {
    onStartGame({
      mode,
      difficulty,
      player1Name: player1Name.trim() || 'Player 1',
      player2Name: mode === 'SINGLE' ? 'CPU' : (player2Name.trim() || 'Player 2'),
      startingPlayer,
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>Tic Tac Toe</Text>

          <View style={styles.section}>
            <Text style={styles.label}>Game Mode</Text>
            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.optionBtn, mode === 'SINGLE' && styles.selectedOption]}
                onPress={() => setMode('SINGLE')}
              >
                <Text style={[styles.optionText, mode === 'SINGLE' && styles.selectedOptionText]}>1 Player</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionBtn, mode === 'MULTI' && styles.selectedOption]}
                onPress={() => setMode('MULTI')}
              >
                <Text style={[styles.optionText, mode === 'MULTI' && styles.selectedOptionText]}>2 Players</Text>
              </TouchableOpacity>
            </View>
          </View>

          {mode === 'SINGLE' && (
            <View style={styles.section}>
              <Text style={styles.label}>Difficulty</Text>
              <View style={styles.row}>
                <TouchableOpacity
                  style={[styles.optionBtn, difficulty === 'EASY' && styles.selectedOption]}
                  onPress={() => setDifficulty('EASY')}
                >
                  <Text style={[styles.optionText, difficulty === 'EASY' && styles.selectedOptionText]}>Easy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.optionBtn, difficulty === 'HARD' && styles.selectedOption]}
                  onPress={() => setDifficulty('HARD')}
                >
                  <Text style={[styles.optionText, difficulty === 'HARD' && styles.selectedOptionText]}>Hard</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.label}>Player 1 Name (X)</Text>
            <TextInput
              style={styles.input}
              value={player1Name}
              onChangeText={setPlayer1Name}
              placeholder="Enter Name"
            />
          </View>

          {mode === 'MULTI' && (
            <View style={styles.section}>
              <Text style={styles.label}>Player 2 Name (O)</Text>
              <TextInput
                style={styles.input}
                value={player2Name}
                onChangeText={setPlayer2Name}
                placeholder="Enter Name"
              />
            </View>
          )}

          <TouchableOpacity style={styles.startBtn} onPress={handleStart}>
            <Text style={styles.startBtnText}>Start Game</Text>
          </TouchableOpacity>

          {showCancelCta &&<TouchableOpacity style={styles.startBtn} onPress={onCloseModel}>
            <Text style={styles.startBtnText}>Cancel</Text>
          </TouchableOpacity>}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionBtn: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  selectedOption: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  optionText: {
    color: '#333',
  },
  selectedOptionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  startBtn: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  startBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PlayerSetupModal;

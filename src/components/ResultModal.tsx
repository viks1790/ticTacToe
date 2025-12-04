import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { Player } from '../services/GameEngine';

interface ResultModalProps {
  visible: boolean;
  winner: Player | null;
  winnerName: string;
  isDraw: boolean;
  onRestart: () => void;
  onNewGame: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ visible, winner, winnerName, isDraw, onRestart, onNewGame }) => {
  
  const handleShare = async () => {
    try {
      const message = isDraw 
        ? "It was a draw in Tic-Tac-Toe!" 
        : `${winnerName} won the game of Tic-Tac-Toe!`;
      
      await Share.share({
        message: message,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>
            {isDraw ? "It's a Draw!" : "Game Over"}
          </Text>
          
          <Text style={styles.resultText}>
            {isDraw ? "No one won this round." : `${winnerName} Wins!`}
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.btn, styles.restartBtn]} onPress={onRestart}>
              <Text style={styles.btnText}>Rematch</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.btn, styles.newGameBtn]} onPress={onNewGame}>
              <Text style={[styles.btnText, styles.secondaryBtnText]}>New Game</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.btn, styles.shareBtn]} onPress={handleShare}>
              <Text style={[styles.btnText, styles.secondaryBtnText]}>Share Result</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  resultText: {
    fontSize: 20,
    marginBottom: 30,
    color: '#555',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
  },
  btn: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  restartBtn: {
    backgroundColor: '#2196F3',
  },
  newGameBtn: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  shareBtn: {
    backgroundColor: 'white',
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#999',
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryBtnText: {
    color: '#2196F3',
  },
});

export default ResultModal;

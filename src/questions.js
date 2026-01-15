import React, { useState, useEffect } from 'react';
import './App.css';
import { getRandomQuestions } from './questions';

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState({ show: false, correct: false, message: '' });
  const [character, setCharacter] = useState('🚶');
  const [gameComplete, setGameComplete] = useState(false);

  // Khởi tạo câu hỏi random khi component mount
  useEffect(() => {
    setQuestions(getRandomQuestions(10));
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? (currentQuestionIndex / questions.length) * 100 : 0;

  const handleAnswerClick = (index) => {
    if (answered) return;

    setAnswered(true);
    setSelectedAnswer(index);

    const isCorrect = currentQuestion.answers[index].correct;

    if (isCorrect) {
      setScore(score + 10);
      setCorrectCount(correctCount + 1);
      setFeedback({
        show: true,
        correct: true,
        message: '✅ Chính xác! Tuyệt vời!'
      });
      setCharacter('🎉');
    } else {
      setFeedback({
        show: true,
        correct: false,
        message: '❌ Sai rồi! Hãy thử lại lần sau.'
      });
      setCharacter('😢');
    }

    setTimeout(() => {
      setCharacter('🚶');
    }, 1500);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 >= questions.length) {
      setGameComplete(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswered(false);
      setSelectedAnswer(null);
      setFeedback({ show: false, correct: false, message: '' });
    }
  };

  const handleRestart = () => {
    setQuestions(getRandomQuestions(10));
    setCurrentQuestionIndex(0);
    setScore(0);
    setCorrectCount(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setFeedback({ show: false, correct: false, message: '' });
    setCharacter('🚶');
    setGameComplete(false);
  };

  if (questions.length === 0) {
    return (
      <div className="game-container">
        <div className="game-header">
          <h1>🎮 Skywalk Learning Game</h1>
          <p>Đang tải câu hỏi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>🎮 Skywalk Learning Game</h1>
        <p>Trả lời đúng câu hỏi để tiến lên!</p>
        <div className="score-board">
          <div className="score-item">
            <span>Điểm: {score}</span>
          </div>
          <div className="score-item">
            <span>Câu hỏi: {currentQuestionIndex + 1}/{questions.length}</span>
          </div>
          <div className="score-item">
            <span>Đúng: {correctCount}</span>
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {!gameComplete ? (
        <div className="game-canvas">
          <div className="character">{character}</div>
          
          <div className="question-box">
            <div className="question-text">{currentQuestion.question}</div>
            <div className="answers">
              {currentQuestion.answers.map((answer, index) => (
                <button
                  key={index}
                  className={`answer-btn ${
                    answered && answer.correct ? 'correct' : ''
                  } ${
                    answered && selectedAnswer === index && !answer.correct ? 'wrong' : ''
                  }`}
                  onClick={() => handleAnswerClick(index)}
                  disabled={answered}
                >
                  {answer.text}
                </button>
              ))}
            </div>
            {feedback.show && (
              <div className={`feedback show ${feedback.correct ? 'correct' : 'wrong'}`}>
                {feedback.message}
              </div>
            )}
          </div>

          <button
            className="next-btn"
            onClick={handleNextQuestion}
            disabled={!answered}
          >
            Tiếp theo →
          </button>
        </div>
      ) : (
        <div className="game-complete">
          <h2>🎉 Chúc mừng!</h2>
          <p>Bạn đã hoàn thành trò chơi!</p>
          <p>Điểm số: {score}</p>
          <p>Số câu đúng: {correctCount}/{questions.length}</p>
          <button className="restart-btn" onClick={handleRestart}>
            Chơi lại
          </button>
        </div>
      )}
    </div>
  );
}

export default App;

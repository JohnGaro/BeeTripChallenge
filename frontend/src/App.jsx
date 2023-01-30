import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [players, setPlayers] = useState([]);
  const [pointsGame, setPointsGame] = useState([]);
  const [gameStat, setGameStat] = useState([]);
  const handlePlayer1Level = (e) => {
    if (e.target.value <= 10) {
      setPlayers({ ...players, player1Level: e.target.value });
    }
  };

  const handlePlayer2Level = (e) => {
    if (e.target.value <= 10) {
      setPlayers({ ...players, player2Level: e.target.value });
    }
  };

  const handleStartGame = () => {
    pointsGame.splice(0, 150);
    let pointPlayer1 = 0;
    let pointPlayer2 = 0;
    for (let i = 1; i < 151; i += 1) {
      const random = Math.floor(Math.random() * 100);
      if (random < 50 + (players.player1Level * 2 - players.player2Level * 2)) {
        pointsGame.push({
          point: i,
          wonBy: players.player1Name,
        });
      } else {
        pointsGame.push({
          point: i,
          wonBy: players.player2Name,
        });
      }
    }
    setPointsGame([...pointsGame]);
    pointsGame.forEach((point) => {
      if (point.includes(`${players.player1Name}`)) {
        pointPlayer1 += 1;
      } else {
        pointPlayer2 += 1;
      }
    });
    setPlayers({
      ...players,
      player1Point: pointPlayer1,
      player2Point: pointPlayer2,
    });
  };

  function getWinnerByPoints(matchPoints, player1, player2) {
    const tennisPoint = [0, 15, 30, 40, "AV", "W"];
    const tennisPointWithoutAdvantage = [0, 15, 30, 40, "W"];
    let currentGame = {
      [player1]: tennisPoint[0],
      [player2]: tennisPoint[0],
    };
    let currentSet = { [player1]: 0, [player2]: 0 };
    let setWinner = { [player1]: 0, [player2]: 0 };
    let winner = "";

    const advantage = () => {
      if (
        (currentGame[player1] === 40 && currentGame[player2] === 40) ||
        currentGame[player1] === "AV" ||
        currentGame[player2] === "AV"
      ) {
        return true;
      }
      return false;
    };

    const tieBreak = () => {
      if (currentSet[player1] === 6 && currentSet[player2] === 6) {
        return true;
      }
      return false;
    };

    const winnerGameByAdvantage = (point) => {
      const winnerPoint = point.wonBy;
      const looserpoint = point.wonBy === player1 ? player2 : player1;
      if (tennisPoint.indexOf(currentGame[winnerPoint]) === 4) {
        currentGame = {
          ...currentGame,
          [point.wonBy]: tennisPoint[5],
        };
      } else if (tennisPoint.indexOf(currentGame[point.wonBy]) === 3) {
        currentGame = {
          ...currentGame,
          [winnerPoint]: tennisPoint[4],
          [looserpoint]: tennisPoint[3],
        };
      }
      if (currentGame[winnerPoint] === "W") {
        currentSet = {
          ...currentSet,
          [winnerPoint]: currentSet[winnerPoint] + 1,
        };
      }
      console.warn("currentGame adv", currentGame);
    };

    const winnerGameByTieBreak = (point) => {
      currentGame = {
        ...currentGame,
        [player1]: 0,
        [player2]: 0,
      };
      const winnerPoint = point.wonBy;
      const looserpoint = point.wonBy === player1 ? player2 : player1;
      currentGame = {
        ...currentGame,
        [winnerPoint]: currentGame[winnerPoint] + 1,
      };
      if (
        currentGame[winnerPoint] >= 7 &&
        currentGame[winnerPoint] - 2 >= currentGame[looserpoint]
      ) {
        currentGame = {
          ...currentGame,
          [point.wonBy]: tennisPoint[5],
        };
      }
      if (
        currentGame[winnerPoint] === "W" &&
        currentGame[winnerPoint] === 6 &&
        !tieBreak() &&
        currentGame[winnerPoint] - 1 === currentGame[looserpoint]
      ) {
        setWinner = {
          ...setWinner,
          [winnerPoint]: setWinner[winnerPoint] + 1,
        };
      } else if (
        currentGame[winnerPoint] === "W" &&
        !tieBreak() &&
        currentGame[winnerPoint] - 1 <= currentGame[looserpoint]
      ) {
        currentSet = {
          ...currentSet,
          [winnerPoint]: currentSet[winnerPoint] + 1,
        };
      }
      console.warn("currentGame tieBreak", currentGame);
    };
    for (const point of matchPoints) {
      if (setWinner[player1] - setWinner[player2] === 3) {
        winner = player1;
      } else if (setWinner[player2] - setWinner[player1] === 3) {
        winner = player2;
      }
      if (
        !tieBreak() &&
        !advantage() &&
        currentGame[player1] <= 40 &&
        currentGame[player2] <= 40
      ) {
        currentGame = {
          ...currentGame,
          [point.wonBy]:
            tennisPointWithoutAdvantage[
              tennisPointWithoutAdvantage.indexOf(currentGame[point.wonBy]) + 1
            ],
        };
        console.warn("currentGame", currentGame);
        if (currentGame[point.wonBy] === "W" && !tieBreak()) {
          currentSet = {
            ...currentSet,
            [point.wonBy]: currentSet[point.wonBy] + 1,
          };
          currentGame = {
            ...currentGame,
            [player1]: tennisPoint[0],
            [player2]: tennisPoint[0],
          };
          if (currentSet[point.wonBy] === 6) {
            setWinner = {
              ...setWinner,
              [point.wonBy]: setWinner[point.wonBy] + 1,
            };
            currentSet = {
              ...currentSet,
              [player1]: 0,
              [player2]: 0,
            };
          }
        }
      } else if (advantage() === true && tieBreak() === false) {
        winnerGameByAdvantage(point);
        if (currentGame[point.wonBy] === "W") {
          currentGame = {
            ...currentGame,
            [player1]: tennisPoint[0],
            [player2]: tennisPoint[0],
          };
          currentGame = {
            ...currentGame,
            [player1]: tennisPoint[0],
            [player2]: tennisPoint[0],
          };
          if (currentSet[point.wonBy] === 6) {
            setWinner = {
              ...setWinner,
              [point.wonBy]: setWinner[point.wonBy] + 1,
            };
            currentSet = {
              ...currentSet,
              [player1]: 0,
              [player2]: 0,
            };
          }
        }
      } else if (tieBreak()) {
        console.warn("tieBreak", tieBreak());
        winnerGameByTieBreak(point);
      }
    }
    setGameStat({
      currentGame,
      currentSet,
      setWinner,
      winner,
    });
  }

  const handleSubmitResult = (e) => {
    e.preventDefault();
    getWinnerByPoints(pointsGame, players.player1Name, players.player2Name);
  };

  useEffect(() => {
    getWinnerByPoints(pointsGame, players.player1Name, players.player2Name);
  }, [pointsGame]);

  console.warn("gameStat", gameStat.currentGame[players.player1Name]);
  console.warn("gameStat2", gameStat.currentGame[players.player2Name]);

  return (
    <div className="App">
      <h1>Tennis Game!</h1>
      <div className="containerForm">
        <form className="form">
          <label htmlFor="text">Player 1</label>
          <input
            type="text"
            name="player1"
            placeholder="Name of player 1"
            value={players.player1Name}
            onChange={(e) => {
              setPlayers({ ...players, player1Name: e.target.value });
            }}
          />
          <label htmlFor="text">Level player 1</label>
          <input
            type="number"
            name="levelPlayer1"
            placeholder="Level of player 1 (Only 1 to 10)"
            value={players.player1Level}
            onChange={handlePlayer1Level}
          />
          <label htmlFor="text">Player 2</label>
          <input
            type="text"
            name="player2"
            placeholder="Name of player 2"
            value={players.player2Name}
            onChange={(e) => {
              setPlayers({ ...players, player2Name: e.target.value });
            }}
          />
          <label htmlFor="text">Level player 2</label>
          <input
            type="number"
            name="levelPlayer2"
            placeholder="Level of player 2 (Only 1 to 10)"
            value={players.player2Level}
            onChange={handlePlayer2Level}
          />
          <button type="button" onClick={handleStartGame}>
            Start Game
          </button>
          <p>Resultat par point :</p>
          {pointsGame.length > 0 ? (
            <ul>
              {pointsGame.map((match) => (
                <li key={match.id}>
                  Point: {match.point} remporté par: {match.wonBy}
                </li>
              ))}
            </ul>
          ) : null}
          <button type="submit" onClick={(e) => handleSubmitResult(e)}>
            Give me match details
          </button>
        </form>
      </div>
      <p>Current Game:</p>
      {gameStat ? (
        <>
          <div>
            {players.player1Name}
            {": "}
            {gameStat.currentGame[players.player1Name]}
          </div>
          <div>
            {players.player2Name}
            {": "}
            {gameStat.currentGame[players.player2Name]}
          </div>
        </>
      ) : null}
      <p>Current Set:</p>
      {gameStat ? (
        <>
          <div>
            {players.player1Name}
            {": "}
            {gameStat.currentSet[players.player1Name]}
          </div>
          <div>
            {players.player2Name}
            {": "}
            {gameStat.currentSet[players.player2Name]}
          </div>
        </>
      ) : null}{" "}
      <p>Number of Set win:</p>
      {gameStat ? (
        <>
          <div>
            {players.player1Name}
            {": "}
            {gameStat.setWinner[players.player1Name]}
          </div>
          <div>
            {players.player2Name}
            {": "}
            {gameStat.setWinner[players.player2Name]}
          </div>
        </>
      ) : null}{" "}
      <p>Winner of the match :</p>
      {gameStat.winner ? <div>{gameStat.winner}</div> : null}{" "}
    </div>
  );
}

export default App;

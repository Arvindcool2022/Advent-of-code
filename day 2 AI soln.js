const fsp = require('fs/promises');

(async () => {
  const readFile = await fsp.readFile('./day 2.txt', { encoding: 'utf-8' });
  /**
   * 'Game 1': [
   *   [ [7, green], [Array], [Array] ],
   *   [ [Array], [Array] ],
   *   [ [Array], [Array], [Array] ]
   * ],
   */
  const games = parseGames(readFile);

  /**
   * 'Game 1': [
   *   { green: 7, red: 14, blue: 5 },
   *   { red: 8, green: 4 },
   *   { green: 6, red: 18, blue: 9 }
   * ],
   */
  const gameData = transformGameData(games);

  part1(gameData);
  part2(gameData);
})();

function parseGames(data) {
  return data.split('\r\n').reduce((acc, cur) => {
    const [key, content] = cur.split(':');
    acc[key.trim()] = content
      .split(';')
      .map(group =>
        group.split(',').map(pair => pair.split(' ').filter(Boolean))
      );
    return acc;
  }, {});
}

function transformGameData(games) {
  const gameData = {};
  for (const key in games) {
    gameData[key] = games[key].map(group =>
      group.reduce((acc, [value, color]) => {
        acc[color] = (acc[color] ?? 0) + Number(value);
        return acc;
      }, {})
    );
  }
  return gameData;
}

function part1(data) {
  const thresholds = { red: 12, green: 13, blue: 14 };
  const passedGames = [];

  for (const game in data) {
    const gamePassed = data[game].every(round =>
      Object.entries(round).every(
        ([color, value]) => value <= thresholds[color]
      )
    );
    if (gamePassed) passedGames.push(game.split(' ')[1]);
  }

  const total = passedGames.reduce(
    (sum, gameNumber) => sum + Number(gameNumber),
    0
  );
  console.log(total);
}

function part2(data) {
  const maxProducts = Object.values(data).map(rounds => {
    const maxValues = { red: 0, green: 0, blue: 0 };

    rounds.forEach(round => {
      Object.entries(round).forEach(([color, value]) => {
        if (value > maxValues[color]) maxValues[color] = value;
      });
    });

    return Object.values(maxValues).reduce((product, val) => product * val, 1);
  });

  const totalProductSum = maxProducts.reduce(
    (sum, product) => sum + product,
    0
  );
  console.log(totalProductSum);
}

const fsp = require('fs/promises');

(async () => {
  const readFile = await fsp.readFile('./ex03.txt', { encoding: 'utf-8' });

  /**
     'Game 1': [
    [ [7, green], [Array], [Array] ],
    [ [Array], [Array] ],
    [ [Array], [Array], [Array] ]
  ],
   */
  const games = readFile.split('\r\n').reduce((acc, cur) => {
    const [key, content] = cur.split(':');
    acc[key.trim()] = content
      .split(';')
      .map(x => x.split(',').map(x => x.split(' ').filter(x => x)));
    return acc;
  }, {});

  //  'Game 1': { green: 17, red: 40, blue: 14 }, //! Data format
  const gameData1 = {};
  for (const key in games) {
    const element = games[key];
    gameData1[key] = element.flat().reduce((acc, cv) => {
      acc[cv[1]] = (acc[cv[1]] ?? 0) + Number(cv[0]);
      return acc;
    }, {});
  }

  /** //! Data format
'Game 1': [
        { green: 7, red: 14, blue: 5 },
        { red: 8, green: 4 },
        { green: 6, red: 18, blue: 9 }
    ],
   */

  const gameData2 = {};
  for (const key in games) {
    const element = games[key];
    gameData2[key] = element.reduce((acc, cv, i) => {
      acc[i] = cv.reduce((a, c) => {
        a[c[1]] = (a[c[1]] ?? 0) + Number(c[0]);
        return a;
      }, {});
      return acc;
    }, []);
  }
  possiblegames1(gameData2);
})();

function possiblegames1(data) {
  const parameter = { red: 12, green: 13, blue: 14 };
  const passedGames = [];
  for (const key in data) {
    let testPassed = true;
    const element = data[key];
    for (let i = 0; i < element.length; ++i) {
      const obj = element[i];
      for (const key in obj) {
        if (obj[key] > parameter[key]) testPassed = false;
      }
    }
    if (testPassed) passedGames.push(key.split(' ')[1]);
  }
  console.log(passedGames.reduce((a, c) => a + Number(c), 0));
}

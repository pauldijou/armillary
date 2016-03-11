import { aStar } from '../src';
import { parseMaze, mazeNeighbors } from './utils';

function testMaze(size, maze, expectedCause) {
  const { start, end, nodes } = parseMaze(maze);
  const { success, cause, path, distance } = aStar({
    start,
    end,
    neighbors: mazeNeighbors(nodes),
    distance: (from, to) => to.cost,
    heuristic: (from, to) => Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2))
  });
  expect(expectedCause).toEqual(cause);
  if (size !== path.length) {
    console.log(path);
  }
  expect(size).toEqual(path.length);
}

describe('aStar', function () {
  it('should solve super duber easy mazes', function () {
    testMaze(3, [
      's e',
    ]);
    testMaze(3, [
      's',
      ' ',
      'e',
    ]);
    testMaze(3, [
      's ',
      '#e',
    ]);
  });

  it('shouldnt solve an impossible maze', function () {
    testMaze(0, [
      's#e',
    ], 'noPath');
  });

  it('should solve a one way maze', function () {
    testMaze(62, [
      's#                ',
      ' ######    ##     ',
      ' #    #   ##  ### ',
      ' #  # #   #  #    ',
      '    # ##### #    #',
      '##### #     # ####',
      '      #    #  #   ',
      '  ######## # #####',
      '           #     e',
    ]);
  });

  it('should solve a tricky maze', function () {
    testMaze(13, [
      '       ',
      ' ####  ',
      ' #  #  ',
      's   # e',
    ]);
  })
});

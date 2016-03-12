import { aStar } from '../src';
import { parseMaze, mazeNeighbors } from './utils';

function testMaze(totalLength, totalDistance, maze, expectedCause) {
  const { start, end, nodes } = parseMaze(maze);
  const { success, cause, path, distance } = aStar({
    start,
    end,
    neighbors: mazeNeighbors(nodes),
    distance: (from, to) => to.cost,
    heuristic: (from, to) => Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2))
  });
  expect(expectedCause).toEqual(cause);
  if (totalLength !== path.length || totalDistance !== distance) {
    console.log(`Expected ${totalDistance} in ${totalLength} cells, got ${distance} in ${path.length} cells.`)
    console.log(path);
  }
  expect(totalLength).toEqual(path.length);
  expect(totalDistance).toEqual(distance);
}

describe('aStar', function () {
  it('should solve super duber easy mazes', function () {
    testMaze(3, 2, [
      's e',
    ]);
    testMaze(3, 2, [
      's',
      ' ',
      'e',
    ]);
    testMaze(3, 2, [
      's ',
      '#e',
    ]);
  });

  it('shouldnt solve an impossible maze', function () {
    testMaze(0, 0, [
      's#e',
    ], 'noPath');
  });

  it('should solve a one way maze', function () {
    testMaze(62, 61, [
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
    testMaze(13, 12, [
      '       ',
      ' ####  ',
      ' #  #  ',
      's   # e',
    ]);
  });

  it('should favor shortest distances', function () {
    testMaze(8, 8, [
      's   ',
      '    ',
      '952 ',
      'e   ',
    ]);
  });
});

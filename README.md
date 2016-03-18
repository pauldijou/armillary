# armillary

Pathfinding the easy way.

## Install

```
npm install armillary --save
```

## A*

```javascript
import { aStar } from 'armillary';

const { success, cause, path, distance } = aStar(/* options */);
```

### Options

- **start**: node where to start the path.
- **end**: node where to end the path.
- **neighbors**: function taking one node and returning an array of all its neighbor nodes.
- **[heuristic]**: function taking two nodes and returning an estimation of the distance between them. Default to a function always returning `0`.
- **[distance]**: a function taking two neighbor nodes and returning the distance to move from the first one to the second data. Default to a function always returning `1`.
- **[data]**: anything. If provided, it will be used as the third argument of the `distance` function.
- **[maxDistance]**: do not reach nodes which are farther than `maxDistance` from the `start`. Default to `Infinity`.
- **[timeout]**: if computing the path takes more than that time in millseconds, fail the search. Default to `false` (which mean no timeout).
- **[on]**: object where keys are event names and values are functions to handle them. See below.

## Events

- **added**: a new node has been reached.
- **updated**: we updated the node after finding a better path to reach it.
- **closed**: the node is now close and will never be updated again, we should have already find the best path to reach it.

### Result

- **success**: true if a path was found, false otherwise
- **cause**: if failed, reason why it failed. Can be `timeout` or `noPath`
- **path**: an array of nodes from the start node to the end node if successful
- **distance**: number representing the total distance from start to end

### Sample

```javascript
import { aStar } from 'armillary';

// Let's create a 10x10 grid of nodes with random costs to access one given node, 1 +/- 0.5.
const grid = [];
for (let x = 0; x < 10; ++x) {
  grid[x] = [];
  for (let y = 0; y < 10) {
    grid[x][y] = { x, y, cost: 0.5 + Math.random() };
  }
}

// Neighbors are the squares at the top, bottom, left and right of the current one
// Don't forget to remove non-existing nodes
function neighbors(node) {
  const { x, y } = node;
  return [
    grid[x + 1, y + 0],
    grid[x - 1, y + 0],
    grid[x + 0, y + 1],
    grid[x + 0, y - 1]
  ].filter(n => n);
}

// Heuristic is the direct distance between the nodes
function heuristic(from, to) {
  return Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
}

// Distance will be the cost of the target node here
function distance(from, to) {
  return to.cost;
}

// Let's do it!
const { success, cause, path, distance } = aStar({
  start: grid[0][0],
  end: grid[9][9],
  neighbors,
  heuristic,
  distance
});
```

## License

This software is licensed under the Apache 2 license, quoted below.

Copyright 2016 Paul Dijou ([http://pauldijou.fr](http://pauldijou.fr)).

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this project except in compliance with the License. You may obtain a copy of the License at [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0).

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

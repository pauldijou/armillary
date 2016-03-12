// import * as HayStack from './hayStack.js';
import Heap from 'heapster';
import { formatResult } from './utils';

function zero() { return 0; }
function one() { return 1; }

export default function aStar({
  start, // Node
  end, // Node
  neighbors, // Node -> Array[Node]
  heuristic = zero, // (from: Node, to: Node) -> Number
  weight = 1, // Number
  data, // Any
  distance = one, // (from: Node, to: Node, data: Any) -> Number | false
  maxDistance = Infinity, // Number
  timeout = false, // Number | Boolean
  on = {}, // Object({ added, updated, closed })
}) {
  if (!start) { throw new Error('You need to specify a starting node'); }
  if (!end) { throw new Error('You need to specify an ending node'); }
  if (!neighbors) { throw new Error('You need to specify a [neighbors] function'); }

  const map = new Map();
  const nodes = new Heap((a, b) => b.rank - a.rank, { indexed: true });

  // Init lists
  const node = { node: start, distance: 0 };
  map.set(start, node);
  nodes.push(node);

  const startTime = new Date();
  let bestNode = node;

  // Let's start searching
  while(!nodes.isEmpty()) {
    // If timeout, we will return our best node
    if (timeout && (new Date() - startTime > timeout)) {
      return formatResult(bestNode, 'timeout');
    }

    const current = nodes.pop();
    current.closed = true;
    if (on.closed) {
      on.closed(current);
    }

    // We did it \o/
    if (current.node === end) {
      return formatResult(current);
    }

    const nexts = neighbors(current.node);

    for (let i = 0, l = nexts.length; i < l; ++i) {
      let neighbor = map.get(nexts[i]);
      if (!neighbor) {
        neighbor = { node: nexts[i] };
        map.set(neighbor.node, neighbor);
      }

      if (neighbor.closed) {
        // We are already done with this node, let's move to the next one
        continue;
      }

      // The distance to move from the current position to the next one
      const goDistance = distance(current.node, neighbor.node, data);

      if (typeof goDistance !== 'number') {
        // The neighbor is not reachable from the current node, let's skip it
        continue;
      }

      // The distance to move from the start to the next position
      const totalDistance = current.distance + goDistance;

      if (totalDistance > neighbor.distance) {
        // We already find a shortest way so no need to go further
        continue;
      }

      if (totalDistance > maxDistance) {
        // It's too expensive to reach the neighbor node, at least using this way
        continue;
      }

      const isNew = neighbor.heuristic === undefined;
      if (isNew) {
        // Init once and for all the heuristic
        neighbor.heuristic = weight * heuristic(neighbor.node, end);
      }

      neighbor.rank = totalDistance + neighbor.heuristic;
      neighbor.parent = current;
      neighbor.distance = totalDistance;

      // For a heap, it's totally different to add a new element
      // compared to updating the rank of an existing one
      if (isNew) {
        nodes.push(neighbor);
        if (on.added) {
          on.added(neighbor);
        }
      } else {
        nodes.update(neighbor);
        if (on.updated) {
          on.updated(neighbor);
        }
      }
    }
  }

  // Looks like we search through all nodes and didn't find the end
  return formatResult(undefined, 'noPath');
}

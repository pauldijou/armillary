export default class HayStack {
  constructor (compare) {
    this.needles = [];
    this.compare = compare || function (a, b) { return a === b ? 0 : (a < b ? -1 : 1); };
  }

  // O( 1 )
  length () {
    return this.needles.length;
  }

  // O( 1 )
  isEmpty () {
    return this.length() === 0;
  }

  // O( log(n) )
  indexOf (needle, start, end) {
    start = start || 0;
    end = end || this.length();
    const pivot = parseInt(start + (end - start) / 2, 10);

    if(end - start <= 1 || this.compare(this.needles[pivot], needle) === 0) return pivot;

    if(this.compare(this.needles[pivot], needle) < 0) {
      return this.indexOf(needle, pivot, end);
    } else{
      return this.indexOf(needle, start, pivot);
    }
  }

  // O( n + log(n) )
  add (needle) {
    this.needles.splice(this.indexOf(needle) + 1, 0, needle);
    return this;
  }

  // O( n + log(n) )
  remove (needle) {
    this.needles.splice(this.indexOf(needle), 1);
    return this;
  }

  // O( 2n + 2 log(n) )
  update (needle, update, opts) {
    this.remove(needle);
    update(needle, opts);
    this.add(needle);
    return this;
  }

  // O( 1 )
  pop () {
    return this.needles.pop();
  }

  // O( 1 )
  shift () {
    return this.needles.shift();
  }

  // O( 1 )
  get (index) {
    return this.needles[index];
  }
}

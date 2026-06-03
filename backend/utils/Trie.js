class TrieNode {
  constructor() {
    this.children = {};
    this.isEnd = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let node = this.root;
    for (const char of word.toLowerCase()) {
      if (!node.children[char]) node.children[char] = new TrieNode();
      node = node.children[char];
    }
    node.isEnd = true;
  }

  // DFS to collect all words from a node
  _collectAll(node, prefix, results, limit) {
    if (results.length >= limit) return;
    if (node.isEnd) results.push(prefix);
    for (const char of Object.keys(node.children)) {
      this._collectAll(node.children[char], prefix + char, results, limit);
    }
  }

  search(prefix, limit = 5) {
    let node = this.root;
    for (const char of prefix.toLowerCase()) {
      if (!node.children[char]) return [];
      node = node.children[char];
    }
    const results = [];
    this._collectAll(node, prefix.toLowerCase(), results, limit);
    return results;
  }
}

module.exports = Trie;
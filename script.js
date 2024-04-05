 const prettyPrint = (node, prefix = "", isLeft = true) => {
   if (node === null) {
     return;
   }
   if (node.right !== null) {
     prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
   }
   console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
   if (node.left !== null) {
     prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
   }
 };

function buildTree(array) {

    if (!array) throw Error("Must pass an array");

    const cleanedArray = array.sort((a, b) => a - b)
        .filter((item, index, self) => {
            return self.indexOf(item) === index;
        });
    
    if (cleanedArray.length === 0) return null;

    let start = 0;
    let end = cleanedArray.length - 1
    let mid = Math.floor((start + end) / 2);

    if (start > end) {
        return null
    }

    let node = new Node(cleanedArray[mid]);
    let leftArray = cleanedArray.slice(0, mid);
    let rightArray = cleanedArray.slice(mid + 1);

    node.left = buildTree(leftArray);
    node.right = buildTree(rightArray);

    return node;

}

class Node {
    
    constructor(data) {
        this.data = data,
        this.left = null,
        this.right = null
    }

}

class Tree {

    constructor(array) {
        this.root = buildTree(array);
    }

    insert(value) {
        if (!this.root) {
            this.root = new Node(value);
            return;
        }

        this._insertNode(this.root, value);
    }

    _insertNode(node, value) {

        if (value < node.data) {
            if (node.left === null) {
                node.left = new Node(value);
            } else {
                this._insertNode(node.left, value);
            }
        } else if (value > node.data) {
            if (node.right === null) {
                node.right = new Node(value);
            } else {
                this._insertNode(node.right, value);
            }
        }

    }

    deleteItem(value) {
        this.root = this._deleteNode(this.root, value);
    }


    _deleteNode(root, value) {
        if (root === null) {
            return root;
        }

        if (value < root.data) {
            root.left = this._deleteNode(root.left, value);
            return root;
        } else if (value > root.data) {
            root.right = this._deleteNode(root.right, value);
            return root;
        }

        if (root.left === null) {
            root = root.right;
            return root;
        } else if (root.right === null) {
            root = root.left;
            return root;
        }

        else {
            let succParent = root;
            let successor = root.right;

            while (successor.left !== null) {
                succParent = successor;
                successor = successor.left;
            }

            if (succParent !== root) {
                succParent.left = successor.right;
            } else {
                succParent.right = successor.right;
            }

            root.data = successor.data;

            return root;

        }


    }

    find(value) {
       return this._findNode(this.root, value);
    }

    _findNode(root, value) {
      
        if (root.data === value) {
            return root;
        }

        if (value < root.data) {
            return this._findNode(root.left, value);
        } else if (value > root.data) {
            return this._findNode(root.right, value);
        }
    }

    levelOrder(callback) {
        let result = [];
        let queue = [this.root];


        while (queue.length > 0) {
            let current = queue.shift();

            !callback ? result.push(current.data) : result.push(callback(current.data));

            if (current.right) {
                queue.push(current.right);
            }
            if (current.left) {
                queue.push(current.left);
            }
            
        }

        return result

    }
    
    preOrder(callback, root = this.root, result = []) {
        
        if (root === null) return;

        !callback ? result.push(root.data) : result.push(callback(root.data));
        this.preOrder(callback, root.left, result);
        this.preOrder(callback, root.right,  result);

        return result

    }

    inOrder(callback, root = this.root, result = []) {

        if (root === null) return;

        this.inOrder(callback, root.left, result);
        !callback ? result.push(root.data) : result.push(callback(root.data));
        this.inOrder(callback, root.right,  result);

        return result;
        
    }

    postOrder(callback, root = this.root, result = []) {

        if (root === null) return;

        this.postOrder(callback, root.left, result);
        this.postOrder(callback, root.right, result);
        !callback ? result.push(root.data) : result.push(callback(root.data));

        return result;

    }

    height(nodeValue, root = this.root) {
        if (root === null) {
            return -1;
        }

        if (nodeValue < root.data) {
            return this.height(nodeValue, root.left);
        } else if (nodeValue > root.data) {
            return this.height(nodeValue, root.right);
        } else {
            // Node found, now calculate its height from the subtree
            return this._getNodeHeight(root);
        }
    }

    _getNodeHeight(node) {
        if (node === null) {
            return -1;
        }
        const leftHeight = this._getNodeHeight(node.left);
        const rightHeight = this._getNodeHeight(node.right);
        return Math.max(leftHeight, rightHeight) + 1;
    }

    depth(nodeValue, root = this.root) {
        if (nodeValue === root.data) {
            return 0;
        }

        if (nodeValue < root.data) {
            return this.depth(nodeValue, root.left) + 1;
        } else if (nodeValue > root.data) {
            return this.depth(nodeValue, root.right) + 1;
        }
    }

    isBalanced(root = this.root) {
        const leftHeight = this._getNodeHeight(root.left);
        const rightHeight = this._getNodeHeight(root.right);

        if (leftHeight - rightHeight > 1 || rightHeight - leftHeight > 1) {
            return false;
        }

        return true;

    }

    rebalance() {
        if (this.isBalanced()) return;

        const newTreeArray = this.inOrder();
        this.root = buildTree(newTreeArray);
        return this.root;

    }

}

// Using as a callback function for practice
function multBy2(num) {
    return num * 2;
}

// Create arrays and tree for practice
const arr1 = [1, 7, 4, 23, 8, 9, 3, 5, 67, 6345, 324];
const arr2 = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324, 300, 240, 305, 400, 350, 70, 330, 24, 25];
const arr3 = [20, 30, 40, 32, 34, 36, 50, 70, 60, 65, 80, 75, 85];
let tree = new Tree(arr3);

// Driver Script
(function DriverScript() {

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function generateRandomArray(n) {
        let array = [];
        for (let i = 0; i < n; i++) {
            let randomNum = getRandomInt(1, 99);
            array.push(randomNum);
        }
        return array;
    }
    function generateRandomArrayAbove100(n) {
        let array = [];
        for (let i = 0; i < n; i++) {
            let randomNum = getRandomInt(100, 200);
            array.push(randomNum);
        }
        return array;
    }

    function insertValuesToTree(arr, tree = newTree) {
        for (let i = 0; i < arr.length; i++) {
            tree.insert(arr[i]);
        }

        return tree;
    }

    // Create a binary search tree from an array of random numbers < 100
    const newTree = new Tree(generateRandomArray(20));

    prettyPrint(newTree.root);

    // Confirm that the tree is balanced
    console.log(`Balanced? ${newTree.isBalanced()}`);

    // Print out all elements in level, pre, post, and in order
    console.log('Level Order:');
    console.log(newTree.levelOrder());
    console.log('Pre Order:');
    console.log(newTree.preOrder());
    console.log('In Order:');
    console.log(newTree.inOrder());
    console.log('Post Order:');
    console.log(newTree.postOrder());

    // Unbalance the tree by adding several numbers > 100
    console.log("Adding values to unbalance tree");
    insertValuesToTree(generateRandomArrayAbove100(5));
    prettyPrint(newTree.root);

    // Confirm that the tree is unbalanced
    console.log(`Balanced? ${newTree.isBalanced()}`);

    //Rebalance tree
    console.log("rebalancing");
    newTree.rebalance();
    prettyPrint(newTree.root);

    // Print out all elements in level, pre, post, and in order
    console.log(`Balanced? ${newTree.isBalanced()}`);
    console.log('Level Order:');
    console.log(newTree.levelOrder());
    console.log('Pre Order:');
    console.log(newTree.preOrder());
    console.log('In Order:');
    console.log(newTree.inOrder());
    console.log('Post Order:');
    console.log(newTree.postOrder());

})();

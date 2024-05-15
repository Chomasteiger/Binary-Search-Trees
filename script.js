class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class Tree {
    constructor(array) {
        this.array = array;
        this.root = null;
    }

    sortArray(array) {
        array.sort( (a,b) => { return a - b});
        array = array.filter( (value, index) => array.indexOf(value) === index);
        return array;
    }

    buildTree(arr, start, end) {
        if (start > end) {
            return null;
        } else {
            let mid = Math.floor((start + end) / 2);
            const node = new Node(arr[mid]);
            node.left = this.buildTree(arr, start, mid - 1);
            node.right = this.buildTree(arr, mid + 1, end)
            return node;
        }
    }

    insert(value) {
        let currentNode = this.root;
        let parent = null;

        while (currentNode !== null) {
            parent = currentNode;
            if(currentNode.value > value) {
                currentNode = currentNode.left;
            }
            else if (currentNode.value < value) {
                currentNode = currentNode.right;
            } else {
                return; //If duplicate value, do nothing
            }
        }

        if (value < parent.value) {
            parent.left = new Node(value);
        } else {
            parent.right = new Node(value);
        }
    }

    delete(value) {
        
        let currentNode = this.root;
        let parent = null;
        
        //finds node that needs to be deleted
        while (currentNode.value !== value) {
            if (value < currentNode.value) {
                parent = currentNode;
                currentNode = currentNode.left;
            } else {
                parent = currentNode;
                currentNode = currentNode.right;
            }
        }

        //if node has no child
        if (currentNode.left === null && currentNode.right === null) {
            if (value < parent.value) {
                parent.left = null;
            } else {
                parent.right = null;
            }
        }
        
        //if node has only one child
        if (currentNode.left === null && currentNode.right !== null) {
            if (value < parent.value) {
                parent.left = currentNode.right;
            } else {
                parent.right = currentNode.right;
            }
        }
        
        if (currentNode.left !== null && currentNode.right === null) {
            if (value < parent.value) {
                parent.left = currentNode.left;
            } else {
                parent.right = currentNode.left;
            }
        }

        //if node has two child
        if (currentNode.left !== null && currentNode.right !== null) {
            //find node right child's extreme left node
            let minRight = currentNode.right;
            while (minRight.left !== null) {
                minRight = minRight.left;
            }
            this.delete(minRight.value);
            currentNode.value = minRight.value;
        }
    }

    find(value) {
        let currentNode = this.root;

        while(currentNode.value !== value) {
            if(value < currentNode.value) {
                currentNode = currentNode.left;
            } else {
                currentNode = currentNode.right
            }
        }

        return currentNode;
    }

    levelOrderIteration() {
        let queue = [];
        let currentNode = this.root;

        if (this.root === null) {
            return;
        }

        queue.push(this.root);

        while (queue.length !== 0) {
            currentNode = queue.at(0);
            console.log(currentNode);

            if(currentNode.left !== null) {
                queue.push(currentNode.left);
            }
            if(currentNode.right !== null) {
                queue.push(currentNode.right);
            }

            queue.shift();

        }
    }

    levelOrderRecursive(callback = null) {
        if (!this.root) return [];

        let queue = [this.root];
        let result = [];

        const traverse = () => {

            const nextLevelNodes = [];

            queue.forEach(node => {
                if(callback) {
                    callback(node.value);
                } else {
                    result.push(node.value);
                }

                if(node.left) {
                    nextLevelNodes.push(node.left);
                }

                if(node.right) {
                    nextLevelNodes.push(node.right);
                }
            });

            if (nextLevelNodes.length > 0) {
                queue.length = 0;
                queue.push(...nextLevelNodes)
                traverse();
            }
        }
        traverse();
        return result;

    }

    inOrder(callback=null) {

        let result = [];

        const traverse = (node) => {

            if (node === null) {
                return;
            }

            
            if(node.left !== null) {
                traverse(node.left);
            }

            if(callback) {
                callback(node.value);
            } else {
                result.push(node.value);
            }
            
            if(node.right !== null) {
                traverse(node.right);
            }
        }
        traverse(this.root);
        return result;
    }

    preOrder(callback=null) {

        let result = [];

        const traverse = (node) => {

            if (node === null) {
                return;
            }

            if(callback) {
                callback(node.value);
            } else {
                result.push(node.value);
            }

            if(node.left !== null) {
                traverse(node.left);
            }
            
            if(node.right !== null) {
                traverse(node.right);
            }
        }
        traverse(this.root);
        return result;
    }

    postOrder(callback=null) {

        let result = [];

        const traverse = (node) => {

            if (node === null) {
                return;
            }

            if(node.left !== null) {
                traverse(node.left);
            }
            
            if(node.right !== null) {
                traverse(node.right);
            }

            if(callback) {
                callback(node.value);
            } else {
                result.push(node.value);
            }
        }
        traverse(this.root);
        return result;
    }

    height(node) {

        let leftHeight = 0;
        let rightHeight = 0;
        let currentNode = this.root;

        if (node === null) {
            return 0;
        }
        
        currentNode = this.find(node.value);
        while (currentNode.left !== null) {
            currentNode = currentNode.left;
            leftHeight++;
        }

        currentNode = this.find(node.value);
        while (currentNode.right !== null) {
            currentNode = currentNode.right;
            rightHeight++;
        }

        if (leftHeight > rightHeight) {
            return leftHeight;
        } else {
            return rightHeight;
        }



    }

    depth(node) {
        
        let currentNode = this.root;
        let currentDepth = 0;

        while (currentNode.value !== node.value) {
            
            if (node.value < currentNode.value) {
                currentNode = currentNode.left;
            } else {
                currentNode = currentNode.right;
            }
            
            currentDepth++;
        }

        return currentDepth;
    }

    isBalanced() {
        let balanceStatus = true;

        const checkNodeBalance = (node) => {
            let leftHeight;
            let rightHeight;
            let difference;

            if (node === null) {
                return;
            }

            leftHeight = this.height(node.left);
            rightHeight = this.height(node.right);
            difference = function(a,b) {return Math.abs(a - b);}

            if (difference(leftHeight,rightHeight) > 1) {
                balanceStatus = false;
            }

            if(node.left !== null) {
                checkNodeBalance(node.left);
            }
            if(node.right !== null) {
                checkNodeBalance(node.right);
            }
        }   
        checkNodeBalance(this.root);

        return balanceStatus;
    }

    rebalance() {
        let arr = this.inOrder();
        let sortedArr = this.sortArray(arr);
        this.root = this.buildTree(sortedArr, 0, sortedArr.length - 1);
    }
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
    if (node.left !== null) {
      prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  };

(function driver() {
    
    function getRandomInt(num) {
        return Math.floor(Math.random() * num);
    }
    
    function createRandomNumberArray(num) {
        let array = [];

        for (let i=0; i<num; i++) {
            array.push(getRandomInt(100));
        }

        return array;
    }

    const tree = new Tree();
    let sortedArray = tree.sortArray(createRandomNumberArray(10));
    tree.root = tree.buildTree(sortedArray, 0, sortedArray.length - 1);
    prettyPrint(tree.root);
    console.log(`Is this tree balanced? ${tree.isBalanced()}`);
    console.log(`Pre Order: ${tree.preOrder()}`);
    console.log(`Post Order: ${tree.postOrder()}`);
    console.log(`In Order: ${tree.inOrder()}`);
    console.log(`---`)
    console.log(`Adding 4 numbers >100 to unbalance the tree`)
    tree.insert(120);
    tree.insert(2356);
    tree.insert(460);
    tree.insert(792);
    prettyPrint(tree.root);
    console.log(`Is this tree balanced? ${tree.isBalanced()}`);
    console.log(`---`)
    console.log(`Rebalancing this tree`)
    tree.rebalance();
    prettyPrint(tree.root);
    console.log(`Pre Order: ${tree.preOrder()}`);
    console.log(`Post Order: ${tree.postOrder()}`);
    console.log(`In Order: ${tree.inOrder()}`);

})();


// const tree = new Tree();
// const givenArray = [1, 2, 3, 4, 5, 7]
// let sortedArray = tree.sortArray(givenArray);
// tree.root = tree.buildTree(sortedArray, 0, sortedArray.length - 1);
// prettyPrint(tree.root);
// tree.insert(16);
// console.log(`----------------------------`)
// prettyPrint(tree.root);
// console.log(`----------------------------`)
// tree.delete(67);
// prettyPrint(tree.root);
// console.log(`----------------------------`)
// console.log(`----------------------------`)
// console.log(`----------------------------`)
// const anotherArray = [50,30,70,20,40,40,60,80];
// const anotherTree = new Tree();
// let sortedAnotherArray = anotherTree.sortArray(anotherArray);
// anotherTree.root = anotherTree.buildTree(sortedAnotherArray, 0, sortedAnotherArray.length - 1);
// prettyPrint(anotherTree.root);
// anotherTree.delete(50);
// prettyPrint(anotherTree.root);
// console.log(anotherTree.find(20));
// tree.levelOrderIteration();
// console.log(tree.levelOrderRecursive());
// prettyPrint(tree.root);
// console.log(tree.isBalanced());
// tree.insert(16);
// tree.insert(15);
// tree.insert(18);
// console.log(`----------------------------`)

// prettyPrint(tree.root);
// // console.log(tree.inOrder());
// // // tree.inOrder((value) => console.log(value));
// // console.log(tree.preOrder());
// // console.log(tree.postOrder());
// // console.log(tree.depth(tree.find(3)));
// // console.log(tree.height(tree.find(3)));
// // console.log(tree.height(tree.find(5)));
// // console.log(tree.height(tree.find(1)));

// console.log(tree.isBalanced());
// console.log(`----------------------------`)

// tree.rebalance();
// prettyPrint(tree.root);
const gridElement = document.getElementById("grid");
const size = 75;
const sizeM = size - 1;

const grid = [];
const pathLength = 60;
const stability = 0.99;

for (let i = 0; i < size; i++) {
    gridElement.appendChild(createRow(size));
    grid[i] = [];
    for (let j = 0; j < size; j++) {
        grid[i][j] = true;
    }
}
function createPixel() {
    const rv = document.createElement("td");
    const d = document.createElement("div");
    d.className = "pixel";
    rv.appendChild(d);
    return rv;
}
function createRow(length) {
    const rv = document.createElement("tr");
    for (var i = 0; i < length; i++) rv.appendChild(createPixel());
    return rv;
}
function render() {
    for (var i = 0; i < gridElement.children.length; i++) {
        for (let j = 0; j < gridElement.children[i].children.length; j++) {
            gridElement.children[i].children[j].style.background = grid[i][j] ? "black" : "red";
        }
    }
}
function clear() {
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[i].length; j++) {
            grid[i][j] = true;
        }
    }
}
function randomIndex() {
    return {
        i: Math.round(Math.random() * size),
        j: Math.round(Math.random() * size)
    }
}
window.generateMaze = function generateMaze(index = { i: Math.round(size / 2), j: Math.round(size / 2) }) {
    clear();


    const currentIndex = index;
    grid[currentIndex.i][currentIndex.j] = false;
    var lm = undefined;
    for (var i = 0; i < pathLength; i++) {
        lm = step(currentIndex, lm);
        grid[currentIndex.i % size][currentIndex.j % size] = false;
    }

    render();
}
function step(index, lastMove) {
    const r = Math.random() < stability && lastMove ? lastMove : Math.random();

    switch (true) {
        case r < 0.25:
            if (neighbourCount({ i: index.i, j: index.j + 1 }) <= 1 || Math.random() < 0.1) {
                index.j++;
                break;
            }
            step(index);
            break;
        case r < 0.5:
            if (neighbourCount({ i: index.i, j: index.j - 1 }) <= 1 || Math.random() < 0.1) {
                index.j--;
                break;
            }
            step(index);
            break;
        case r < 0.75:
            if (neighbourCount({ i: index.i + 1, j: index.j }) <= 1 || Math.random() < 0.1) {
                index.i++;
                break;
            }
            step(index);
            break;
        default:
            if (neighbourCount({ i: index.i - 1, j: index.j }) <= 1 || Math.random() < 0.1) {
                index.i--;
                break;
            }
            step(index);
            break;
    }
    fixIndex(index);
    return r;
}
function fixIndex(index) {
    index.i = modButBetter(index.i, sizeM);
    index.j = modButBetter(index.j, sizeM);
}
function neighbourCount(index) {
    try {
        var l = [grid[modButBetter((index.i + 1), sizeM)][modButBetter(index.j, sizeM)], grid[modButBetter((index.i - 1), sizeM)][modButBetter(index.j, sizeM)], grid[modButBetter(index.i, sizeM)][(modButBetter(index.j + 1), sizeM)], grid[modButBetter(index.i, sizeM)][modButBetter((index.j - 1), sizeM)]].filter(v => !v).length;
    } catch (e) {
        console.log(index);
    }
    return l;
}
function modButBetter(a, b) {
    return a % b >= 0 ? a % b : b - (a % b);
}
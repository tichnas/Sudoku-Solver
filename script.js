const transitionTime = 1000;

const size = 9;
let grid = [];
let empty = [];
const gridElement = document.getElementsByClassName('grid')[0];
const gridElements = document.getElementsByClassName('grid-small');
const buttonElement = document.querySelector('button');
let inputs;
let possible;
let solved;

// Pure JS

const findEmpty = () => {
    empty = [];

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (!grid[i][j]) empty.push([i, j]);
        }
    }
};

const check = (num, index) => {
    for (let i = 0; i < size; i++) {
        if (grid[empty[index][0]][i] === num) return false;
        if (grid[i][empty[index][1]] === num) return false;
    }

    const boxRow = 3 * Math.floor(empty[index][0] / 3);
    const boxCol = 3 * Math.floor(empty[index][1] / 3);
    for (let i = boxRow; i < boxRow + 3; i++) {
        for (let j = boxCol; j < boxCol + 3; j++) {
            if (grid[i][j] === num) return false;
        }
    }

    return true;
};

const reset = index => {
    for (let i = index; i < empty.length; i++) {
        grid[empty[i][0]][empty[i][1]] = 0;
    }
};

const solve = index => {
    if (!index) {
        findEmpty();
        index = 0;
    }

    if (index === empty.length) return true;

    for (let num = 1; num <= size; num++) {
        if (check(num, index)) {
            grid[empty[index][0]][empty[index][1]] = num;

            if (solve(index + 1)) return true;

            reset(index);
        }
    }

    return false;
};

const print = () => {
    for (let i = 0; i < size; i++) {
        let str = '';
        for (let j = 0; j < size; j++) {
            str += grid[i][j] + ' ';
        }
        console.log(str);
    }
};

// DOM interaction

const initialize = () => {
    solved = false;

    for (let i = 0; i < gridElements.length; i++) {
        gridElements[i].innerHTML = '';

        for (let j = 0; j < size; j++) {
            const row = 3 * Math.floor(i / 3) + Math.floor(j / 3);
            const col = 3 * (i % 3) + (j % 3);

            gridElements[i].innerHTML += `
            <input
                type="number"
                min="1"
                max="9"
                step="1"
                onChange="handleChange(this)"
                id=${row + '' + col}
            />`;
        }
    }
};

const parseHtml = () => {
    inputs = document.getElementsByTagName('input');

    grid = [];
    for (let i = 0; i < size; i++) {
        grid.push([]);
        for (let j = 0; j < size; j++) {
            grid[i].push(0);
        }
    }

    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value) {
            if (inputs[i].checkValidity()) {
                grid[Number(inputs[i].id[0])][Number(inputs[i].id[1])] = Number(
                    inputs[i].value
                );
            } else {
                return false;
            }
        }
    }

    return true;
};

const handleChange = element => {
    element.style.backgroundColor = element.checkValidity()
        ? 'lightskyblue'
        : 'crimson';

    if (!element.value) element.style.backgroundColor = 'white';
};

const handleResult = () => {
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].value =
            grid[Number(inputs[i].id[0])][Number(inputs[i].id[1])];
        inputs[i].disabled = true;
    }

    solved = true;
    buttonElement.innerText = 'Clear';
};

const handleButton = () => {
    if (solved) {
        initialize();
        buttonElement.innerText = 'Solve It!';
        return;
    }

    if (parseHtml()) {
        gridElement.style.animation = `transform ${transitionTime}ms`;

        setTimeout(() => {
            gridElement.style.animation = '';
            if (!possible) alert('No solution exists.');
        }, transitionTime);

        if (solve()) {
            possible = true;
            setTimeout(() => handleResult(), transitionTime / 2);
        } else {
            possible = false;
        }
    } else {
        alert('Please input valid Sudoku grid.');
    }
};

initialize();

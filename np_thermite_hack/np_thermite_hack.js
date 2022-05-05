'use strict'

// Objects as storage for common variables
const elem = {};
let grid_settings = {};
let game_logic = {};

// Functions to run after loading
function pageLoaded() {
    prepareHandles();
    addEventListeners();
    create_and_draw_grid(5);
}

// Store handles and values in global objects
async function prepareHandles() {
    elem.grid_container = document.querySelector('.div_grid');
    elem.start_button = document.querySelector('#start_button');
    grid_settings.size_element = document.querySelector('#grid_size');
    grid_settings.size = grid_settings.size_element.value;
    grid_settings.blocks = 8;
    game_logic.lives = 3;
    game_logic.blocks_remaining = grid_settings.blocks;
    game_logic.timeout = 10000;
    game_logic.show_timer = 3000;
    game_logic.game_active = false;
}

// Initialise all event listeners
function addEventListeners() {
    grid_settings.size_element.addEventListener('input', function() {
        clearTimeout(game_logic.fail_time);
        clearTimeout(game_logic.show_time);
        create_and_draw_grid(grid_settings.size_element.value);
        console.log(game_logic, grid_settings);
    }, false);
    elem.start_button.addEventListener('click', start_game);
}

// Control function to call the functions to create and draw everything used for the grid
function create_and_draw_grid(size) {
    blocks_on_grid(size);
    create_array_grid(size, grid_settings.blocks);
    create_button_grid(size);
}

// Amount of pattern blocks on the grid depending on grid size
function blocks_on_grid(size) {
    if (size == 5) {grid_settings.blocks = 8; game_logic.timeout = 10000; game_logic.show_timer = 3000;}
    else if (size == 6) {grid_settings.blocks = 14; game_logic.timeout = 10000; game_logic.show_timer = 3000;}
    else if (size == 7) {grid_settings.blocks = 17; game_logic.timeout = 10000; game_logic.show_timer = 3000;}
    else if (size == 8) {grid_settings.blocks = 20; game_logic.timeout = 12000; game_logic.show_timer = 4000;}
    game_logic.blocks_remaining = grid_settings.blocks;
    game_logic.lives = 3;
}

// Creates an array of x*x size of 0's with y amount of 1's randomly placed within the array
function create_array_grid(size, blocks) {
    let grid_array = new Array(size*size).fill(0);
    let pattern_array_positions = [];

    for (let i = 0; i < blocks; i++) {
        let rand_num = randomInteger(0, ((size * size) - 1));
        let rand_elem = grid_array[rand_num];

        if (rand_elem === 0) {
            grid_array[rand_num] = 1;
            pattern_array_positions.push("#div_" + rand_num);
        }
        else {
            i--;
        }
    }

    grid_settings.array = grid_array;
    grid_settings.pattern_positions = pattern_array_positions;
}

// Get random integer between 0 and an upper limit
function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Create dynamic grid layout and draw it inside the container
function create_button_grid(size) {
    elem.grid_container.innerHTML = " ";
    let grid_style = "";
    elem.grid_container.style.display = 'grid';
    for (let i = 1; i <= size; i++) {
        grid_style += " 1fr";
    }
    elem.grid_container.style.gridTemplateColumns = grid_style;
    elem.grid_container.style.gridTemplateRows = grid_style;
    elem.grid_container.style.gap = (10 / size) + "%";

    let all_div_ids = [];

    for (let j = 0; j < (size*size); j++) {
        let button_container = document.createElement('div');
        //button_container.innerText = grid_settings.array[j];                    // UNCOMMENT TO SHOW ANSWER ON GRID
        button_container.id = "div_" + j;
        all_div_ids.push("#div_" + j);
        button_container.className = "block";
        elem.grid_container.appendChild(button_container);
    }

    grid_settings.div_ids = all_div_ids;
}

// Show the pattern briefly     # TIMER SET TO 3 SECONDS FOR ALL HACKS #
function show_pattern() {
    game_logic.game_active = true;
    for (let i = 0; i < grid_settings.pattern_positions.length; i++) {
        document.querySelector(grid_settings.pattern_positions[i]).style.background = "#bfbfbf";
    }

    game_logic.show_time = setTimeout(() => {
        for (let i = 0; i < grid_settings.pattern_positions.length; i++) {
            document.querySelector(grid_settings.pattern_positions[i]).style.background = "#394D61";
        }
        make_divs_clickable();
        game_logic.fail_time = setTimeout(() => {
            fail_timeout();
        }, game_logic.timeout);
    }, 3000)
}

// Make the blocks clickable once the pattern has been shown
function make_divs_clickable() {
    grid_settings.div_ids.forEach((e) => {
        document.querySelector(e).addEventListener('click', function(e) {check_pattern("#" + e.target.id);}, false);
    });
}

// Check whether clicked block was correct or not and handle failure and success
function check_pattern(block_id) {
    let is_correct = grid_settings.pattern_positions.includes(block_id);
    
    if (is_correct) {
        document.querySelector(block_id).style.background = "#bfbfbf";
        game_logic.blocks_remaining--;
    }
    else {
        document.querySelector(block_id).style.background = "#F22300";
        game_logic.lives--;
    }
    
    if (game_logic.lives <= 0) {
        clearTimeout(game_logic.fail_time);
        show_outcome(false);
    }
    else if (game_logic.blocks_remaining <= 0) {
        clearTimeout(game_logic.fail_time);
        show_outcome(true);
    }

}

// Fail game if the timer runs out
function fail_timeout() {
    show_outcome(false);
}

function show_outcome(outcome) {
    game_logic.game_active = false;
    if (outcome == false) {
        elem.grid_container.innerHTML = " ";
        elem.grid_container.style.display = 'inherit';

        let image = document.createElement('img');
        image.src = "Sadge.png";
        elem.grid_container.appendChild(image);

        let text = document.createElement('p');
        text.innerText = "Remote Sequencing Failed";
        elem.grid_container.appendChild(text);
    }
    else if (outcome == true) {
        elem.grid_container.innerHTML = " ";
        elem.grid_container.style.display = 'inherit';

        let image = document.createElement('img');
        image.src = "EZ.png";
        elem.grid_container.appendChild(image);

        let text = document.createElement('p');
        text.innerText = "Remote Sequencing Complete";
        elem.grid_container.appendChild(text);

    }
}

function start_game() {
    elem.grid_container.innerHTML = " ";
    elem.grid_container.style.display = 'inherit';

    let image = document.createElement('img');
    image.src = "HACKERMANS.gif";
    elem.grid_container.appendChild(image);

    let text = document.createElement('p');
    text.innerText = "Remote Sequencing Required";
    elem.grid_container.appendChild(text);

    setTimeout(() => {
        create_and_draw_grid(grid_settings.size_element.value);
        show_pattern();
    }, 3000);
}


window.addEventListener('load', pageLoaded);
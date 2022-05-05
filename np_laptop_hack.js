/* 
Number Color = block_details.number_color

Background Color = block_details.block_background

Color Text Background Color = block_details.text_color_background

Text Color = block_details.text_color
Text Background Color = block_details.text_color_background

Shape = block_details.shape
Shape Color = block_details.shape_color

Shape Text = block_details.shape_text
Shape Text Background Color = block_details.shape_text_background
*/


// Begin running file when page has loaded
window.addEventListener('load', pageLoaded);

// Global object to store commonly used variables
const elem = {};
const game_logic = {};

// Functions to run after page has loaded
function pageLoaded() {
    prepareHandles();
    addEventListeners();
    game_handler();
}

// Create handles on HTML elements
function prepareHandles() {
    elem.difficulty_choice = document.querySelector('#difficulty_select');
    elem.div_container = document.querySelector('.div_container');
    elem.block_container = document.querySelector('.block_container');
    elem.input_container = document.querySelector('.input_container');
    elem.timer = document.querySelector('#timer');
    elem.input = document.querySelector('#input');
}

function addEventListeners() {
    elem.difficulty_choice.addEventListener('change', (e) => {create_and_draw()});
}

// Colours and hex values associated with them
const colors = {
    "red" : '#fe0000',
    "blue" : '#0000fe',
    "green" : '#008001',
    "yellow" : '#ffff00',
    "black" : '#000000',
    "white" : '#ffffff',
    "orange" : '#ffa200',
    "purple" : '#9a26ad'
};

// Array of keys from colors (used frequently and is easier to call this than repeatedly run Object.keys() )
const color_names = Object.keys(colors);

// Each of the shape choices
const shapes = ["triangle", "circle", "square", "rectangle"];

// Difficulty choices and the amount of blocks associated with them
const difficulty = {
    "Fleeca" : 4,
    "Valut" : 5
}


// Get a random integer between a range
function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// Initialise all random attributes of a Block 
class Block {
    background_color;
    shape;
    shape_color;
    number;
    number_color;
    color_text;
    color_text_background;
    shape_text;
    shape_text_background;

    constructor() {
        // Select random values for each attribute of the block

        this.background_color = colors[color_names[randomInteger(0, 7)]];

        this.shape = shapes[randomInteger(0, 3)];
        this.shape_color = colors[color_names[randomInteger(0, 7)]];

        // Shape color and background color can not be the same color
        while (this.shape_color === this.background_color) {
            this.shape_color = colors[color_names[randomInteger(0, 7)]];
        }

        this.number = randomInteger(1, 9);
        this.number_color = colors[color_names[randomInteger(0, 7)]];

        // Number color and shape color can not be the same color
        while (this.number_color === this.shape_color) {
            this.number_color = colors[color_names[randomInteger(0, 7)]];
        }

        this.color_text = color_names[randomInteger(0, 7)];
        this.color_text_background = colors[color_names[randomInteger(0, 7)]];

        // Color text background color and shape color can not be the same color
        while (this.color_text_background === this.shape_color) {
            this.color_text_background = colors[color_names[randomInteger(0, 7)]];
        }

        this.shape_text = shapes[randomInteger(0, 3)];
        this.shape_text_background = colors[color_names[randomInteger(0, 7)]];

        // Shape text background color and shape color can not be the same color
        while (this.shape_text_background === this.shape_color) {
            this.shape_text_background = colors[color_names[randomInteger(0, 7)]];
        }

        this.question_options = {
            "background color" : this.#hex_to_name(this.background_color),
            "shape" : this.shape,
            "shape color" : this.#hex_to_name(this.shape_color),
            "number color" : this.#hex_to_name(this.number_color),
            "text color" : this.color_text,
            "color text background color" : this.#hex_to_name(this.color_text_background),
            "shape text" : this.shape_text,
            "shape text background color" : this.#hex_to_name(this.shape_text_background)
        }
    }

    choose_question() {
        let question = Object.keys(this.question_options)[randomInteger(0, 7)]
        return [question, this.question_options[question]];
    }

    #hex_to_name(color) {
        return Object.keys(colors).find(key => colors[key] === color);
    }
}

// Handles game starting
function game_handler() {
    // Get the amount of blocks from the difficulty choice
    let difficulty_option = elem.difficulty_choice.value;
    let num_of_blocks = difficulty[difficulty_option];

    // Create array of x amount of elements [0, 1, 2, ... x] and randomise the order of the elements
    let number_array = Array.from(Array(num_of_blocks).keys());
    game_logic.number_order = number_array.sort(() => Math.random() - 0.5);

    show_number_order(num_of_blocks);
}


// Animation that shows the randomised order of numbers
async function show_number_order(num_of_blocks) {
    // Create large numbers inside each box showing the order
    for (let i = 0; i < num_of_blocks; i++) {
        let background = document.createElement('div');
        background.className = "number_show";
        background.style.background = '#394D61';

        let display_number = document.createElement('h3');
        display_number.innerText = game_logic.number_order[i] + 1;
        display_number.style.fontSize = "800%";
        elem.block_container.appendChild(background);
        background.appendChild(display_number);
    }

    let h3 = document.querySelectorAll('h3');

    // Hold the large numbers on screen for 1 second
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Shrink the numbers until they are not visible
    for (let j = 1; j < 800; j++) {
        for (let l = 0; l <= h3.length - 1; l++) {
            await new Promise(resolve => setTimeout(resolve, 10));
            let value = (parseInt(h3[l].style.fontSize.replace('%', '')) - j) + '%';
            h3[l].style.fontSize = value;
        }
        if (h3[3].style.fontSize === "20%") {
            break;
        }
    }

    // Clear the boxes
    elem.block_container.innerHTML = " ";
    let block_array = create_and_draw(num_of_blocks);
    create_questions(block_array, num_of_blocks);
    draw_input();
}

// Handles functions to create blocks and then draw them
function create_and_draw(num_of_blocks) {
    let block_array = [];

    // Create array of x amount of Blocks
    for (let i = 1; i <= num_of_blocks; i++) {
        let block = new Block;
        block_array.push(block);
        let canvas = draw_block(block);
        draw_shape(block.shape, block.shape_color, canvas);
    }

    return block_array;
}

// Draw the numbers and text names of colors
function draw_block(block_obj) {
    // Background of the block
    let background = document.createElement('div');
    background.className = "block_background";
    background.id = "block";
    background.style.background = block_obj.background_color;

    // Canvas holds the text and number
    let canvas = document.createElement('canvas');
    canvas.id = "shape_draw";
    canvas.setAttribute('width', '300px');
    canvas.setAttribute('height', '300px');

    // Text at the top of the canvas, which is color text
    let top_text = document.createElement('p');
    top_text.className = "top-text";
    top_text.innerText = block_obj.color_text.toUpperCase();
    top_text.style.color = block_obj.color_text_background;

    // Text at the bottom of the canvas, which is the shape text
    let bottom_text = document.createElement('p');
    bottom_text.className = "bottom-text";
    bottom_text.innerText = block_obj.shape_text.toUpperCase();
    bottom_text.style.color = block_obj.shape_text_background;

    // Number in the center of the canvas
    let number_text = document.createElement('h1');
    number_text.id = "number-text";
    number_text.innerText = block_obj.number;
    number_text.style.color = block_obj.number_color;

    // Put all elements together in the block
    elem.block_container.appendChild(background);
    background.appendChild(canvas);
    background.appendChild(top_text);
    background.appendChild(bottom_text);
    background.appendChild(number_text);

    return canvas;
}

function draw_shape(shape_choice, color_choice, canvas) {
    // Get context of the canvas, if failed push error
    let ctx;
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
        ctx.lineWidth = 3;
        ctx.fillStyle = color_choice;
    }
    else {
        ctx = 'fail';
    }

    // Draw the shapes according to the choice

    if (shape_choice === 'triangle') {
        // Triangle shape
        ctx.beginPath();
        ctx.moveTo(150, 30);
        ctx.lineTo(270, 270);
        ctx.lineTo(30, 270);

        // Border around shape
        ctx.lineTo(150, 30);
        ctx.lineTo(270, 270);
        ctx.stroke();

        // Fill color
        ctx.fill();
    }
    else if (shape_choice === 'circle') {
        ctx.beginPath();
        ctx.arc(150, 150, 120, 0, 2 * Math.PI);

        // Border around shape
        ctx.stroke();

        // Fill color
        ctx.fill();
    }
    else if (shape_choice === 'square') {
        ctx.beginPath();
        ctx.moveTo(30, 30);
        ctx.lineTo(270, 30);
        ctx.lineTo(270, 270);
        ctx.lineTo(30, 270);

        // Border around shape
        ctx.lineTo(30, 30);
        ctx.lineTo(270, 30);
        ctx.stroke();

        // Fill color
        ctx.fill();
    }
    else if (shape_choice === 'rectangle') {
        ctx.beginPath();
        ctx.moveTo(30, 80);
        ctx.lineTo(270, 80);
        ctx.lineTo(270, 220);
        ctx.lineTo(30, 220);

        // Border around shape
        ctx.lineTo(30, 80);
        ctx.lineTo(270, 80);
        ctx.stroke();

        // Fill color
        ctx.fill();
    }
    else {
        console.log('Failed to draw');
    }
}

function create_questions(block_array, num_of_blocks) {
    let questions_array = [];           // Questions to be used
    let number_check = [];              // Used to stop the same block from being used more than once   

    for (let i = 0; i <= 1; i++) {
        // Choose a random block by number
        let chosen_number = game_logic.number_order[randomInteger(0, num_of_blocks - 1)];

        // Make sure chosen block doesn't already have a question about it
        while (number_check.includes(chosen_number)) {
            chosen_number = game_logic.number_order[randomInteger(0, num_of_blocks - 1)];
        }

        // Get the index of the chosen number
        let index_of_chosen_number = game_logic.number_order.indexOf(chosen_number);

        // Get random question and corresponding answer from the chosen block
        let question_answer = block_array[index_of_chosen_number].choose_question();

        let display_number = chosen_number + 1;

        // Object made of the information used to make the question
        let question_info = {
            display_number,
            index_of_chosen_number,
            question_answer
        }

        questions_array.push(question_info);
        number_check.push(chosen_number);
    }

    // Create question and answer strings using the question info
    game_logic.question = "ENTER THE " + questions_array[0].question_answer[0].toUpperCase() + " (" + questions_array[0].display_number + ") AND " + questions_array[1].question_answer[0].toUpperCase() + " (" + questions_array[1].display_number + ")";
    game_logic.answer = questions_array[0].question_answer[1] + " " + questions_array[1].question_answer[1];

    console.log(game_logic.answer);
}

// Place the question and input box on the screen
function draw_input() {
    let question = document.createElement('h4');
    question.innerText = game_logic.question;

    let input_box = document.createElement('input');
    input_box.setAttribute('type', 'text');
    input_box.id = "answer_input";

    elem.input.appendChild(question);
    elem.input.appendChild(input_box);

    // Make sure that the page focus is on the input box
    let input_focus = document.querySelector('#answer_input');
    input_focus.focus();
    input_box.addEventListener('keydown', check_input);

    slider_control();
}

// Visual countdown slider to show how long the user has left to input the answer
async function slider_control() {
    // Two sliders are used, one left-to-right and one right-to-left so that they meet in the middle when finished
    let slider_text = '<input type="range" id="time_slider1" min="0" max="500" value="500"><input type="range" id="time_slider2" min="0" max="500" value="500">';
    elem.timer.innerHTML = slider_text;

    let slider = document.querySelector('#time_slider1');
    let slider2 = document.querySelector('#time_slider2');

    // Reduce the value of the slider to visually show the time
    for (let i = 100; i > 0; i--) {
        await new Promise(resolve => setTimeout(resolve, 60));
        slider.style.setProperty('--width', (i + "%"));
        slider2.style.setProperty('--width', (i + "%"));
    }

    // Once the time ends, the slider will match the background so that it is no longer visible
    slider.style.setProperty('--shadow', '#80552b');
    slider2.style.setProperty('--shadow', '#80552b');

    await new Promise(resolve => setTimeout(resolve, 100));
    //failure_screen();
}

// When enter is pressed in the input box, the answer is uploaded and the input is checked with the correct answer
function check_input(e) {
    if (e.key === 'Enter') {
        let input = document.querySelector('#answer_input').value;
        if (input === game_logic.answer) {
            success_screen();
        }
        else {
            failure_screen();
        }
    }
}

// Clear the screen of blocks and the input area then present a failure message
function failure_screen() {
    if (elem.block_container.innerHTML != " ") {
        elem.block_container.innerHTML = " ";
        elem.input_container.innerHTML = " ";
        elem.div_container.innerHTML = "<h2 class='end_screen'>THE SYSTEM DIDN'T ACCEPT YOUR ANSWERS</h2>";
    }
}

// Clear the screen of blocks and the input area then present a success message
function success_screen() {
    elem.block_container.innerHTML = " ";
    elem.input_container.innerHTML = " ";
    elem.div_container.innerHTML = "<h2 class='end_screen'>THE SYSTEM HAS BEEN BYPASSED</h2>";
}
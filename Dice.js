document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to each "Keep" button
    const keepButtons = document.querySelectorAll('.innercontainer_lock');
    keepButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Extract the number from the button's id
            const number = this.id.replace(/[^\d]/g, '');
            // Find the corresponding dice
            const dice = document.getElementById(`dice${number}`);
            // Toggle the dice's background color between green and beige
            if (dice) {
                if (dice.style.backgroundColor === 'green') {
                    dice.style.backgroundColor = 'beige';
                } else {
                    dice.style.backgroundColor = 'green';
                }
            }
        });
    });
});

class Dice {
    constructor() {
        this.value = 0;
    }

    roll() {
        this.value = Math.floor(Math.random() * 6) + 1;
        return this.value;
    }
}

const Results = [0, 0, 0, 0, 0];

const dice1 = new Dice();
const dice2 = new Dice();
const dice3 = new Dice();
const dice4 = new Dice();
const dice5 = new Dice();

Results[0] = dice1.roll();
Results[1] = dice2.roll();
Results[2] = dice3.roll();
Results[3] = dice4.roll();
Results[4] = dice5.roll();

console.log(Results);
// Create a new class for solving points in Yahtzee
class Yahtzee {
    dice = [];
    diceCount = 5;
    diceKeep = []
    pointsSum = 0;

    remainingSection = {
        upperSection: ["ones", "twos", "threes", "fours", "fives", "sixes"],
        lowerSection: ["threeOfAKind", "fourOfAKind", "fullHouse", "smallStraight", "largeStraight", "yahtzee", "chance"]
    }

    // Calculate the sum of all dice
    sum() {
        console.log("this.dice", this.dice)
        console.log("sum", this.dice.reduce((a, b) => a + b, 0))
        return this.dice.reduce((a, b) => a + b, 0);
    }

    selectDice(dice) {
        // dice = Array of indexes of dice to select
        this.diceKeep.push(this.dice[i]);
        this.diceCount = this.diceCount - dice.length;
    }

    rollDice() {
        // count = Number of dice to roll
        let diceRolled = [];
        for (let i = 0; i < this.diceCount; i++) {
            diceRolled.push(Math.floor(Math.random() * 6) + 1);
        }
        this.dice = diceRolled;
        return diceRolled;
    }

    playRound() {
        let i = 0
        while (this.diceCount > 0 || i < 3) {
            this.rollDice(this.diceCount);
            this.selectDice([0]);
            console.log(this.diceKeep, this.diceCount)
            i++
        }
        this.twos()
    }

    setDice(dice) {
        this.dice = dice;
    }

    ones() {
        this.selectionDone("upperSection", "ones")
        this.pointsSum += this.diceKeep.filter(die => die === 1).length;
    }

    twos() {
        this.selectionDone("upperSection", "twos")
        this.pointsSum += this.diceKeep.filter(die => die === 2).length * 2;
    }

    threes() {
        this.selectionDone("upperSection", "threes")
        this.pointsSum += this.diceKeep.filter(die => die === 3).length * 3;
    }

    fours() {
        this.selectionDone("upperSection", "fours")
        this.pointsSum += this.diceKeep.filter(die => die === 4).length * 4;
    }

    fives() {
        this.selectionDone("upperSection", "fives")
        this.pointsSum += this.diceKeep.filter(die => die === 5).length * 5;
    }

    sixes() {
        this.selectionDone("upperSection", "sixes")
        this.pointsSum += this.diceKeep.filter(die => die === 6).length * 6;
    }

    chance() {
        this.selectionDone("lowerSection", "chance")
        this.pointsSum += this.sum();
    }

    yahtzee() {
        this.selectionDone("lowerSection", "yahtzee")
        this.pointsSum += 50
    }

    fullHouse() {
        this.selectionDone("lowerSection", "fullHouse")
        this.pointsSum += 25
    }

    fourOfAKind() {
        this.selectionDone("lowerSection", "fourOfAKind")
        this.pointsSum += this.sum()
    }

    threeOfAKind() {
        this.selectionDone("lowerSection", "threeOfAKind")
        this.pointsSum += this.sum()
    }

    smallStraight() {
        this.selectionDone("lowerSection", "smallStraight")
        this.pointsSum += 30
    }

    largeStraight() {
        this.selectionDone("lowerSection", "largeStraight")
        this.pointsSum += 40
    }

    selectionDone(section, method) {
        const sectionIndex = this.remainingSection[`${section}`].indexOf(`${method}`)
        this.remainingSection[`${section}`].splice(sectionIndex, 1)
    }

    removeSelection(method) {
        this.selectionDone("upperSection", method)
    }
}


function playYahtzee() {
    const yahtzee = new Yahtzee();
    while (yahtzee.remainingSection.upperSection.length > 0) {
        yahtzee.playRound();
    }
    while (yahtzee.remainingSection.lowerSection.length > 0) {
        yahtzee.playRound();
    }
}


document.addEventListener('DOMContentLoaded', function () {
    // Add event listener to each "Keep" button
    const keepButtons = document.querySelectorAll('.innercontainer_lock');
    keepButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Extract the number from the button's id
            const number = this.id.replace(/[^\d]/g, '');
            // Find the corresponding dice
            const dice = document.getElementById(`dice${number}`);
            // Toggle the dice's background color between green and beige
            if (dice) {
                if (dice.style.backgroundColor === 'brown') {
                    dice.style.backgroundColor = 'beige';
                } else {
                    dice.style.backgroundColor = 'brown';
                }
            }
        });
    });

    const diceFields = [document.getElementById('dice1'),
        document.getElementById('dice2'),
        document.getElementById('dice3'),
        document.getElementById('dice4'),
        document.getElementById('dice5')]
    console.log(diceFields)

    const rollDice = document.getElementById('roll-button')
    rollDice.addEventListener('click', function () {
        const results = yahtzee.rollDice()
        for (const field in diceFields) {
            if (diceFields[field].style.backgroundColor === 'green') {
                yahtzee.selectDice([field])
                continue
            }
            diceFields[field].innerHTML = results[field]
        }
    })
});

document.addEventListener('DOMContentLoaded', function() {
    // Select all score buttons
    const scoreButtons = document.querySelectorAll('button[id]');
    scoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Call the function with the same name as the button's id
            if (this.id == "ones"){
                yahtzee.ones();
            }
            else if (this.id == "twos"){
                yahtzee.twos();
            }
            else if (this.id == "threes"){
                yahtzee.threes();
            }
            else if (this.id == "fours"){
                yahtzee.fours();
            }
            else if (this.id == "fives"){
                yahtzee.fives();
            }
            else if (this.id == "sixes"){
                yahtzee.sixes();
            }
            else if (this.id == "threeOfAKind"){
                yahtzee.threeOfAKind();
            }
            else if (this.id == "fourOfAKind"){
                yahtzee.fourOfAKind();
            }
            else if (this.id == "fullHouse"){
                yahtzee.fullHouse();
            }
            else if (this.id == "smallStraight"){
                yahtzee.smallStraight();
            }
            else if (this.id == "largeStraight"){
                yahtzee.largeStraight();
            }
            else if (this.id == "yahtzee"){
                yahtzee.yahtzee();
            }
            else if (this.id == "chance"){
                yahtzee.chance();
            }
        
        });
    });
});

const yahtzee = new Yahtzee()

yahtzee.rollDice()

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



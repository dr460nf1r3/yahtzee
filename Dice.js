// Create a new class for solving points in Yahtzee
class Yahtzee {
    dice = [];
    state = {diceCount: 5, attemptsLeft: 3};
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
        this.diceKeep.push(dice);
        this.state.diceCount = this.state.diceCount - 1;
    }

    rollDice() {
        // count = Number of dice to roll
        let diceRolled = [];
        for (let i = 0; i < this.state.diceCount; i++) {
            diceRolled.push(Math.floor(Math.random() * 6) + 1);
        }
        this.dice = diceRolled;
        console.log("Dice rolled", diceRolled)

        this.state.attemptsLeft -= 1;
        if (this.state.attemptsLeft === 0) {
            this.diceKeep.push(...diceRolled)
            console.log("Pushing to diceKeep", this.diceKeep)
        }

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

    resetAttempts() {
        this.state.attempt = 1;
        this.state.diceCount = 5;
    }

    ones() {
        this.selectionDone("upperSection", "ones")
        this.resetAttempts()
        this.pointsSum += this.diceKeep.filter(die => die === 1).length;
    }

    twos() {
        this.selectionDone("upperSection", "twos")
        this.resetAttempts()
        this.pointsSum += this.diceKeep.filter(die => die === 2).length * 2;
    }

    threes() {
        this.selectionDone("upperSection", "threes")
        this.resetAttempts()
        this.pointsSum += this.diceKeep.filter(die => die === 3).length * 3;
    }

    fours() {
        this.selectionDone("upperSection", "fours")
        this.resetAttempts()
        this.pointsSum += this.diceKeep.filter(die => die === 4).length * 4;
    }

    fives() {
        this.selectionDone("upperSection", "fives")
        this.resetAttempts()
        this.pointsSum += this.diceKeep.filter(die => die === 5).length * 5;
    }

    sixes() {
        this.selectionDone("upperSection", "sixes")
        this.resetAttempts()
        this.pointsSum += this.diceKeep.filter(die => die === 6).length * 6;
    }

    chance() {
        this.selectionDone("lowerSection", "chance")
        this.resetAttempts()
        this.pointsSum += this.sum();
    }

    yahtzee() {
        this.selectionDone("lowerSection", "yahtzee")
        this.resetAttempts()
        this.pointsSum += 50
    }

    fullHouse() {
        this.selectionDone("lowerSection", "fullHouse")
        this.resetAttempts()
        this.pointsSum += 25
    }

    fourOfAKind() {
        this.selectionDone("lowerSection", "fourOfAKind")
        this.resetAttempts()
        this.pointsSum += this.sum()
    }

    threeOfAKind() {
        this.selectionDone("lowerSection", "threeOfAKind")
        this.resetAttempts()
        this.pointsSum += this.sum()
    }

    smallStraight() {
        this.selectionDone("lowerSection", "smallStraight")
        this.resetAttempts()
        this.pointsSum += 30
    }

    largeStraight() {
        this.selectionDone("lowerSection", "largeStraight")
        this.resetAttempts()
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

            yahtzee.selectDice(Number(dice.innerText))
            dice.classList.add("added")
            dice.disabled = true
            console.log("Selecting dice", dice.innerText)
        });
    });

    const diceFields = [document.getElementById('dice1'),
        document.getElementById('dice2'),
        document.getElementById('dice3'),
        document.getElementById('dice4'),
        document.getElementById('dice5')]

    const updateRemainingRollCount = (attemptsLeft) => {
        document.getElementById('roll-count').innerText = attemptsLeft
        document.getElementById('roll-count-lang').innerText = attemptsLeft !== 1 ? "times" : "time"
    }
    const updateScore = () => {
        document.getElementById('score-info').innerText = yahtzee.pointsSum.toString()
    }

    const rollDice = document.getElementById('roll-button')
    rollDice.addEventListener('click', function () {
        const results = yahtzee.rollDice()
        console.log("Results", results)
        for (const field in diceFields) {
            console.log("Fields", field)
            const currentField = diceFields[`${field}`]
            if (currentField.style.backgroundColor !== 'brown') {
                diceFields[field].innerText = results[field]
            }
        }
        updateRemainingRollCount(yahtzee.state.attemptsLeft)

        if (yahtzee.state.attemptsLeft === 0) {
            rollDice.disabled = true
        }
    })
});

const yahtzee = new Yahtzee()

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
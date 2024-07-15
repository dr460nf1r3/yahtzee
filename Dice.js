// Create a new class for solving points in Yahtzee
class Yahtzee {
    dice = [];
    state = {diceCount: 5, attemptsLeft: 3, pointsSum: 0};
    diceKeep = []

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

    resetAttempts() {
        this.state.attempt = 1;
        this.state.diceCount = 5;
        console.log("Resetting attempts", this.state)
    }

    ones() {
        this.selectionDone("upperSection", "ones")
        this.resetAttempts()
        this.state.pointsSum += this.diceKeep.filter(die => die === 1).length;
    }

    twos() {
        this.selectionDone("upperSection", "twos")
        this.resetAttempts()
        this.state.pointsSum += this.diceKeep.filter(die => die === 2).length * 2;
    }

    threes() {
        this.selectionDone("upperSection", "threes")
        this.resetAttempts()
        this.state.pointsSum += this.diceKeep.filter(die => die === 3).length * 3;
    }

    fours() {
        this.selectionDone("upperSection", "fours")
        this.resetAttempts()
        this.state.pointsSum += this.diceKeep.filter(die => die === 4).length * 4;
        scorefours = this.diceKeep.filter(die => die === 4).length * 4;
        return scorefours
    }

    fives() {
        this.selectionDone("upperSection", "fives")
        this.resetAttempts()
        this.state.pointsSum += this.diceKeep.filter(die => die === 5).length * 5;
    }

    sixes() {
        this.selectionDone("upperSection", "sixes")
        this.resetAttempts()
        this.state.pointsSum += this.diceKeep.filter(die => die === 6).length * 6;
    }

    chance() {
        this.selectionDone("lowerSection", "chance")
        this.resetAttempts()
        this.state.pointsSum += this.sum();
    }

    yahtzee() {
        this.selectionDone("lowerSection", "yahtzee")
        this.resetAttempts()
        this.state.pointsSum += 50
    }

    fullHouse() {
        this.selectionDone("lowerSection", "fullHouse")
        this.resetAttempts()
        this.state.pointsSum += 25
    }

    fourOfAKind() {
        this.selectionDone("lowerSection", "fourOfAKind")
        this.resetAttempts()
        this.state.pointsSum += this.sum()
    }

    threeOfAKind() {
        this.selectionDone("lowerSection", "threeOfAKind")
        this.resetAttempts()
        this.state.pointsSum += this.sum()
    }

    smallStraight() {
        this.selectionDone("lowerSection", "smallStraight")
        this.resetAttempts()
        this.state.pointsSum += 30
    }

    largeStraight() {
        this.selectionDone("lowerSection", "largeStraight")
        this.resetAttempts()
        this.state.pointsSum += 40
    }

    selectionDone(section, method) {
        console.log("Selection done", section, method)
        const sectionIndex = this.remainingSection[`${section}`].indexOf(`${method}`)
        this.remainingSection[`${section}`].splice(sectionIndex, 1)
    }

    removeSelection(method) {
        this.selectionDone("upperSection", method)
    }

    bonusPoints() {
        if (this.state.pointsSum > 63) {
            this.state.pointsSum += 35
        }
    }
}
const yahtzee = new Yahtzee()

const updateScore = () => {
    document.getElementById('score-info').innerText = yahtzee.state.pointsSum.toString()
    console.log("UPDATE SCORE", yahtzee.state.pointsSum)
}
const updateGameState = () => {

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

    const rollDice = document.getElementById('roll-button');
    rollDice.addEventListener('click', function () {
    const results = yahtzee.rollDice();
    for (const field in diceFields) {
        console.log("Fields", field);
        const currentField = diceFields[`${field}`];
        if (currentField.style.backgroundColor !== 'brown') {
            diceFields[field].innerText = results.pop();
        }
    }

    updateRemainingRollCount(yahtzee.state.attemptsLeft);

    // Disable roll and keep buttons when no attempts are left
    if (yahtzee.state.attemptsLeft === 0) {
        rollDice.disabled = true;
        keepButtons.forEach(button => {
            button.disabled = true;
        });
        // Enable all score buttons
        document.querySelectorAll('td > button').forEach(button => {
            button.disabled = false;
        });
    }
    else if (yahtzee.state.attemptsLeft !== 3) {
            document.querySelectorAll('.outtercontainer > button').forEach(button => {
                button.disabled = false;
            });
        }
    else {
        
        // Optionally, ensure score buttons are disabled when there are attempts left
        document.querySelectorAll('td > button').forEach(button => {
            button.disabled = true;
        });

    }
});

document.addEventListener('DOMContentLoaded', function () {
    // Initially, score buttons are disabled until the game state changes
    document.querySelectorAll('td > button').forEach(button => {
        button.disabled = true;
    });
});
});

document.addEventListener('DOMContentLoaded', function () {
    // Select all score buttons
    const scoreButtons = document.querySelectorAll('td > button');
    console.log(scoreButtons)
    scoreButtons.forEach(button => {
        button.addEventListener('click', function () {
            console.log("IN SWITCH", button.id)
            // Call the function with the same name as the button's id
            switch (button.id) {
                case "ones":
                    yahtzee.ones();
                    break;
                case "twos":
                    yahtzee.twos();
                    break;
                case "threes":
                    yahtzee.threes();
                    break;
                case "fours":
                    yahtzee.fours();
                    break;
                case "fives":
                    yahtzee.fives();
                    break;
                case "sixes":
                    yahtzee.sixes();
                    break;
                case "ThreeOfAKind":
                    yahtzee.threeOfAKind();
                    break;
                case "FourOfAKind":
                    yahtzee.fourOfAKind();
                    break;
                case "FullHouse":
                    yahtzee.fullHouse();
                    break;
                case "SmallStraight":
                    yahtzee.smallStraight();
                    break;
                case "LageStraight":
                    yahtzee.largeStraight();
                    break;
                case "Yahtzee":
                    yahtzee.yahtzee();
                    break;
            }

            button.disabled = true;
            updateScore();
        });
    });
});


// Create a new class for solving points in Yahtzee
class Yahtzee {
    dice = [];
    state = {
        diceCount: 5,
        attemptsLeft: 3,
        pointsSum: 0,
        bonusCalculated: false,
    };
    diceKeep = []

    // Define the remaining sections of the game; this ensures we can't select the same section twice
    remainingSection = {
        upperSection: ["ones", "twos", "threes", "fours", "fives", "sixes"],
        lowerSection: ["threeOfAKind", "fourOfAKind", "fullHouse", "smallStraight", "largeStraight", "yahtzee", "chance"]
    }

    /**
     * Sums the dice array.
     * @returns {Number} The sum of the dice array
     */
    sum() {
        console.log("sum", this.dice.reduce((a, b) => a + b, 0))
        return this.dice.reduce((a, b) => a + b, 0);
    }

    /**
     * Selects the dice to keep and updates the remaining dice count.
     * @param dice Number of the dice to select
     */
    selectDice(dice) {
        // dice = Array of indexes of dice to select
        this.diceKeep.push(dice);
        this.state.diceCount = this.state.diceCount - 1;
    }

    /**
     * Rolls the dice and decrements the attempts left counter.
     * @returns {Number[]} Array of dice rolled
     */
    rollDice() {
        // count = Number of dice to roll
        let diceRolled = [];
        for (let i = 0; i < this.state.diceCount; i++) {
            diceRolled.push(Math.floor(Math.random() * 6) + 1);
        }
        this.dice = diceRolled;

        this.state.attemptsLeft -= 1;
        if (this.state.attemptsLeft === 0) {
            this.diceKeep.push(...diceRolled)
        }

        return diceRolled;
    }

    /**
     * Resets the attempts left and dice counters. Used at the end of each run.
     */
    resetAttempts() {
        this.state.attemptsLeft = 3;
        this.state.diceCount = 5;
    }

    /**
     * Calculate the score for the one's category.
     * @returns {Number} The points gained for this category
     */
    ones() {
        this.selectionDone("upperSection", "ones")
        this.resetAttempts()
        const score = this.diceKeep.filter(die => die === 1).length;
        this.state.pointsSum += score;
        return score
    }

    /**
     * Calculate the score for the two's category.
     * @returns {Number} The points gained for this category
     */
    twos() {
        this.selectionDone("upperSection", "twos")
        this.resetAttempts()
        const score = this.diceKeep.filter(die => die === 2).length * 2;
        this.state.pointsSum += score;
        return score
    }

    /**
     * Calculate the score for the three's category.
     * @returns {Number} The points gained for this category
     */
    threes() {
        this.selectionDone("upperSection", "threes")
        this.resetAttempts()
        const score = this.diceKeep.filter(die => die === 3).length * 3;
        this.state.pointsSum += score;
        return score
    }

    /**
     * Calculate the score for the four's category.
     * @returns {Number} The points gained for this category
     */
    fours() {
        this.selectionDone("upperSection", "fours")
        this.resetAttempts()
        const score = this.diceKeep.filter(die => die === 4).length * 4;
        this.state.pointsSum += score;
        return score
    }

    /**
     * Calculate the score for the five's category
     * @returns {Number} The points gained for this category
     */
    fives() {
        this.selectionDone("upperSection", "fives")
        this.resetAttempts()
        const score = this.diceKeep.filter(die => die === 5).length * 5;
        this.state.pointsSum += score;
        return score
    }

    /**
     * Calculate the score for the six's category
     * @returns {Number} The points gained for this category
     */
    sixes() {
        this.selectionDone("upperSection", "sixes")
        this.resetAttempts()
        const score = this.diceKeep.filter(die => die === 6).length * 6;
        this.state.pointsSum += score;
        return score
    }

    /**
     * Calculate the score for the chance category
     * @returns {Number} The points gained for this category
     */
    chance() {
        this.selectionDone("lowerSection", "chance")
        this.resetAttempts()
        const score = this.sum();
        this.state.pointsSum += score;
        return score
    }

    /**
     * Calculate the score for the Yahtzee category
     * @returns {Number} The points gained for this category
     */
    yahtzee() {
        this.selectionDone("lowerSection", "yahtzee")
        this.resetAttempts()
        const score = 50
        this.state.pointsSum += score;
        return score
    }

    /**
     * Calculate the score for the full house category
     * @returns {Number} The points gained for this category
     */
    fullHouse() {
        this.selectionDone("lowerSection", "fullHouse")
        this.resetAttempts()
        const score = 25
        this.state.pointsSum += score;
        return score
    }

    /**
     * Calculate the score for the four of a kind category
     * @returns {Number} The points gained for this category
     */
    fourOfAKind() {
        this.selectionDone("lowerSection", "fourOfAKind")
        this.resetAttempts()
        const score = this.sum()
        this.state.pointsSum += score;
        return score
    }

    /**
     * Calculate the score for the three of a kind category
     * @returns {Number} The points gained for this category
     */
    threeOfAKind() {
        this.selectionDone("lowerSection", "threeOfAKind")
        this.resetAttempts()
        const score = this.sum()
        this.state.pointsSum += score;
        return score
    }

    /**
     * Calculate the score for the small straight category
     * @returns {Number} The points gained for this category
     */
    smallStraight() {
        this.selectionDone("lowerSection", "smallStraight")
        this.resetAttempts()
        const score = 30
        this.state.pointsSum += score;
        return score
    }

    /**
     * Calculate the score for the large straight category
     * @returns {Number} The points gained for this category
     */
    largeStraight() {
        this.selectionDone("lowerSection", "largeStraight")
        this.resetAttempts()
        const score = 40
        this.state.pointsSum += score;
        return score
    }

    /**
     * Helper function to remove the selected method from the remaining section
     * @param section The just completed section to remove from the remaining section list
     * @param method The method that was just completed (ones, twos, etc.)
     */
    selectionDone(section, method) {
        console.log("Selection done", section, method)
        const sectionIndex = this.remainingSection[`${section}`].indexOf(`${method}`)
        this.remainingSection[`${section}`].splice(sectionIndex, 1)
    }

    /**
     * Calculate the bonus points if the upper section sum is greater than 63 and update all
     * corresponding sections.
     */
    bonusPoints() {
        if (this.state.pointsSum > 63) {
            const bonusTextElement = document.getElementById('score-bonus')
            bonusTextElement.innerText = "35"
            this.state.pointsSum += 35
            yahtzee.state.bonusCalculated = true
        }
    }
}

// Instantiate the Yahtzee class
const yahtzee = new Yahtzee()

/**
 * Updates the remaining roll count on the page including correct pluralization.
 * @param {number} attemptsLeft - The number of attempts left.
 */
const updateRemainingRollCount = (attemptsLeft) => {
    document.getElementById('roll-count').innerText = attemptsLeft.toString()
    document.getElementById('roll-count-lang').innerText = attemptsLeft !== 1 ? "times" : "time"
}

/**
 * Finish the current run by updating the score and resetting the dice and buttons.
 */
const finishRun = () => {
    const keepButtons = document.querySelectorAll('.innercontainer_lock');
    const rollDice = document.getElementById('roll-button')
    const scoreDisplay = document.getElementById('score-info')

    scoreDisplay.innerText = yahtzee.state.pointsSum
    rollDice.disabled = false
    keepButtons.forEach(button => {
        const number = button.id.replace(/\D/g, '');
        button.disabled = false
        const dice = document.getElementById(`dice${number}`);
        dice.style.backgroundColor = 'beige';
        dice.innerText = ""
    })

    if (yahtzee.remainingSection.upperSection.length === 0) {
        yahtzee.bonusPoints()
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Add event listener to each "Keep" button
    const keepButtons = document.querySelectorAll('.innercontainer_lock');
    keepButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Extract the number from the button's id
            const number = this.id.replace(/\D/g, '');

            // Find the corresponding dice
            const dice = document.getElementById(`dice${number}`);

            // Toggle the dices background color between green and beige
            if (dice) {
                if (dice.style.backgroundColor === 'brown') {
                    dice.style.backgroundColor = 'beige';
                } else {
                    dice.style.backgroundColor = 'brown';
                }
            }

            // Select the dice via our Yahtzee class
            yahtzee.selectDice(Number(dice.innerText))

            // Don't allow further modification to this button until the next run
            button.disabled = true
        });
    });

    const diceFields = [
        document.getElementById('dice1'),
        document.getElementById('dice2'),
        document.getElementById('dice3'),
        document.getElementById('dice4'),
        document.getElementById('dice5')
    ]

    const rollDice = document.getElementById('roll-button');
    rollDice.addEventListener('click', function () {
        // Roll the dice and update each field that hasn't been selected already
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

    document.querySelectorAll('td > button').forEach(button => {
        button.disabled = true;
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Select all score buttons
    const scoreButtons = document.querySelectorAll('td > button');
    scoreButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Call the function with the same name as the button's id
            const scoreElement = document.getElementById(`score-${button.id}`)
            let score = 0
            switch (button.id) {
                case "ones":
                    score = yahtzee.ones();
                    break;
                case "twos":
                    score = yahtzee.twos();
                    break;
                case "threes":
                    score = yahtzee.threes();
                    break;
                case "fours":
                    score = yahtzee.fours();
                    break;
                case "fives":
                    score = yahtzee.fives();
                    break;
                case "sixes":
                    score = yahtzee.sixes();
                    break;
                case "ThreeOfAKind":
                    score = yahtzee.threeOfAKind();
                    break;
                case "FourOfAKind":
                    score = yahtzee.fourOfAKind();
                    break;
                case "FullHouse":
                    score = yahtzee.fullHouse();
                    break;
                case "SmallStraight":
                    score = yahtzee.smallStraight();
                    break;
                case "LageStraight":
                    score = yahtzee.largeStraight();
                    break;
                case "Yahtzee":
                    score = yahtzee.yahtzee();
                    break;
            }

            button.disabled = true;
            scoreElement.innerText = score.toString();
            finishRun()
        });
    });
});


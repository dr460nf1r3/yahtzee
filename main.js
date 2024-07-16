/**
 * Class representing a Yazhtzee game, per player.
 * @class
 * @property {Number[]} dice - Array to store the dice that are rolled
 * @property {Object} state - Object to store the current state of the game
 * @property {Number} state.diceCount - Number of dice to roll
 * @property {Number} state.attemptsLeft - Number of attempts left
 * @property {Number} state.points.total - Sum of the points
 * @property {Boolean} state.bonusCalculated - Whether the bonus has been calculated
 * @property {Number[]} diceKeep - Array to store the dice that are kept, used for calculating the score
 * @property {Object} remainingSection - Object to store the remaining sections of the game
 * @property {String[]} remainingSection.upperSection - Remaining sections of the upper section
 * @property {String[]} remainingSection.lowerSection - Remaining sections of the lower section
 * @example const yahtzee = new Yahtzee()
 */
class Yahtzee {
    dice = [];
    state = {
        name: "Player 1",
        diceCount: 5,
        attemptsLeft: 3,
        points: {
            upperSection: 0,
            total: 0
        },
        bonusCalculated: false,
        tempKeep: {}
    };
    diceKeep = []

    // Define the remaining sections of the game; this ensures we can't select the same section twice
    remainingSection = {
        upperSection: ["ones", "twos", "threes", "fours", "fives", "sixes"],
        lowerSection: ["threeOfAKind", "fourOfAKind", "fullHouse", "smallStraight", "largeStraight", "yahtzee", "chance"]
    }

    /**
     * Create a Yahtzee game, optionally with a name of the player this game belongs to.
     * @param name {String} The name of the player
     */
    constructor(name = "Player 1") {
        this.state.name = name;
    }

    /**
     * Sums the dice array.
     * @returns {Number} The sum of the dice array
     */
    sum() {
        return this.diceKeep.reduce((a, b) => a + b, 0);
    }

    /**
     * Selects the dice to keep and updates the remaining dice count.
     * @param dice The dice HTMLElement to keep
     */
    selectDice(dice) {
        // Add the dice to the tempKeep array and decrement the dice count if it's not already in the array
        if (!this.state.tempKeep.hasOwnProperty(dice.id)) {
            this.state.tempKeep[dice.id] = dice.innerText
            this.state.diceCount--;
        } else {
            this.state.tempKeep[dice.id] = undefined
            this.state.diceCount++
        }
    }

    /**
     * Rolls the dice and decrements the attempts left counter.
     * @returns {Number[]} Array of dice rolled
     */
    rollDice() {
        // Roll the dice and store them in the dice array
        let diceRolled = [];
        for (let i = 0; i < this.state.diceCount; i++) {
            diceRolled.push(Math.floor(Math.random() * 6) + 1);
        }
        this.dice = diceRolled;
        this.state.attemptsLeft--;

        // If no attempts are left, add the remaining dice to the diceKeep array,
        // as it will be used for the score calculation
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
     * Calculate the score for the upper categories.
     * @param {Number} multiplier The multiplier for the category (1-6)
     * @returns {Number} The points gained for this category
     */
    onesToSixes(multiplier) {
        this.selectionDone("upperSection", this.remainingSection.upperSection[multiplier - 1])
        this.resetAttempts()
        const score = this.diceKeep.filter(number => number === multiplier).length * multiplier;
        this.addPoints(score, true)
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
        this.addPoints(score, false)
        return score
    }

    /**
     * Calculate the score for the Yahtzee category
     * @returns {Number} The points gained for this category
     */
    yahtzee() {
        const score = this.hasHitCountPoints(5)
        this.selectionDone("lowerSection", "yahtzee")
        this.resetAttempts()
        this.addPoints(score, false)
        return score
    }

    /**
     * Calculate the score for the full house category
     * @returns {Number} The points gained for this category
     */
    fullHouse() {
        const counts = {}
        this.diceKeep.forEach(function (x) {
            counts[x] = (counts[x] || 0) + 1;
        });

        const results = {
            2: 0,
            3: 0
        }

        Object.keys(results).forEach((key) => {
            Object.keys(counts).forEach((number) => {
                if (counts[number] === key) {
                    results[key] = number
                }
            })
        })

        this.selectionDone("lowerSection", "fullHouse")
        this.resetAttempts()

        let score
        if (results[2] === 0 || results[3] === 0) {
            score = 0
        } else {
            score = 25
        }
        this.addPoints(score, false)
        return score
    }

    /**
     * Calculate the score for the four of a kind category
     * @returns {Number} The points gained for this category
     */
    fourOfAKind() {
        const score = this.hasHitCountPoints(4)
        this.selectionDone("lowerSection", "fourOfAKind")
        this.resetAttempts()
        this.addPoints(score, false)
        return score
    }

    /**
     * Calculate the score for the three of a kind category
     * @returns {Number} The points gained for this category
     */
    threeOfAKind() {
        const score = this.hasHitCountPoints(3)
        this.selectionDone("lowerSection", "threeOfAKind")
        this.resetAttempts()
        this.addPoints(score, false)
        return score
    }

    /**
     * Calculate the score for the small straight category
     * @returns {Number} The points gained for this category
     */
    smallStraight() {
        this.selectionDone("lowerSection", "smallStraight")
        this.resetAttempts()
        let score;
        this.isValidStraight(4) ? score = 30 : score = 0
        this.addPoints(score, false)
        return score
    }

    /**
     * Calculate the score for the large straight category
     * @returns {Number} The points gained for this category
     */
    largeStraight() {
        this.selectionDone("lowerSection", "largeStraight")
        this.resetAttempts()
        let score;
        this.isValidStraight(5) ? score = 40 : score = 0
        this.addPoints(score, false)
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
        const bonusTextElement = document.getElementById('score-bonus')
        const upperScoreSumElement = document.getElementById("upper-sum")
        if (this.state.points.upperSection > 63) {
            bonusTextElement.innerText = "35"
            this.addPoints(35, false)
        } else {
            bonusTextElement.innerText = "None :("
        }
        upperScoreSumElement.innerText = this.state.points.upperSection
        yahtzee.state.bonusCalculated = true
    }

    /**
     * Check if the dice array contains a certain number of the same dice.
     * @param count The number of dice to check for
     * @return {number} The score if the dice array contains the given number of dice, 0 otherwise
     */
    hasHitCountPoints(count) {
        const counts = {}
        this.diceKeep.forEach(function (x) {
            counts[x] = (counts[x] || 0) + 1;
        });

        let result
        Object.keys(counts).forEach((number) => {
            if (counts[number] >= count) {
                result = number
            }
        })

        let score
        if (result) {
            // Special case: this is a Yahtzee
            if (count === 5) {
                score = 50
            } else {
                score = this.sum()
            }
            console.log("Score hit")
        } else {
            score = 0
            console.log("Score not hit")
        }

        return score
    }

    /**
     * Check if the dice array contains a straight of a certain kind.
     * @param kind The kind of straight to check for (4,5)
     * @return {boolean} A boolean indicating whether the dice array contains a straight of the given kind
     */
    isValidStraight(kind) {
        let straight = 0;
        let dice = this.diceKeep.sort();
        for (let i = 0; i < dice.length - 1; i++) {
            if (dice[i] + 1 === dice[i + 1]) {
                straight++;
            }
        }
        return straight >= kind;
    }

    /**
     * Add points to the total score and the upper section score, if applicable.
     * @param score The score to add
     * @param isUpper A boolean indicating whether the score should be added to the upper section
     */
    addPoints(score, isUpper) {
        this.state.points.total += score;
        if (isUpper) {
            this.state.points.upperSection += score;
        }
    }

    /**
     * Move the dice from the tempKeep array to the diceKeep array. Usually called when the user rolls the dice.
     */
    moveTempKeepToKeep() {
        for (const key in this.state.tempKeep) {
            if (this.state.tempKeep[key] !== undefined) {
                this.diceKeep.push(parseInt(this.state.tempKeep[key]))
            }
        }
        this.state.tempKeep = {}
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

const finishRollingDicePhase = () => {
    const keepButtons = document.querySelectorAll('.innercontainer_lock');
    const rollDice = document.getElementById('roll-button')

    rollDice.disabled = true;
    keepButtons.forEach(button => {
        button.disabled = true;
    });

    // Enable all score buttons that are not filled yet
    document.querySelectorAll('td > button').forEach(button => {
        if (!button.classList.contains("filled")) {
            button.disabled = false;
        }
    });
}

/**
 * Finish the current run by updating the score and resetting the dice and buttons.
 */
const finishRun = () => {
    const keepButtons = document.querySelectorAll('.innercontainer_lock');
    const rollDice = document.getElementById('roll-button')
    const scoreDisplay = document.getElementById('score-info')
    const scoreButtons = document.querySelectorAll('td > button')

    scoreDisplay.innerText = yahtzee.state.points.total
    rollDice.disabled = false
    keepButtons.forEach(button => {
        const number = button.id.replace(/\D/g, '');
        button.disabled = true
        const dice = document.getElementById(`dice${number}`);
        dice.style.backgroundColor = 'beige';
        dice.innerText = ""
    })
    scoreButtons.forEach(button => {
        button.disabled = true;
    })

    updateRemainingRollCount(yahtzee.state.attemptsLeft);
    yahtzee.diceKeep = []

    // React to special stages of the game, e.g., a fully filled upper section
    if (yahtzee.remainingSection.upperSection.length === 0 && !yahtzee.state.bonusCalculated) {
        yahtzee.bonusPoints()
    } else if (yahtzee.remainingSection.upperSection.length === 0 && yahtzee.remainingSection.lowerSection.length === 0) {
        // In case all sections are filled, we want to end the game
        alert(`Game over! Your final score is ${yahtzee.state.points.total}.`)
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
            if (dice.style.backgroundColor === 'brown') {
                dice.style.backgroundColor = 'beige';
            } else {
                dice.style.backgroundColor = 'brown';
            }

            // Select the dice via our Yahtzee class
            yahtzee.selectDice(dice)

            if (yahtzee.state.diceCount === 0) {
                finishRollingDicePhase()
            }
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
        // Move the dice from the tempKeep array to the diceKeep array, as the user has rolled the dice
        yahtzee.moveTempKeepToKeep()

        // Roll the dice and update each field that hasn't been selected already
        const results = yahtzee.rollDice();
        updateDiceDisplay(results);

        // Create a (non-referencing) copy of the result array to avoid modifying the original array
        const resultsCopy = [...results];
        for (const field in diceFields) {
            const currentField = diceFields[`${field}`];
            if (currentField.style.backgroundColor !== 'brown') {
                diceFields[field].innerText = resultsCopy.pop().toString();
            }
        }

        updateRemainingRollCount(yahtzee.state.attemptsLeft);

        // Disable roll and keep buttons when no attempts are left
        if (yahtzee.state.attemptsLeft === 0) {
            finishRollingDicePhase()
        } else if (yahtzee.state.attemptsLeft !== 3) {
            document.querySelectorAll('.outtercontainer > button').forEach(button => {
                button.disabled = false;
            });
        } else {
            // Optionally, ensure score buttons are disabled when there are attempts left
            document.querySelectorAll('td > button').forEach(button => {
                button.disabled = true;
            });

        }
    });

    document.querySelectorAll('td > button').forEach(button => {
        button.disabled = true;
    });

    // Select all score buttons
    const scoreButtons = document.querySelectorAll('td > button');
    scoreButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Call the function with the same name as the button's id
            const scoreElement = document.getElementById(`score-${button.id}`)
            let score = 0
            switch (button.id) {
                case "ones":
                    score = yahtzee.onesToSixes(1);
                    break;
                case "twos":
                    score = yahtzee.onesToSixes(2);
                    break;
                case "threes":
                    score = yahtzee.onesToSixes(3);
                    break;
                case "fours":
                    score = yahtzee.onesToSixes(4);
                    break;
                case "fives":
                    score = yahtzee.onesToSixes(5);
                    break;
                case "sixes":
                    score = yahtzee.onesToSixes(6);
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
                case "LargeStraight":
                    score = yahtzee.largeStraight();
                    break;
                case "Yahtzee":
                    score = yahtzee.yahtzee();
                    break;
            }
            button.disabled = true;
            button.classList.add("filled")
            scoreElement.innerText = score.toString();
            finishRun()
        });
    });
});

function updateDiceDisplay(diceArray) {
    const diceElement = document.getElementById('dice1');
    console.log(diceElement, )
    diceElement.className = 'innercontainer';

    if (diceArray[0] === 1)
        diceElement.classList.add('dice-1');
    else if (diceArray[0] === 2)
        diceElement.classList.add('dice-1');
    else if (diceArray[0] === 3)
        diceElement.classList.add('dice-1');
    else if (diceArray[0] === 4)
        diceElement.classList.add('dice-1');
    else if (diceArray[0] === 5)
        diceElement.classList.add('dice-1');
    else if (diceArray[0] === 6)
        diceElement.classList.add('dice-1');
}


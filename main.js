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

        // Loop through the counts and check if we have a full house,
        // while ensuring both being an integer when comparing values
        Object.keys(counts).forEach((key) => {
            Object.keys(results).forEach((amount) => {
                if (parseInt(counts[key]) === parseInt(amount)) {
                    results[amount] = counts[key]
                }
            })
        })

        this.selectionDone("lowerSection", "fullHouse")
        this.resetAttempts()

        let score
        if (results[2] === 0 || results[3] === 0) {
            score = 0
            console.log("No full house")
        } else {
            score = 25
            console.log("Full house")
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
        this.state.bonusCalculated = true
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
        } else {
            score = 0
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
        this.diceKeep = [1, 5, 2, 3, 4];
        let dice = this.diceKeep.sort();
        straight = 1;
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

class YahtzeeGame {
    players = {}
    state = {
        playerTurn: 0
    }

    /**
     * Create a Yahtzee game with a number of players.
     * It allows creating a game with multiple players, but the current implementation hardcodes it to two players.
     * @param names The names of the players as an array of strings
     */
    constructor(...names) {
        for (const name of names) {
            const index = Object.keys(this.players).length === 0 ? 0 : Object.keys(this.players).length++
            this.players[`${index}`] = new Yahtzee(name)
        }
    }

    /**
     * Add a player to the game.
     * @param name The name of the player to add
     */
    addPlayer(name) {
        this.players[this.players.length++] = new Yahtzee(name)
    }

    /**
     * Get the current player Yahtzee object.
     * @return {*} The current player object
     */
    currentPlayer() {
        return this.players[this.state.playerTurn]
    }

    /**
     * Move to the next player in the game.
     */
    nextPlayer() {
        const isLastPlayer = this.state.playerTurn === Object.keys(this.players).length - 1
        this.state.playerTurn = isLastPlayer ? 0 : this.state.playerTurn + 1
    }
}

// Instantiate the Yahtzee class with hardcoded player names
const yahtzeeGame = new YahtzeeGame("Player 1", "Player 2")

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
    const player = yahtzeeGame.currentPlayer()

    scoreDisplay.innerText = player.state.points.total
    rollDice.disabled = false
    keepButtons.forEach(button => {
        const number = button.id.replace(/\D/g, '');
        button.disabled = true
        const dice = document.getElementById(`dice${number}`);
        dice.classList.remove("keeping")
        dice.innerText = ""
    })
    scoreButtons.forEach(button => {
        button.disabled = true;
    })

    updateRemainingRollCount(player.state.attemptsLeft);
    player.diceKeep = []

    // React to special stages of the game, e.g., a fully filled upper section
    if (player.remainingSection.upperSection.length === 0 && !player.state.bonusCalculated) {
        player.bonusPoints()
    } else if (player.remainingSection.upperSection.length === 0 && player.remainingSection.lowerSection.length === 0) {
        // In case all sections are filled, we want to end the game
        alert(`Game over! Your final score is ${player.state.points.total}.`)
    }

    // Update the player turn
    yahtzeeGame.nextPlayer()
}


document.addEventListener('DOMContentLoaded', function () {
    // Add event listener to each "Keep" button
    const keepButtons = document.querySelectorAll('.innercontainer_lock');
    const player = yahtzeeGame.currentPlayer()

    keepButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Extract the number from the button's id
            const number = this.id.replace(/\D/g, '');

            // Find the corresponding dice
            const dice = document.getElementById(`dice${number}`);
            
            // Toggle the dices background color between green and beige
            if (dice.classList.contains("keeping")) {
                dice.classList.remove("keeping")
            } else {
                dice.classList.add("keeping")
            }

            // Select the dice via our Yahtzee class
            player.selectDice(dice)

            if (player.state.diceCount === 0) {
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
        const player = yahtzeeGame.currentPlayer();

        // Move the dice from the tempKeep array to the diceKeep array, as the user has rolled the dice
        player.moveTempKeepToKeep()

        // Create a (non-referencing) copy of the result array to avoid modifying the original array
        const results = player.rollDice();

        // Update each field that hasn't been selected already
        for (const field in diceFields) {
            const currentField = diceFields[`${field}`];
            if (!currentField.classList.contains('keeping')) {
                diceFields[field].innerText = results.pop().toString();
            }
        }

        updateDiceDisplay(diceFields);
        updateRemainingRollCount(player.state.attemptsLeft);

        // Disable roll and keep buttons when no attempts are left
        if (player.state.attemptsLeft === 0) {
            finishRollingDicePhase()
        } else if (player.state.attemptsLeft !== 3) {
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
            const player = yahtzeeGame.currentPlayer();
            // Call the function with the same name as the button's id
            const scoreElement = document.getElementById(`score-${button.id}-${yahtzeeGame.state.playerTurn + 1}`)
            let score = 0
            switch (button.id) {
                case "ones":
                    score = player.onesToSixes(1);
                    break;
                case "twos":
                    score = player.onesToSixes(2);
                    break;
                case "threes":
                    score = player.onesToSixes(3);
                    break;
                case "fours":
                    score = player.onesToSixes(4);
                    break;
                case "fives":
                    score = player.onesToSixes(5);
                    break;
                case "sixes":
                    score = player.onesToSixes(6);
                    break;
                case "ThreeOfAKind":
                    score = player.threeOfAKind();
                    break;
                case "FourOfAKind":
                    score = player.fourOfAKind();
                    break;
                case "FullHouse":
                    score = player.fullHouse();
                    break;
                case "SmallStraight":
                    score = player.smallStraight();
                    break;
                case "LargeStraight":
                    score = player.largeStraight();
                    break;
                case "Yahtzee":
                    score = player.yahtzee();
                    break;
            }
            button.disabled = true;
            button.classList.add("filled")
            scoreElement.innerText = score.toString();
            finishRun()
        });
    });

    document.getElementById('resetGameButton').addEventListener('click', function () {
        location.reload();
    });
});

function updateDiceDisplay(diceElements) {
    for (let element in diceElements) {
        // If we are keeping an element, we don't want to change the dice class
        if (diceElements[element].classList.contains("keeping")) {
            continue;
        }

        // Ensure no dice classes are set
        diceElements[element].classList = ["innercontainer"];

        switch (diceElements[element].innerText) {
            case "1":
                diceElements[element].classList.add('dice-1');
                break;
            case "2":
                diceElements[element].classList.add('dice-2');
                break;
            case "3":
                diceElements[element].classList.add('dice-3');
                break;
            case "4":
                diceElements[element].classList.add('dice-4');
                break;
            case "5":
                diceElements[element].classList.add('dice-5');
                break;
            case "6":
                diceElements[element].classList.add('dice-6');
                break;
        }

        // We don't need this anymore, as the dice are now displayed in the inner container
        diceElements[element].innerText = "";
    }
}

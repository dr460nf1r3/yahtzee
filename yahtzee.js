// Create a new class for solving points in Yahtzee

export class Yahtzee {
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
        dice.forEach(i => {
            this.diceKeep.push(this.dice[i]);
        });
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

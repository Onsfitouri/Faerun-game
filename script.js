class Warrior {
    constructor(type, hp, force, imageSrc) {
        this.type = type;
        this.hp = hp;
        this.force = force;
        this.imageSrc = imageSrc;
    }

    attack() {
        let damage = 0;
        for (let i = 0; i < this.force; i++) {
            damage += Math.floor(Math.random() * 3) + 1; // 3-faced die roll
        }
        return damage;
    }

    takeDamage(damage) {
        this.hp -= damage;
    }
}

class Dwarf extends Warrior {
    constructor() {
        super('Dwarf', 100, 10, 'dwarf.png');
    }

    takeDamage(damage) {
        this.hp -= damage / 2;
    }
}

class Elf extends Warrior {
    constructor() {
        super('Elf', 100, 20, 'elf.png');
    }
}

class DwarfChief extends Dwarf {
    constructor() {
        super();
        this.type = 'DwarfChief';
        this.imageSrc = 'dwarf_chief.png';
    }

    takeDamage(damage) {
        this.hp -= damage / 4;
    }
}

class ElfChief extends Elf {
    constructor() {
        super();
        this.type = 'ElfChief';
        this.force = 40;
        this.imageSrc = 'elf_chief.png';
    }
}

class Castle {
    constructor(color) {
        this.color = color;
        this.resources = 3;
        this.warriors = [];
    }

    trainWarrior(type) {
        let warrior;
        let cost;
        switch (type) {
            case 'Dwarf':
                warrior = new Dwarf();
                cost = 1;
                break;
            case 'Elf':
                warrior = new Elf();
                cost = 2;
                break;
            case 'DwarfChief':
                warrior = new DwarfChief();
                cost = 3;
                break;
            case 'ElfChief':
                warrior = new ElfChief();
                cost = 4;
                break;
            default:
                warrior = new Warrior('Base', 100, 10, 'warrior.png');
                cost = 1;
        }

        if (this.resources >= cost) {
            this.resources -= cost;
            this.warriors.push(warrior);
            console.log(`${type} trained for Castle ${this.color}`);
        } else {
            console.log(`Not enough resources to train ${type}`);
        }
        this.updateTrainedWarriorsList();
    }

    updateTrainedWarriorsList() {
        const castleId = this.color === 'Blue' ? 'blue-trained-warriors' : 'red-trained-warriors';
        const listElement = document.getElementById(castleId);
        listElement.innerHTML = '';
        this.warriors.forEach(warrior => {
            const listItem = document.createElement('li');
            const imageElement = document.createElement('img');
            imageElement.src = warrior.imageSrc;
            imageElement.alt = warrior.type;
            listItem.appendChild(imageElement);
            listElement.appendChild(listItem);
        });
    }

    regenerateResources() {
        this.resources += 1;
    }
}

class Game {
    constructor() {
        this.gridSize = 5;
        this.grid = [];
        this.blueCastle = new Castle('Blue');
        this.redCastle = new Castle('Red');
        this.initGrid();
    }

    initGrid() {
        const gridElement = document.getElementById('grid');
        gridElement.innerHTML = '';
        for (let i = 0; i < this.gridSize; i++) {
            this.grid[i] = { blue: [], red: [] };
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.id = `cell-${i}`;
            gridElement.appendChild(cell);
        }
    }

    updateGrid() {
        for (let i = 0; i < this.gridSize; i++) {
            const cell = document.getElementById(`cell-${i}`);
            cell.innerHTML = '';
            this.grid[i].blue.forEach(warrior => {
                const warriorElement = document.createElement('img');
                warriorElement.src = warrior.imageSrc;
                warriorElement.alt = warrior.type;
                warriorElement.classList.add('warrior');
                cell.appendChild(warriorElement);
            });
            this.grid[i].red.forEach(warrior => {
                const warriorElement = document.createElement('img');
                warriorElement.src = warrior.imageSrc;
                warriorElement.alt = warrior.type;
                warriorElement.classList.add('warrior');
                cell.appendChild(warriorElement);
            });
        }
    }

    moveWarriors() {
        // Move blue warriors
        for (let i = this.gridSize - 2; i >= 0; i--) {
            if (this.grid[i + 1].red.length === 0) {
                this.grid[i + 1].blue = this.grid[i].blue;
                this.grid[i].blue = [];
            }
        }
        // Move red warriors
        for (let i = 1; i < this.gridSize; i++) {
            if (this.grid[i - 1].blue.length === 0) {
                this.grid[i - 1].red = this.grid[i].red;
                this.grid[i].red = [];
            }
        }
    }
    

    resolveCombat() {
        for (let i = 0; i < this.gridSize; i++) {
            if (this.grid[i].blue.length > 0 && this.grid[i].red.length > 0) {
                const blueWarriors = this.grid[i].blue;
                const redWarriors = this.grid[i].red;
                let blueIndex = 0;
                let redIndex = 0;
                while (blueIndex < blueWarriors.length && redIndex < redWarriors.length) {
                    const blueWarrior = blueWarriors[blueIndex];
                    const redWarrior = redWarriors[redIndex];
                    const blueDamage = blueWarrior.attack();
                    const redDamage = redWarrior.attack();
                    redWarrior.takeDamage(blueDamage);
                    blueWarrior.takeDamage(redDamage);
                    if (blueWarrior.hp <= 0) {
                        blueWarriors.splice(blueIndex, 1); // Remove dead blue warrior
                        console.log("blue worrior removed")
                    } else {
                        blueIndex++;
                    }
                    if (redWarrior.hp <= 0) {
                        redWarriors.splice(redIndex, 1); // Remove dead red warrior
                        console.log("red worrior removed")
                    } else {
                        redIndex++;
                    }
                }
            } 
        }
    }

    startGame() {
        // Place trained warriors on the grid before starting the game
   for (let i = 0; i < this.blueCastle.warriors.length; i++) {
       this.grid[0].blue.push(this.blueCastle.warriors[i]);
   }
   for (let i = 0; i < this.redCastle.warriors.length; i++) {
       this.grid[this.gridSize - 1].red.push(this.redCastle.warriors[i]);
   }

   // Log the initial positions of the warriors
   console.log('Initial positions of warriors:');
   console.log('Blue warriors:', this.grid[0].blue);
   console.log('Red warriors:', this.grid[this.gridSize - 1].red);
   
       const intervalId = setInterval(() => {
           this.blueCastle.regenerateResources();
           this.redCastle.regenerateResources();
           this.blueCastle.updateTrainedWarriorsList();
           this.redCastle.updateTrainedWarriorsList();
           this.updateGrid();
           this.moveWarriors();
           this.resolveCombat();
           

           // Check if a blue warrior reached the red castle
           if (this.grid[this.gridSize - 1].red.length > 0) {
               clearInterval(intervalId);
               const gameResultElement = document.getElementById('game-result');
               gameResultElement.innerText = 'Blue Castle Wins! Game Over.';
               gameResultElement.style.display = 'block';
               console.log("Blue Castle Wins! Game Over.")
               
           }
           
           // Check if a red warrior reached the blue castle
           if (this.grid[0].blue.length > 0) {
               clearInterval(intervalId);
               const gameResultElement = document.getElementById('game-result');
               gameResultElement.innerText = 'Red Castle Wins! Game Over.';
               gameResultElement.style.display = 'block';
               console.log("Red Castle Wins! Game Over.")
           }
       }, 1000);
   }
   
}

const game = new Game();

function trainWarrior(color, type) {
    if (color === 'Blue') {
        game.blueCastle.trainWarrior(type);
    } else if (color === 'Red') {
        game.redCastle.trainWarrior(type);
    }
}

function startGame() {
    game.startGame();
    console.log("start game ")
    // Change the background image
    changeBackgroundImage('1.jpg');
    // Play the audio
    var audio = document.getElementById('start-game-audio');
    audio.play();
}
function changeBackgroundImage(imageUrl) {
    document.body.style.backgroundImage = `url(${imageUrl})`;
    document.body.style.backgroundSize = 'cover'; // Ensure the background covers the whole page
}

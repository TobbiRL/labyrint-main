import { ANSI } from "./utils/ANSI.mjs";
import KeyBoardManager from "./utils/KeyBoardManager.mjs";
import { readMapFile, readRecordFile } from "./utils/fileHelpers.mjs";
import * as CONST from "./constants.mjs";

const startingLevel = CONST.START_LEVEL_ID;
const startingLevelReEntry = CONST.START_LEVEL_RE_ENTRY_ID;
const secondLevel = CONST.SECOND_LEVEL_ID;
const secondLevelReEntry = CONST.SECOND_LEVEL_RE_ENTRY_ID;
const thirdLevel = CONST.THIRD_LEVEL_ID;
const levels = loadLevelListings();
const CHAR = {
    space: " ",
    empty: "",
    hero: "H",
    loot: "$",
    guard: "X",
    hp_potion: "P",
    door: {
        one: "D",
        two: "d",
        three: "G",
        four: "g",
    },
    teleporter: "T",
    itemSplit: ":",

}
const THINGS = [CHAR.loot, CHAR.space, CHAR.hp_potion];
const ENEMIES = [CHAR.guard];
const LEVEL_CHANGE = [CHAR.door.one, CHAR.door.two, CHAR.door.three, CHAR.door.four];
const TRANSPORTATION = [CHAR.teleporter];
const HP_MAX = 10;

const playerStats = {
    hp: 10,
    cash: 0
}
const EVENT_TEXT = {
    gate: `You entered a gate!`,
    door: `You entered a door!`,
    teleported: `*Teleporter noise*`,
    playerGained: `Player gained `,
    loot: {
        money: `$`,
        heart: `♥︎`,
    },
    defeatGuard: `You defeated the guard, but took `,
    damage: ` damage`,
}

let levelData = readMapFile(levels[startingLevel]);
let level = levelData;
let pallet = {
    "█": ANSI.COLOR.LIGHT_GRAY,
    "H": ANSI.COLOR.GREEN,
    "$": ANSI.COLOR.YELLOW,
    "B": ANSI.COLOR.RED,
    "P": ANSI.COLOR.YELLOW,
    "D": ANSI.COLOR.BLACK,
    "d": ANSI.COLOR.BLACK,
    "G": ANSI.COLOR.BLACK,
    "g": ANSI.COLOR.BLACK,
    "X": ANSI.COLOR.RED,
}
let isDirty = true;
let playerPos = {
    row: null,
    col: null,
}
let enemyPos = {
    row: null,
    col: null,
}
let direction = -1;
let eventText = CHAR.empty;
class Labyrinth {

    update() {

        identifyPlayer();

        let drow = 0;
        let dcol = 0;

        if (KeyBoardManager.isUpPressed()) {
            drow = -1;
        } else if (KeyBoardManager.isDownPressed()) {
            drow = 1;
        }

        if (KeyBoardManager.isLeftPressed()) {
            dcol = -1;
        } else if (KeyBoardManager.isRightPressed()) {
            dcol = 1;
        }

        let tRow = playerPos.row + (1 * drow);
        let tcol = playerPos.col + (1 * dcol);

        if (THINGS.includes(level[tRow][tcol])) {

            let currentItem = level[tRow][tcol];
            if (currentItem == CHAR.loot) {
                let loot = Math.round(Math.random() * 7) + 3;
                playerStats.cash += loot;
                eventText = EVENT_TEXT.playerGained + loot + EVENT_TEXT.loot.money;
            }
            if (currentItem == CHAR.hp_potion) {
                let recovery = Math.round(Math.random() * 4) + 2;
                playerStats.hp += recovery;
                eventText = EVENT_TEXT.playerGained + recovery + EVENT_TEXT.loot.heart;
            }

            level[playerPos.row][playerPos.col] = CHAR.space;
            level[tRow][tcol] = CHAR.hero;

            playerPos.row = tRow;
            playerPos.col = tcol;

            isDirty = true;
        } else {
            direction *= -1;
        }

        if (LEVEL_CHANGE.includes(level[tRow][tcol])) {
            
            let doorSymbol = level[tRow][tcol];
            if (doorSymbol == CHAR.door.one) {
                changeLevelTo(secondLevel);
                eventText = EVENT_TEXT.door;
            } 
            else if (doorSymbol == CHAR.door.two) {
                changeLevelTo(startingLevelReEntry);
                eventText = EVENT_TEXT.door;
            }
            else if (doorSymbol == CHAR.door.three) {
                changeLevelTo(thirdLevel);
                eventText = EVENT_TEXT.gate;
            }
            else if (doorSymbol == CHAR.door.four) {
                changeLevelTo(secondLevelReEntry);
                eventText = EVENT_TEXT.gate;
            }
            
            playerPos.row = null;
            drow = 0;
            dcol = 0; 

            identifyPlayer();
            
            isDirty = true;
        }

        if (TRANSPORTATION.includes(level[tRow][tcol])) {
            let transporter = level[tRow][tcol];
            if (transporter == CHAR.teleporter) {
                teleportPlayer(tRow, tcol); 
            }
            
            isDirty = true

            eventText = EVENT_TEXT.teleported;
        }

        let xRow = 0;
        let xCol = 0;

        let nRow = enemyPos.row + (1 * xRow);
        let nCol = enemyPos.col + (1 * xCol);


        if (ENEMIES.includes(level[nRow][nCol])) {
            let currentEnemy = level[nRow][nCol];
            if (currentEnemy == CHAR.guard) {
                level[enemyPos.row][enemyPos.col] = CHAR.space;
                level[nRow][nCol] = CHAR.guard;
                    if (enemyPos.row == null) {
                        for (let row = 0; row < level.length; row++) {
                            for (let col = 0; col < level[row].length; col++) {
                            if (level[row][col] == CHAR.guard) {

                                enemyPos.row = row;
                                enemyPos.col = col;
                                break;
                            }
                            }
                            if (enemyPos.row != undefined) {
                                break;
                            }
                        }
                        for (let i = 0; i < 3; i++) {
                        xRow = i
                        isDirty = true;
                        }
                    }  
            isDirty = true;
            }
        }


        if (ENEMIES.includes(level[tRow][tcol])) { 
            
            let currentEnemy = level[tRow][tcol];
            if (currentEnemy == CHAR.guard) {

                guardDamage(tRow, tcol);
        
            } else {
            direction *= -1;
            }
        }
    }

    draw() {

        if (isDirty == false) {
            return;
        }
        isDirty = false;

        console.log(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME);

        let rendring = CHAR.empty;

        rendring += renderHud();

        for (let row = 0; row < level.length; row++) {
            let rowRendering = "";
            for (let col = 0; col < level[row].length; col++) {
                let symbol = level[row][col];
                if (pallet[symbol] != undefined) {
                    rowRendering += pallet[symbol] + symbol + ANSI.COLOR_RESET;
                } else {
                    rowRendering += symbol;
                }
            }
            rowRendering += "\n";
            rendring += rowRendering;
        }

        console.log(rendring);
        if (eventText != CHAR.empty) {
            console.log(eventText);
            eventText = CHAR.empty;
        }
    }
}

function loadLevelListings(source = CONST.LEVEL_LISTING_FILE) {
    let data = readRecordFile(source);
    let levels = {};
    for (const item of data) {
        let keyValue = item.split(":");
        if (keyValue.length >= 2) {
            let key = keyValue[0];
            let value = keyValue[1];
            levels[key] = value;
        }
    }
    return levels;
}

function changeLevelTo(enterLevel) {
    levelData = readMapFile(levels[enterLevel]);
    level = levelData;
}

function teleportPlayer(tRow, tcol) {
    level[playerPos.row][playerPos.col] = CHAR.space;
    level[tRow][tcol] = CHAR.space;
    playerPos.row = null;

    if (playerPos.row == null) {
        for (let row = 0; row < level.length; row++) {
            for (let col = 0; col < level[row].length; col++) {
                if (level[row][col] == CHAR.teleporter) {

                    level[row][col] = CHAR.hero;
                    playerPos.row = row;
                    playerPos.col = col;

                    break;
                }
            }
            if (playerPos.row != undefined) {
                break;
            }
        }
    }
}

function guardDamage(tRow, tcol) {
    let damage = Math.round(Math.random() * 3) + 1;
    playerStats.hp -= damage;
    eventText = EVENT_TEXT.defeatGuard + damage + EVENT_TEXT.damage;

    level[playerPos.row][playerPos.col] = CHAR.space;
    level[tRow][tcol] = CHAR.hero;

    playerPos.row = tRow;
    playerPos.col = tcol;


    isDirty = true;
}

function identifyPlayer() {
    if (playerPos.row == null) {
        for (let row = 0; row < level.length; row++) {
            for (let col = 0; col < level[row].length; col++) {
                if (level[row][col] == CHAR.hero) {
                    playerPos.row = row;
                    playerPos.col = col;
                    break;
                }
            }
            if (playerPos.row != undefined) {
                break;
            }
        }
    }
}

function renderHud() {
    let hpBar = `Life:[${ANSI.COLOR.RED + pad(playerStats.hp, EVENT_TEXT.loot.heart) + ANSI.COLOR_RESET}${ANSI.COLOR.LIGHT_GRAY + pad(HP_MAX - playerStats.hp, EVENT_TEXT.loot.heart) + ANSI.COLOR_RESET}]`
    let cash = `$:${playerStats.cash}`;
    return `${hpBar} ${cash}\n`;
}

function pad(len, text) {
    let output = CHAR.empty;
    for (let i = 0; i < len; i++) {
        output += text;
    }
    return output;
}

export default Labyrinth;
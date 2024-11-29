You must work from the code as given. Refactoring is encouraged and expected, but the integrity of the given approach must be maintained.  
**In your submission, you must include a listing of which functionalities from the list below you have implemented.** 

Any feature marked with ** is considered compulsory. Some features are interdependent and might requier you to do them in a spesific order (this is part of the challange to figure out). We have made cirtain that the code includes examples of everything you will need to do. You complete as many features as you are able to while wrting good clean code. 

The game is started with the command : <code>node game.mjs</code>

## Features (Tasks)
** The starting level has an empty slot in the surrounding wall. This slot should function as a door into the level called "aSharpPlace." Implement the door functionality so that the player can proceed to the next level.  Done
** Create a new level (a third level) and link the unused door in "aSharpPlace" to exit into the new room.  Done
** In "aSharpPlace," implement teleport functionality for the "♨︎" symbols. Entering one should move the player to the other.  Done
** Ensure that when going back through a door, the player returns to the correct room. Done
** Make the X NPC characters perform a simple patrol (+/-2 from their starting locations). 
** Create an animated splash screen (this was a group assignment from a previous week) using `splashScreen.mjs`. Done

* Give the NPCs stats, such as strength and hitpoints. 
* Implement a simple battle system where collisions deal damage, using player and NPC stats to calculate damage dealt. DONE (kinda), added NPC damage, but they are 1 hp, so they instantly die.  
* Output battle events to the event messages displayed beneath the map. DONE 
* Have event messages remain on screen longer (currently, they only survive one update cycle).  
* Create two new pickups: a health potion and poison, and include them in your level. DONE (kinda), made a health potion
* Make the B NPC shoot projectiles when the hero is close; projectiles must be visible and move in a straight line.  
* Create a menu with at least two options: Play and Exit.  
* Implement a more complex combat system.  
* Have environment items like "◀︎" deal damage.  
* Create a new NPC with an area effect ability.  
* Add weapons as pickups and have them influence battles.  
* Refactor the `labyrinth.mjs` code file to improve its structure; for instance, level loading logic does not belong there. Did some refactoring to make code look better / more readable
* When a character takes damage, briefly color the background of that character red.  
* Display NPC stats during battles.  
* Center the level on the screen.  
* Implement a variation of the Warcraft I cheat codes, such as "There can be only one" and "Pot of gold."  
* Add a shop where the player can buy health potions (and potentially weapons).  
* Implement a dynamic palette per level instead of the current static palette (as discussed in class).  
* Create a save game system that allows the player to resume with the same level and stats after restarting the game.  
* Lett the player decide what the movment keys should be (or suport awsd+space as whell as arrows + space)
* Add a jump to level cheat, where if the player knows a "secret" code the player can jump to that level. For this to work each level must show a level code when the player enters the room. 
* implement a intresting feature we have not thought of for the game (Alexander: ou do not have time to do quests ). 
  
#   P o r t f o l i o 4 L a b y r i n t h 
 
 
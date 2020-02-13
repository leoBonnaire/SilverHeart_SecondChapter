
/*

	Author :  Charlie Brown
	Date   :  20 / 08 / 2019
	
*/

var i = 0, j = 0, 
time = 25,  // time beetween each letter writing
textSpeed = time * 100 / 250;  // text speed calculated with the time beetween the writing of each letter
var bag = [], dialog = []; // bag : place of your objects      dialog : array containing the dialogs
var isWriting,
buttonsOn = false,  // button displayed
ableToWrite = true,
danger = false;  // Perfect control of the text flow
;

var colore = '#d9d9d9', // Color of the text
mode = 'type';  // Type mode

setTimeout(function(){say("µWelcome to SilverHeart II.      µPress [5] to change the type mode.                Use the [UP] and [DOWN] arrows to set the text speed and,      please, press [F11] for a better game experience.                     µPress any key to start.", '#d9d9d9');}, 1000);  // Instructions

setTimeout(function() { setPath('start'); } , 1500) // Go to the first dialog set

function typeWriter(txt, elem) {  // Type writing animation
	if(ableToWrite) {
	  window.scrollBy(0, 1000); // Always scroll the page to see the text
	  isWriting = true;  // Text is writing, do not play any dialog
	  if (j < txt.length) {
		if(txt.charAt(j) == 'µ') elem.innerHTML += '<br>'; // Replace µ with a line jump
		else elem.innerHTML += txt.charAt(j);
		j++;
		setTimeout(function() {typeWriter(txt, elem);}, time);
	  }
	  else {
		elem.innerHTML += '  []';  // Add [] to indicate the end of the dialog
		isWriting = false;  // text is not writing anymore
	  }
    } 
	else {
	  elem.innerHTML += '  []'; // Add [] to indicate the end of the dialog
      isWriting = false;  // text is not writing anymore
	}
}

function say(text, colore) {  // Function to write the text on the screen
  var f = document.createElement("span");  // Create a <span>
  f.style.color = colore;  // Set the color text
  if(mode == 'type') {
	  f.innerHTML = '<br>'; // Return to line before writing
	  j = 0;
	  document.getElementsByTagName('header')[0].appendChild(f); // Add f (the span element) to the header
	  typeWriter(text, f);  // Use typeWrite animation to write
  }
  else if(mode == 'fast') {
	  f.setAttribute('class',"w3-animate-left");  // Use the left slide animation of w3
	  text = text.replace(/µ/g, '<br>')  // Replace all the µ with line jumps
	  f.innerHTML = '<br>' + text; // Return to line then write the text
	  document.getElementsByTagName('header')[0].appendChild(f); // Add f (the span element) to the header
  }
  else if(mode == 'danger') { // mode used for the dev win
	  f = document.createElement("p"); // Use p instead of span for the text-align: center;
	  f.style.color = colore;  // Set the color
	  f.setAttribute('class',"w3-animate-bottom danger");  // Use the w3 animation and set CSS
	  text = text.replace(/µ/g, '<br>') // Replace all the µ with line jumps
	  f.innerHTML = '<br>' + text;  // Return to line then write the text
	  document.getElementsByTagName('header')[0].appendChild(f); // Add f (the span element) to the header
  }
  window.scrollBy(0, 1000);  // Always scroll the page to see the text
}

function draw() {
  if(keyIsDown(38) && !danger) {  // If the up arrow is down and danger is false
	if(time - 5 > 0)  // Do not go under 0 for time
	  time -= 5;  // If it's okay, decrease the time and increase the text speed
	textSpeed = 100 - (time * 100 / 250); // Calcul text speed
	document.getElementById('speed').innerHTML = 'Text speed : '+ textSpeed +' %'; // Calcul text speed
  }
  else if(keyIsDown(40) && !danger) { // If the down arrow is down and danger is false
	if(time + 5 < 250)  // Do not go over 250 for time
	  time += 5; // If it's okay, increase the time and decrease the text speed
	textSpeed = 100 - (time * 100 / 250); // Calcul text speed
	document.getElementById('speed').innerHTML = 'Text speed : '+ textSpeed +' %'; // Calcul text speed
  }
}

function keyPressed() { // On key pressed ...
  if(keyCode == 101 && !danger) {  // If 5 is pressed
	if(mode == 'type') {
	  mode = 'fast';  // Change mode to fast (slide) if the current mode is typeWriting
	  document.getElementById('mode').innerHTML = 'Type mode : Slide';  // Write the type mode on page
	}
	else if(!danger) {
	  mode = 'type';  // Change mode to type if the current mode is slide
	  document.getElementById('mode').innerHTML = 'Type mode : TypeWriter';  // Write the type mode on page
	}
  }
  else if(keyCode != 122 && keyCode != 27 && !danger)  // Any key pressed but not F11 and echap
    continu(); // Go for the play
}
function mousePressed() {  // On mouse pressed
  continu();  // Go for the play
}

function continu() {  // Let's play
  if(!isWriting && !buttonsOn && !danger) {  // If text is not writing and the button are not displayed and danger is false
	if(dialog[i].includes('color : ')) {  // If the dialog contains "color : "
	  dialog[i] = dialog[i].replace("color : ", "");  // Erase "color : " and just keep the color
	  colore = dialog[i]; // Update the color
	  i++;  // Go to next dialog
	}
	if(dialog[i].includes('bgColor : ')) { // If the dialog contains "bgColor : "
	  dialog[i] = dialog[i].replace("bgColor : ", "");  // Erase "bgColor : " and just keep the color
	  document.body.style.background = dialog[i];  // Update the bg color
	  i++;  // Go to next dialog
	}
	
	if(dialog[i].includes('[ask]')) { // If the dialog contains "[ask]"
	  dialog[i] = dialog[i].replace('[ask]', ''); // Erase "[ask]" and keep the propositions
	  ask(dialog[i].split("|")[0], dialog[i].split("|")[1], "ask"); // Ask function with the first proposition (before the | and the second after)
	}
	else if(dialog[i].includes('[shop]')) { // If the dialog contains "[shop]"
	  dialog[i] = dialog[i].replace('[shop]', ''); // Erase "[shop]" and keep the propositions
	  ask(dialog[i].split("|")[0], dialog[i].split("|")[1], "shop"); // Shop function with the first proposition (before the | and the second after)
	}
	else if(dialog[i].includes('goto : ')) { // If the dialog contains "goto : "
	  dialog[i] = dialog[i].replace('goto : ', ''); // Erase "goto : " and keep the path
	  setPath(dialog[i]);  // set the right path
	  continu(13);  // Continue the game
	}
	else if(dialog[i] == ".removeAll.") removeAll(); // If the dialog is ".removeAll." remove everyyhing on the page
	else if(dialog[i] == ".die.") death(); // If the dialog is ".die." Kill the player
	else if(dialog[i].includes(".win.")) { // If the dialog contains ".win."
	  dialog[i] = dialog[i].replace('.win.', '');  // Erase ".win."
	  win(dialog[i]); // Display the message left
	}
	else if(dialog[i] == '.playMagic.') playMagic();  // If the dialog is ".playMagic." play the magic
	else {
	  say(dialog[i], colore); i++; // Finally, say the dialog.
	}
  } 
}

function ask(one, two, mode) {  // Function to ask the player
  var button1 = document.getElementById("button1");  // Take the buttons as HTML element
  var button2 = document.getElementById("button2");
  
  button1.innerHTML = one;  // Write the choices
  button2.innerHTML = two;
  
  button1.style.display = "block"; // Display the buttons
  button2.style.display = "block";
  
  buttonsOn = true;  // Buttons displayed
  
  if(mode == "ask") {
    button1.onclick = function(){setPath(one); continu(13)}; // If ask mode, set the path and continue
    button2.onclick = function(){setPath(two); continu(13)};
  }
  else if(mode == "shop"){
    button1.onclick = function(){take(one); i++; continu(13)}; // If shop mode, take the item and continu
    button2.onclick = function(){take(two); i++; continu(13)};	
  }
}

function take(object) {  // Add object to the bag
  bag.push(object);  // Put the object in the array
  document.getElementById('button1').style.display = "none";
  document.getElementById('button2').style.display = "none";  // Hide the buttons
  buttonsOn = false;  // The buttons are not here anymore
}

function death() {  // Kill the player
  document.getElementById("myModal").style.display = "block"; // Display the death modal
}

function win(text) {  // Make the player win. text is the ending message
  var monolog = new Monolog({ // Create the monolog of monolog.js and monolog.css
	loader  : false,
	content: "<h1 style='text-align: center;'>"+text+"</h1>",  // Write the text inside
	close: false
  });
  monolog.show();  // Show the monolog
}

function playMagic() {  // Dev win end animation
  danger = true;   // Enable danger mode
  ableToWrite = false;  // Cancel writing
  isWriting = true;
  document.getElementById('mode').innerHTML = '';   // Hide the settings
  document.getElementById('speed').innerHTML = '';
  mode = 'danger';  // Writing mode to 'danger'
  var y = 0
  for(y = 0 ; y < 20 ; y++) {  // Make the background passing from white to red each 250ms and write something
	if((y % 2) == 1)
      setTimeout(function() { document.body.style.background = 'red'; } , y * 250);
    else {
	  setTimeout(function() { document.body.style.background = 'white'; } , y * 250);
      setTimeout(function() {say("µµµµµµµµµµµµµµµµµµµROBERT IS THE TRUE GOD", 'red');} , y * 250);
	}
  }    
  setTimeout(function() { // Last writing
	  mode = 'type';
	  time = 200;  // Write it slow
	  document.body.style.background = 'black'; // Black bg
	  colore = 'white';  // Write in white
	  setTimeout(function() { 
	    ableToWrite = true; // Enable writing
	    say("µµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµGood bye     player  .   .   .   µµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµ                                                                                                                                                                                                                                           ", 'white');  // Last sentence
	  } , 1000);
	  setTimeout(function() { win("You're out"); } , 23000);  // Win screen
	} , y * 250 + 1000);
}

function removeAll() { document.body.innerHTML = ""; i++ }  // Empty the html body and continue

function setPath(set) {  // Set the dialog for the chosen path (set)
	
  i = 0;  // Reset i
  document.getElementById('button1').style.display = "none";  // Hide the buttons
  document.getElementById('button2').style.display = "none";
  buttonsOn = false;
  
  switch(set) {  // For each chosen path, change the dialog
	  
	case "start":
	  dialog = [
	    "µµOnce upon a time in a world far away,                  the human God named Robert created the humans and the wizard to live in peace.µ               But his job was too hard and he gave up his powers to a human identified as the Purple Merchant.µ                    Now, this human gone crazy and made humans and wizards ennemies.                     µRobert, without his powers                is unable to do anything against her    .        .          .µ           You're trapped in this world and your very goal is to get out.",
	    "color : #b3d1ff",
		"µµµ[Blue Guide] Hey    .        .                       .                      Hum .                  .                  .                   Why are you here ?                                 I mean,             you flew away last time so why would you come back ?µ        You know what ?                 That's not my problem.       Mine is something else and I need you.µ                 God appeared to me in a black lightning and proposed me something.      If I help him, he will give me whatever I want.µ     I chose to help and he gave me a paper castle but now .                  .                  .       I have to help him and I need you.          Just, follow me to my castle.",
		"bgColor : #000033",
		"Oh,         hum .     .     . Here we are.µ          So here's my problem. I have to transform into a wizard to kill the humans but he also told me something else.            µI               can                 choose                           someone     to                  take            my              place.           You'll be this personn    .   .  .",
		"color : #d9d9d9",
		"µThe feeling of an earthquake inside you moved your organs.µ          You now feel a bit weird but stronger.",
		"color : #b3d1ff",
		"µGreat ! You're a wizard now.µ         I'll teleport you to the camp of the wizard hunters now.       Just pretend to be human and don't ever touch a cookie or they'll spot you.          µKill them during the night.",
		"color : #d9d9d9",
		"µAll the molecules of your body are moving faster and faster until you're completly boiling.",
		"bgColor : #0d0d0d",
		"You are now at the entrance of the camp.",
		"color : #b3ffb3",
		"µ[Green Soldier] Hey you !           Who are you ?",
		"[ask]I'm a wizard and I'm here to take your poor human lifes|I'm a lost human, I need help or I'll die in there !"
	  ];
	  break;
	  
	case "I'm a wizard and I'm here to take your poor human lifes":
	  dialog = [
	    ".         .        .                             HOLY SHIT !µEVERYONE AT THE ENTRANCE NOW ! THERE'A WIz        .            .          .",
		"color : #d9d9d9",
		"µBut before he finished, you took a big Staff you bought in a previous life and you killed him with a big hit on his head.",
		"color : #d9d9d9",
		"µBut everyone around spotted you and are running toward you with their axes and magics wolfs.",
		"goto : Big Fight"
	  ];
	  break;
	  
	case "I'm a lost human, I need help or I'll die in there !":
	  dialog = [
	    "color : #b3ffb3",
	    "µHum ...          Yes, just wait a sec                                  .                         .                                  .                   hum, yes                                 ?                                     Okay my boss just told me you could come.",
		"color : #ffb3b3",
		"µ[Red Leader] Hello poor boy.      Come        come. Take this ! You must be really tired now ...",
		"color : #d9d9d9",
		"µHe's giving you a cookie. You REALLY REALLY want it.                                                                 Like,                       REALLY !",
		"[ask]Take the cookie|Say you're not hungry and don't take it"
	  ];
	  break;
	  
	case "Take the cookie":
	  dialog = [
	    "color : #ffb3b3",
	    "µI saw you wanted it.       Here,     take it.",
	    "color : #d9d9d9",
        "µYou take the cookie.           .            . You know by the way he's looking you that he knows what you are.µStill,           you want the cookie so you eat it but you stay on guard.µ                      But the cookie          taste weird .     .     .µ           You decide not to finish it and you look inside :               there's a small piece of bacon in it !µ            While you were looking the cookie, the guy in front of you took his sword, ready to cheap your head off.µ          You quickly dodge then you take your amazing Staff to fight back but                      it seems like your strength fade away because of the cookie bacon.µYou fall to the ground .             .              .µ            .          .                   .              You finally wake up attached to a tree without your Staff.",
	    "color : #ffb3ff",
	    "µ[Purple merchant] HEY !             I'm the merchant of the TOTALLY FREE SHOP you probably heard about !!µ          Okay. I'm the one who saved your life earlier.µ                  I did it because I love the wizards. I mean, I'm God. I'm the one who gave you this mission.µ              And yes,             I can't do it alone. I already tried to reboot this world full of shit but it failed and a lot of strange stuffs happened after this ...                          Like the fact that I have not all of my power because I destroyed them while trying the reboot but you know .       .      .  Some holy stuffs you can't understand.µ                      Okayyy, In fact           I'm not   REALLY God but it's the same, he gave me his powers. I know where the the true God is but he's powerless. Hum         .              .           .  'You'l find the God at the lowest position of the sun.'µ       Okay, I'll show you.",
	    "bgColor : #ffffe6",
	    "OH MY GOD, SO BRIGHT IN THERE, TURN DOWN THE LIGHT !",
	    "bgColor : #0d0d0d",
		"Oh, thanks.                    Now,               take something to fight !",
		"[shop]A power up for your Staff|A useless pencil",
	    "Enough talking. Get out and kill everyone.                         Now.",
	    "[ask]On my way ! I'll kill them all !|Hum ... I'm not sure"
	  ];
	  break;
	  
	case "Say you're not hungry and don't take it":
	  dialog = [
	    "color : #ffb3b3",
		"µOkay, do not worry. In fact, It was a test to see if you were a wizard or not.",
		"The wizard LOVES the cookies but this one is poisoned. Hopefully, you're human and        to be honnest        you look like someone I knew.µ     By the way.      Go check the free shop at the camp ! Go grab some free stuffs okay ?",
		"[ask]Go to the free shop|Avoid this suspicious place"
      ];
	  break;
	  
	case "Go to the free shop":
	  dialog = [
	    "color : #d9d9d9",
	    "µYou walk to the free shop ...",
	    "color : #ffb3ff",
		"µ[Purple merchant] Well,                COME    .               .                 .         WELCOMEµ WELCOME TO THE FREE SHOP.                    What do you want ?",
		"[shop]A power up for your Staff|A bottle of mead",
		"µAnd                     here you are.           It's for you  and                                                     for FREE !.",
		"color : #d9d9d9",
		"µYou now leave the shop with the item in your bag.",
		"color : #ffb3b3",
	    "µ[Red Leader] And you're back ! Nice.",
	    "goto : Avoid this suspicious place"
	  ];
	  break;
	
	case "Avoid this suspicious place":
      dialog = [
	    "color : #ffb3b3",
		"Okay. So you're lost .    .       . You can stay here for the night but you'll have to leave after.µGo see the green soldier and the entrance. He might be ok to let you sleep in his tent.",
		"[ask]Go to the green soldier|Go to the green soldier and kill him"
	  ];
	  break;
	  
	case "Go to the green soldier":
	  dialog = [
	    "color : #d9d9d9",
		"µYou start walking until you arrive at the entrance of the camp.",
	    "color : #b3ffb3",
	    "µ[Green Soldier] Yes                           I know , you want to spend the night in my tent but I don't really have the choice. Leader orders ... This is annoying.."
	  ]; 
	  if(bag.indexOf('A bottle of mead') != -1)
		dialog.push.apply(dialog, [
	      "color : #d9d9d9",
	      "µYou remember having the mead bottle in your bag.",
		  "[ask]Give him the mead bottle|Do nothing"
	    ]);
	  else 
	    dialog.push.apply(dialog, [
	      "goto : Do nothing"
	    ]); 
	  break;
	  
	case "Put out the fire with a spell":
	  dialog = [
	    "color : #d9d9d9",
	    "You launch a spell to put out the fire.µ Now the soldier know what you are.                µHe take his sword, ready to kill you but you launch a second spell to burn him down.µ           His flesh is now rotten and he's clearly not alive anymore.µ                    But                    the spell you launched alarmed everyone around and they're coming for you !",
		"goto : Big Fight"
	  ]; 
	  break;
	  
	case "Struggle against the fire":
	  dialog = [
	    "color : #b3ffb3",
	    "µOh, you're burning !",
		"color : #d9d9d9",
		"µHe throws you a water bucket.",
		"color : #b3ffb3",
		"µYou're definitely not a wizard !µ Stay for the night !",
		"color : #d9d9d9",
		"µ                                The nights falls but you feel weird.                    Your body is warming up...",
		"bgColor : #001a00",
		"...",
		"color : #ffb3ff",
		"µ[Purple merchant] Hey.                         Was your night cool ? I finally changed my mind. Go kill Robert first. The human can wait and Robert is weak at this moment, it's the perfect timing to kill him.µ                          And in case you're dumb. I'm God so don't dare oppose me.µ                Kill              him.",
		"[ask]Go for Robert|Hum ... I'm not sure"
	  ]; 
	  break;
	  
	case "Give him the mead bottle":
	  dialog = [
	    "You give him the mead bottle.",
		"color : #b3ffb3",
		"µWhat a surprise ! Thanks, really !",
		"color : #d9d9d9",
		"µHe opens the bottle and drink it.                                Now, he's totally drunk...",
		"goto : Struggle against the fire"
	  ]; 
	  break;
	  
	case "Do nothing":
	  dialog = [
	    "color : #b3ffb3",
	    "µJust one thing ...",
		"color : #d9d9d9",
		"µThe soldier took a torch and throw it to you. You're completly burning.",
		"[ask]Put out the fire with a spell|Struggle against the fire"
	  ]; 
	  break;
	  
	case "Go to the green soldier and kill him":
	  dialog = [
	    "color : #d9d9d9",
	    "µYou now rush the green soldier and kill him by hitting him on the head with your big Staff.µ             But,                 everyone saw you and they're coming to kill you.",
		"goto : Big Fight"
	  ]; 
	  break;
	  
	case "Big Fight":
	  if(bag.indexOf('A power up for your Staff') != -1)
	    dialog = [
	      "color : #d9d9d9",
	      "µAn archer is throwing you fire arrows while the wolfs are running as fast as light toward you, followed by axes men.µ            You immediatly launch a spell to kill the archers but the men reached you.µ                               You try a second spell that explode the men and some wolfs.µ                       Scared and alone, the wolfs ran away.µµ                                 You now go through the rest of the camp to kill the survivors.",
		  "color : #b3d1ff",
		  "µ[Blue Guide] Oh,                         well done.              You're good at your job.µ               I have an other mission to give you. Follow me. We're going to my castle.",
		  "bgColor : #000033",
		  "And here we are !µ                          So ... God gave me a more important mission while you were fighting.                                       Go find Robert and kill him.µ                            Go through this gate and end his life.",
		  "bgColor : #001a00",
		  "µGreat. You're now in the forest.",
		  "color : #d9d9d9",
		  "µYou passed the gate but it's still open for a moment.",
		  "[ask]Go for Robert|Change your mind and go for him"
	    ];
      else if(bag.indexOf('A useless pencil') != -1)
	    dialog = [
	      "color : #d9d9d9",
	      "µAn archer is throwing you fire arrows while the wolfs are running as fast as light toward you, followed by axes men.µ You take your useless pencil out to fight but it breaks when the red leader throws you his axe in your head.µ                Your skull exploded.",
		  '.die.'
	    ];
      else
		dialog = [
	      "color : #d9d9d9",
	      "µAn archer is throwing you fire arrows while the wolfs are running as fast as light toward you, followed by axes men.µ            You immediatly launch a spell to kill the archers but the men reached you.µ                               You try a second spell that explode the half of the men and some wolfs.µ                      But meanwhile, the other half hit you with their sharp weapons and cheap your head off and burned you with torches.µ                       Your flesh burned, your bones smashed.",
		  ".die."
	    ];
	  break;
	  
	case "On my way ! I'll kill them all !":
	  dialog = [
	    "color : #d9d9d9",
		"µYou get out of the tent with your Staff and go straight forward toward the green soldier at the entrance.",
		"goto : Go to the green soldier and kill him"
	  ];
	  break;
	  
	case "Hum ... I'm not sure":
	  dialog = [
        "µYOU ARE A PUSSY, DIE DIE DIE DIE DIE !!!!! COME ON, PRESS [ENTER] NOW",
		".die."
	  ];
	  break;
	  
	case "Go for Robert":
	  dialog = [
	    "color : #d9d9d9",
		"You now start walking toward the Robert shed.",
		"[ask]Go to kill|Go to ask for help to get out"
	  ]; 
	  break;

    case "Change your mind and go for him":
	  dialog = [
	    "bgColor : #000033",
	    "You pass the portal in the opposite direction.µ                  You take your Staff and you try to kill him.µ                You're in a paper castle. Let's burn it down.µ        You launch a fire spell then quickly go back to the portal before the ashes hit the ground.",
		"goto : Go for Robert"
	  ]; 
	  break;

    case "Go to kill":
	  if(bag.indexOf('A power up for your Staff') != -1)
		dialog = [
	      "You're thinking of a way to kill a voice            .            .            .                 Burn his shed will probably take him out and destroy him ..       .",
		  "You arrive at the shed and burn it down thanks to your amazing Staff.",
		  "It just looks like a burning shed           .       .       .             Nothing more.",
		  "color : #ffb3ff",
		  "µµµµµ[Purple merchant] Hum. That was amazing. This one just died.µ                                              I'm now available to completly destroy this world full of shit.",
		  "bgColor : white",
		  "THE END IS NEAR",
		  ".removeAll.",
		  ".win.The world has been destroyed so ... you're out."
	    ];
	  else
	    dialog = [
	      "You're thinking of a way to kill a voice            .            .            .                 Burn his shed will probably take him out and destroy him .       .       .",
		  "You arrive at the shed and launch a fire spell to burn it down                but                      nothing happened.",
		  "color : white",
		  "µµ[Robert] Hum hum ?                    µWhat are you trying to do ?               Like if your Staff was powerfull enough to do anything against me. Just leave me alone.",
		  "color : #d9d9d9",
		  "µYou feel time confused and your body is warming up in a cold way.µ                  The timelines are collapsing.",
		  "color : white",
		  "µNow, just go back in time.                                                              µµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµIn the camp ...",
		  "bgColor : #0d0d0d",
		  "               Remember :        You're a lost human.         ",
		  "goto : I'm a lost human, I need help or I'll die in there !"
	    ]; 
		  
	  break;

    case "Go to ask for help to get out":
	  dialog = [
	    "You continue walking until you reach Robert's shed.",
		"color : white",
		"µ[Robert] Oh, here you are, I know you right ?                  Nevermind            ! Tell me, what do you need ?",
		"[ask]I just need to get out of this world !|We have to stop the false God"
	  ]; 
	  break;	  

    case "I just need to get out of this world !":
	  dialog = [
	    "Oh, you know it's not that simple. Getting out of this world is not a piece of cake ...µ                               But I might be able to help you out. I know the dev.µ                            I'll call him right away        .           .                .                   The dev answered his phone.                                 Oh, it's for you.               Take the phone.",
		"color : #d9d9d9",
		"µThe phone appeared in your hands.",
		"µµµµµµµµµµµµµµµµµµµµµµµµµµµ[Dev] Allô ?            Hum, yes you're a player.              I created this game, I can do whatever I want, even take you out. It's really simple. For the all-mighty creator.µ            But first, let's play a bit.                     Press any key to the see the magic . . . ",
		".playMagic."
	  ]; 
	  break;
	  
	case "We have to stop the false God":
	  dialog = [
	    "You mean,               the poor human I gave my powers ? Do not worry.              With me still alive, she won't do anything and she will just destroy herself.             She's not something to worry about    .            .                   .                   µYou're not happy ?     Okay.                       Fine, take this magic sword forged in the holy blood of an angel and kill this poor powerless human.",
        "color : #d9d9d9",
		"µYou take the magic sword and Robert teleport you to the merchant.          .            .",
		"bgColor : #0d0d0d",
		"You're now at the camp and the merchant is in front of you. You stab him with the sword.",
		"color : #ffb3ff",
		"µ.            µ.              µ.           µI                      made                 you              a               wizard.                        µAND YOU DARE KILL ME",
		"bgColor : white",
		"TAKE THIS. ROBERT WON'T BE ABLE TO WRITE ANYTHING ANYMORE.",
		"color : black",
		"µµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµYou",
		"µµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµwill",
		"bgColor : #1d1e21",
		"µµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµregret.",
		"color : #d9d9d9",
		"µµHer corpse fall down to the ground and disappeared into ashes in the sky.",
		"A small wind take you and got you out of this world of misery.",
		".win.You're out"
	  ]; 
	  break;

/*	case "":
	  dialog = [
	    ""
	  ]; 
	  break; */
	  
	default:
	  dialog = [
	    "Bah alors, c'est pas codé ici hein hein.",
		".die."
	  ];
	  break;
  }
  isWriting = false;
}

var plateau = 3;
var robot = true;
var turn = 'X';
var termine = false;
var total_turns = 0;


var scores = new Array(); 
	scores['X'] = 0;
	scores['Y'] = 0;


var choix = new Array(); 
	choix['X'] = new Array();
	choix['Y'] = new Array();



function DefaultRobotPatterns() {
	var robot_turns = Array();

	if (plateau==3) robot_turns = [22,11,33,13,21,23,12,32,31];


	if (plateau==4) robot_turns = [11,22,33,44,14,13,12,21,31,41,42,43,24,34,32,23];


	if (plateau==5) robot_turns = [11,22,33,44,55,15,14,13,12,51,41,31,21,35,45,25,53,52,54,42,43,32,34,23,24];

	return robot_turns
}




function modelsGagnant() {
	var victoires = Array();

	if (plateau==3) victoires = [ 
								[11,12,13], [21,22,23], [31,32,33],
						 		[11,21,31], [12,22,32], [13,23,33], 
						 		[11,22,33], [13,22,31]
						 	];


	if (plateau==4) victoires = [ 
								[11,12,13,14], [21,22,23,24], [31,32,33,34], [41,42,43,44],
						 		[11,21,31,41], [12,22,32,42], [13,23,33,43], [14,24,34,44],
						 		[14,23,32,41], [11,22,33,44]
						 	];


	if (plateau==5) victoires = [ 
								[11,12,13,14,15], [21,22,23,24,25], [31,32,33,34,35], [41,42,43,44,45], [51,52,53,54,55],
						 		[11,21,31,41,51], [12,22,32,42,52], [13,23,33,43,53], [14,24,34,44,54], [15,25,35,45,55],
						 		[11,22,33,44,55], [15,24,33,42,51]
						 	];

	return victoires
}




function resetAIButton() {
	var checkbox = document.getElementById('robot'); 	
	checkbox.checked = 'checked';
}


function restaureParametre() {
	turn = 'X';
	plateau = 3;
	total_turns = 0;
	robot = true;
	termine = false;

	choix['X'] = new Array();
	choix['Y'] = new Array();
}


function generateGame(){

	restaureParametre();

	plateau = Number(document.getElementById('plateau').value);

	robot_object = document.getElementById('robot'); 
	if (robot_object.checked === true) robot = true; 
	else  robot = false;

	document.getElementById('tableau-jeu').innerHTML = '';

	for (var row = 1; row <= plateau; row++){
		for (var col = 1; col <= plateau; col++) {
			var unique_name = 'grid-'+row+'-'+col;
			var unique_id = row+''+col;
			var button = document.createElement("input");

			button.setAttribute("value", ' ');
			button.setAttribute("id", unique_id);
			button.setAttribute("name", unique_name);
			button.setAttribute("class", 'grid-box');
			button.setAttribute("type", 'button');
			button.setAttribute("onclick", "markCheck(this)");
			document.getElementById('tableau-jeu').appendChild(button);
		}

		var breakline = document.createElement("br");
			document.getElementById('tableau-jeu').appendChild(breakline);
	}

}


function changeTurn(){
	if (turn == 'X') turn = 'Y';
	else turn = 'X';
}


function markCheck(obj){

	obj.value = turn;
	total_turns++;

	if (turn == 'X' ) {
		obj.setAttribute("class", 'joueur1');
	} else {
		obj.setAttribute("class", 'joueur2');
	}

	obj.setAttribute("disabled", 'disabled');
	choix[turn].push(Number(obj.id));

	verifGagnant();
	changeTurn();

	if (robot===true) autoTurn();
}


function autoTurn(again=false) {

	is_empty_result = true;

	if (turn === 'X' || termine === true) return false;

	var robot_pattern = '';
	if (again==true) robot_pattern = DefaultRobotPatterns();
	else robot_pattern = getAutoTurnPattern(); 

	for(var x = 0; x < robot_pattern.length; x++) {
		var desired_obj = document.getElementById(robot_pattern[x]);

		if (desired_obj.value == '' || desired_obj.value == ' ') { 
			markCheck(desired_obj); 
			is_empty_result = false;
			break;
		} 
	}

}

function disableAllBoxes() {

	var elements = document.getElementsByClassName("grid-box");
	for (var i = 0; i < elements.length; i++) {
	  elements[i].disabled =true;
	}

}

function verifGagnant() {

	var choisi = choix[turn].sort();
	var win_patterns = modelsGagnant();

	termine = false;
	for (var x=0; x < win_patterns.length; x++) {
		
		if (termine != true) { 
			termine = siGagnant(win_patterns[x], choix[turn]);

			if ( termine === true ) {
				
				scoreUpdate(turn);

				disableAllBoxes();

				alert('le joueur '+turn+' a gagné !!');
				
				break;
			} 
		}
	}

	if ( ( total_turns == (plateau*plateau) ) && termine === false ) { 
		alert('match nul!');
		termine = true;
		disableAllBoxes(); 
	}
}


function getAutoTurnPattern() {

	var pattern = [];
	pattern = getMostNearestPattern('Y');
	if (pattern.length <= 0) {
		pattern = getMostNearestPattern('X');
		if (pattern.length <= 0) {
			pattern = DefaultRobotPatterns();
		}
	}

	return pattern;
	
}



function scoreUpdate(turn){
	scores[turn]++;
	document.getElementById('score-'+turn).innerHTML = scores[turn];
}


function siGagnant(win_pattern, choix){

	var match = 0;

	for (var x=0; x<win_pattern.length; x++) {
		for (var y=0; y<choix.length; y++) {
			if (win_pattern[x]==choix[y]) {
				match++;
			}
		}
	}

	if (match==win_pattern.length) return true;

	return false;
}

function intersectionArray(x, y){

    var retour = [];
    for (var i = 0; i < x.length; i++) {
        for (var z = 0; z < y.length; z++) {
            if (x[i] == y[z]) {
                retour.push(x[i]);
                break;
            }
        }
    }
    return retour;

}

function getMostNearestPattern(turn){

	var parties = 0;

	var choisi = choix[turn].sort();
	var win_patterns = modelsGagnant();

	termine = false;
	for (var x=0; x < win_patterns.length; x++) {
		var intercepte = intersectionArray(choisi, win_patterns[x]);

		if ( intercepte.length==(win_patterns[x].length-1) ) {

			for (var y=0; y < win_patterns[x].length; y++) {
				obj = document.getElementById(win_patterns[x][y]);
				if (obj.value == '' || obj.value == ' ') {
					return win_patterns[x];	
				}
			}
		}

	}
	return [];
}
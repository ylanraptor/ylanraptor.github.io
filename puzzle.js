var board = {

    // For each array element, the value is the number tile currently in that slot.
    // The value 0 represents the blank slot.
    //state: [ null, 0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ],
    state: [ null, 0, 10, 13, 8, 16, 9, 3, 7, 11, 6, 12, 15, 5, 2, 4, 14 ],
    blankSlot: 1,  // Index of where the blank is, ie. the 0 value.

    completedState: [ null, 0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ],

    // For each array element, the value is a subarray that lists the adjacent slots.
    adjacent: [null,
               [2,5],     [1,3,6],     [2,4,7],      [3,8],
               [1,6,9],   [2,5,7,10],  [3,6,8,11],   [4,7,12],
               [5,10,13], [6,9,11,14], [7,10,12,15], [8,11,16],
               [9,14],    [10,13,15],  [11,14,16],   [12,15]
            ],


    renderTiles: function () {

	$('td').each (
	    function renderOneSlot () {
		var id = $(this).attr('id');
		var idNum = id.substring(5);  // Strip off the leading "slot-" to extract just the number.
		var tile = board.state[idNum];
		if (tile === 0) {  // It's the blank slot.
		    $(this).addClass('blank');
		    $(this).text('');
		    $(this).css("background-image", "none");
		}
		else {
		    $(this).removeClass('blank');
		    $(this).text(' ');
		    $(this).css("background-image", "url('tile-" + tile + ".jpg')");
		}
	    }
	);
	
	board.makeSlotsClickable(board.blankSlot);
    },

    makeSlotsClickable: function(idNum){

	var movableSlots = board.adjacent[idNum];
	var selector = "";
	for(var i = 0; i < movableSlots.length; i++){
	    selector += ", #slot-" + movableSlots[i];
	}
	selector = selector.substring(2);  // Strip off the leading ", ".
	$(selector).wrapInner('<a href="#" border="0"></a>');
    },

    makeMove: function(tile){

	var idNum = $(tile).parent().attr('id').substring(5);
	var tileValue = board.state[idNum];
	board.state[idNum] = 0;
	board.state[board.blankSlot] = tileValue;
	board.blankSlot = idNum;

	board.renderTiles();
    },

    setSlotHandler: function(){

	$('td').on('click', 'a',
		   function(event, shuffling){
		       board.makeMove(this);
		       // While shuffling, don't check for whether the game
		       // is finished. Otherwise, you get spurious "you win" messages.
		       if (!shuffling && board.isGameFinished()) board.userWon();
		   }
		  );
    },

    isGameFinished: function(){
	for (var i = 0; i < board.state.length; i++){
	    if(board.state[i] != board.completedState[i]) return false;
	}
	return true;
    },

    userWon: function(){
	// do nothing
	//alert('You win!');
    },

    setShuffleHandler: function () {	
	$('#shuffle-board').on('click',
			       function shuffleTheBoard () {

				   // Make a bunch of random moves to do the shuffling
				   // by simulating user clicks on the tiles.
				   // 100 moves seem to be an adequate number for scrambling
				   // the tiles from whatever state the board is in.

				   for (var i = 0; i < 100; i++) {
				       var movableTiles = board.adjacent[board.blankSlot];
				       var whichTile = Math.floor(Math.random() * movableTiles.length);
				       var tileIdNum = 'slot-' + movableTiles[whichTile];
				       var selector = '#' + tileIdNum + ' a';
				       $(selector).trigger('click', [ true ]);
				   }
			       }
			      )
    }
};

// Execute the following when DOM is ready, ie. same as $(document).ready()
$(board.renderTiles);
$(board.setSlotHandler);
$(board.setShuffleHandler);

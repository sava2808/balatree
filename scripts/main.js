//main.js :: important game stuff;; data,functions,etc

function round(x,place=0){
	return Math.round(x * Math.pow(10,place)) / Math.pow(10,place)
}
function randInt(a,b){ //random round inclusionary number //from mdn
	return round(Math.random() * (b - a) + a)
}
function begin(){
	setCards()
	loadData()
	loadSettings()
	startRound()
	handDraw()
}
/*settings::
css_hoverlayer: put card on top layer when hovering over it
card_swipeselect: select cards by swiping them
css_swapbuttons: swap the play and discard buttons
game_speed: game speed multiplier
END settings;;*/
data = { //default savedata
	run:{ //current run data
		handsize:8, //max hand size to draw
		deck:createDeck(), //cards you have
		drawpile:[], //cards left to draw
		discardpile:[], //cards already played or discarded
		score:0, //current round score
		hands:{ //playable hands and their score
			highcard:[5,1],
			pair:[10,2],
			twopair:[20,2],
			threeofakind:[30,3],
			straight:[30,4],
			flush:[35,4],
			fullhouse:[40,4],
			fourofakind:[60,7],
		},
	},
	settings:{ //settings data
		css_hoverlayer:1,
		card_swipeselect:1,
		card_autosort:1, //automatically sort the hand when drawing
		card_sortace:0, //where to sort aces (0:left, 1:right)
		sort_recent:"rank", // most recent sort option for autosort 
		css_swapbuttons:0,
		game_speed:1, 
	},
}
function createDeck(){ //return normal 52 card deck
	deck = []
	for(s = 0;s<4;s+=1){
		for(r = 1;r<14;r+=1){
			deck.push({rank:r,suit:s})
		}
	}
	return deck
}
function updateHUD(handoffset=0){
	document.querySelector("#handhud").innerHTML = `Hand: ${document.querySelector("#playhand").childElementCount - handoffset}/${data.run.handsize}`
	document.querySelector("#deckhud").innerHTML = `Deck: ${data.run.drawpile.length}/${data.run.deck.length}`
	document.querySelector("#score").innerHTML = data.run.score
	document.querySelector("#chips").innerHTML = chips
	document.querySelector("#mult").innerHTML = mult
}
function handSort(type){
	data.settings.sort_recent = type
	pile = document.querySelector("#playhand")
	cards = document.querySelectorAll("#playhand card-t")
	order = []
	cards.forEach((card) => {order.push(card)})
	order.sort((a,b) => {
		if (type == "rank" && data.settings.card_sortace){
			a[type] = a[type] == 1 ? 14 : a[type]
			b[type] = b[type] == 1 ? 14 : b[type]
		}
		return b[type] - a[type]
	})
	pile.innerHTML = ""
	order.forEach((card) => {pile.appendChild(card)})
}
function setTing(opt,value){ //set setting
	if (opt.includes("css_")){
		if (value){
			document.body.setAttribute(opt,value)
		}else{
			document.body.removeAttribute(opt)
		}
	}else{
		data.settings[opt] = value
	}
}
function loadSettings(){ //load settings from data
	for (i in data.settings){
		setTing(i,data.settings[i])
	}
}
function saveData(){ //save data to localstorage
	localStorage.setItem("data",json.stringify(data))
}
function loadData(){ //load data from localstorage (if exists)
	if (localStorage.getItem("data") !== null){
		data = json.parse(localStorage.getItem("data"))
	}else{
		console.log("i couldnt find any savedata...")
	}
}
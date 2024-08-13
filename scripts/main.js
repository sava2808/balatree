//main.js :: important game stuff (::data,functions,etc;;)

function round(x,place=0){
	return Math.round(x * Math.pow(10,place)) / Math.pow(10,place)
}
function mulberry32(a) { //from https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
	let t = a += 0x6D2B79F5;
	t = Math.imul(t ^ t >>> 15, t | 1);
	t ^= t + Math.imul(t ^ t >>> 7, t | 61);
	return ((t ^ t >>> 14) >>> 0) / 4294967296;
}
function randInt(a,b,game=0){ //random round inclusionary number //from mdn
	if (game){
		data.run.gameseed = mulberry32(data.run.gameseed) * 4294967296
		console.log(data.run.gameseed)
		return Math.floor(mulberry32(data.run.gameseed) * (b - a + 1) + a)
	}else{
		return Math.floor(Math.random() * (b - a + 1) + a)
	}
}
function begin(){
	loadData()
	loadSettings()
	swapState("round")
}

data = { //default savedata
	run:{ //current run data
		gameseed:0, //random seed for gameplay stuff (card draws, shop etc)
		handsize:8, //max hand size to draw
		deck:createDeck(), //cards you have
		state:"", //current game state
		hands:4, //max hands
		discards:3, //max discards
		highscore:0, //highest hand score
		round:{ //current round data
			drawpile:[], //cards left to draw
			score:0, //round score
			reachscore:300, //score to reach
			hands:4, //hands left in round
			discards:3 //discards left in round
		},
		pokerhands:{ //playable hands and their score
			highcard:[5,1],
			pair:[10,2],
			twopair:[20,2],
			threeofakind:[30,3],
			straight:[30,4],
			flush:[35,4],
			fullhouse:[40,4],
			fourofakind:[60,7],
			straightflush:[100,8]
		},
	},
	settings:{ //settings data
		css_hoverlayer:1, //put moused over card on highest layer
		card_swipeselect:1, //hold mouse down and touch cards to select them
		card_autosort:1, //automatically sort the hand when drawing
		card_sortace:0, //where to sort aces (0:left, 1:right)
		sort_recent:"rank", //most recent sort option for autosort 
		css_swapbuttons:0, //swap play and discard Button
		card_highcontrast:0, //(sorta) high contrast suits
		game_speed:1, //speed of game animations
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
	document.querySelector("#deckhud").innerHTML = `Deck: ${data.run.round.drawpile.length}/${data.run.deck.length}`
	document.querySelector("#hands").innerHTML = data.run.round.hands
	document.querySelector("#discards").innerHTML = data.run.round.discards
	document.querySelector("#score").innerHTML = data.run.round.score
	document.querySelector("#scorereach").innerHTML = data.run.round.reachscore
	document.querySelector("#chips").innerHTML = chips
	document.querySelector("#mult").innerHTML = mult
	document.querySelector(".pokerhand").innerHTML = handtype == "&nbsp;" ? "&nbsp;" : handnames[handtype]
}
function handSort(type){
	data.settings.sort_recent = type
	pile = document.querySelector("#playhand")
	cards = document.querySelectorAll("#playhand card-t")
	order = []
	cards.forEach((card) => {order.push(card)})
	order.sort((a,b) => {
		switch (type){
			case "rank":
			if (!data.settings.card_sortace){
				return (b.rank == 1 ? 14 : b.rank) - (a.rank == 1 ? 14 : a.rank)
			}
			return b.rank - a.rank
			break
			case "suit":
			return (b.suit + b.rank / 14) - (a.suit + a.rank / 14)
			break
		}
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
setInterval(() => {
	if (data.settings.card_highcontrast){
		document.querySelectorAll("card-t").forEach((card) => {
			if (!card.getAttribute("suitcolor")){
				switch (card.suit){
					case "2":
					card.setAttribute("suitcolor","#f50")
					break
					case "3":
					card.setAttribute("suitcolor","#00f")
					break
				}
				card.setAttribute("rank",card.rank)
			}
		})
	}else{
		document.querySelectorAll("card-t").forEach((card) => {card.removeAttribute("suitcolor")})
	}
},33)
function loadSettings(){ //load settings from data
	for (i in data.settings){
		setTing(i,data.settings[i])
	}
}
function saveData(){ //save data to localstorage
	localStorage.setItem("data",JSON.stringify(data))
}
function loadData(){ //load data from localstorage (if exists)
	if (localStorage.getItem("data") !== null){
		data = JSON.parse(localStorage.getItem("data"))
	}else{
		console.log("i couldnt find any savedata...")
	}
}
//game.js :: gameplay stuff

cutscene = 0 //when 1, no card interaction
chips = "&nbsp;"
mult = "&nbsp;"
handtype = "&nbsp;"
handnames = {
	highcard: "High Card",
	pair: "Pair",
	twopair: "Two Pair",
	threeofakind: "Three of a Kind",
	flush: "Flush",
	straight: "Straight",
	fullhouse: "Full House",
	fourofakind: "Four of a Kind",
	fiveofakind: "Five of a Kind",
	flushhouse: "Flush House",
	flushfive: "Flush Five",
}

function startRound(){
	data.run.drawpile = structuredClone(data.run.deck)
}
function handPlay(step){ //hand playing animation
	switch (step){
		case 0:
		if (selected > 0){
			cutscene = 1
			cards = document.querySelectorAll("#playhand card-t[selected]")
			i = 0
			console.log("time to fly!!")
			playing = setInterval(() => {
				console.log("whee" + ("e".repeat(randInt(0,10))))
				cards[i].removeAttribute("selected","")
				cards[i].setAttribute("playing","")
				i+=1
				updateHUD(i)
				if (i == cards.length){
					clearInterval(playing)
					setTimeout("handPlay(1)",445 / data.settings.game_speed)
				}
			},174 / data.settings.game_speed)
		}
		break
		case 1:
		cards = document.querySelectorAll("#playhand card-t[playing]")
		pile = document.querySelector("#counthand")
		cards.forEach((card) => {
			card.removeAttribute("playing")
			pile.appendChild(card) //this moves the element from the playhand!? thats crazy
		})
		console.log("time to shine!")
		handDetect()
		updateHUD()
		setTimeout("scoreCount(0)",174 / data.settings.game_speed)
		break
	}
}
function handDetect(){ //detect poker hand and apply the hand score
	cards = document.querySelectorAll("#counthand card-t")
	count = []
	cards.forEach((card) => {count.push([card.rank,card.suit])})
	// flush::
	suits = {}
	flush = 0
	count.forEach((card) => {suits[card[1]] = 0})
	count.forEach((card) => {suits[card[1]] += 1})
	if (Object.values(suits).includes(5)){
		flush = 1
	}
	// n of a kind::
	dupes = {}
	pair = 0
	three = 0
	four = 0
	five = 0
	count.forEach((card) => {dupes[card[0]] = 0})
	count.forEach((card) => {
		dupes[card[0]] += 1
		switch (dupes[card[0]]){
			case 2:
			pair += 1
			break
			case 3:
			three += 1
			pair -= 1
			break
			case 4:
			four += 1
			three -= 1
			break
			case 5:
			five += 1
			four -= 1
			break
		}
	})
	// straight::
	// thank you balatro's source code
	straight = 0
	ranks = []
	count.forEach((card) => ranks.push(Number(card[0])))
	len = 0
	for(i = 1;i < 15;i+=1){
		if (ranks.includes(i == 14 ? 1 : i)){
			len += 1
			if (len >= 5){straight = 1}
		}else{
			len = 0
		}
	}
	console.log(count)
	//END poker hand detection;;
	results = ["highcard"]
	if(pair){results.push("pair")}
	if(pair == 2){results.push("twopair")}
	if(three){results.push("threeofakind")}
	if(straight){results.push("straight")}
	if(flush){results.push("flush")}
	if(straight && flush){results.push("straightflush")}
	if(pair && three){results.push("fullhouse")}
	if(four){results.push("fourofakind")}
	if(five){results.push("fiveofakind")}
	if(five && flush){results.push("flushfive")}
	if(pair && three && flush){results.push("flushhouse")}
	results.sort((a,b) => { //pick only highest scoring hand
		ahand = data.run.hands[a]
		if (!ahand){ahand = [0,0]}
		bhand = data.run.hands[b]
		if (!bhand){bhand = [0,0]}
		ascr = ahand[0] * ahand[1]
		bscr = bhand[0] * bhand[1]
		return bscr - ascr
	})
	handtype = results[0]
	console.log(handtype)
	chips = data.run.hands[handtype][0]
	mult = data.run.hands[handtype][1]
	// figuring out which cards score::
	scoring = []
	ofakind = 0
	switch (handtype){
		case "flushfive":
		case "flushhouse":
		case "fiveofakind":
		case "fullhouse":
		case "straight": //change later
		case "flush": //change later
		cards.forEach((card) => {scoring.push(card)})
		break
		case "fourofakind":
		case "threeofakind":
		case "pair":
		rank = Object.entries(dupes).toSorted((a,b) => {return b[1] - a[1]})[0][0]
		cards.forEach((card) => {scoring.push(card)})
		scoring = scoring.filter((card) => {return card.rank == rank})
		break
		case "highcard":
		cardidx = 0
		cardrank = 0
		for (i=0;i<count.length;i+=1){
			if (count[i][0] == 1){
				cardidx = i
				break
			}
			if (Number(count[i][0]) > cardrank){
				cardidx = i
				cardrank = Number(count[i][0])
			}
		}
		scoring.push(cards[cardidx])
		break
		case "twopair":
		try{
			rank = Object.entries(dupes).find((a) => {return a[1] == 1})[0]
		}catch{
			cards.forEach((card) => {scoring.push(card)})
			break
		}
		cards.forEach((card) => {scoring.push(card)})
		scoring.splice(scoring.findIndex((card) => {return card.rank == rank}),1)
		break
	}
	//END figuring out which cards score;;
	setTimeout("scoring.forEach((card) => {card.setAttribute('selected','')})",88 / data.settings.game_speed)
}
function handDiscard(step){ //hand discarding animation
	switch (step){
		case 0:
		if (selected > 0){
			cutscene = 1
			cards = document.querySelectorAll("#playhand card-t[selected]")
			i = 0
			console.log("time to fall..")
			playing = setInterval(() => {
				console.log("whoaa" + ("a".repeat(randInt(0,10))))
				cards[i].removeAttribute("selected","")
				cards[i].setAttribute("discarding","")
				i+=1
				updateHUD(i)
				if (i == cards.length){
					clearInterval(playing)
					setTimeout("handDiscard(1)",444 / data.settings.game_speed)
				}
			},174 / data.settings.game_speed)
		}
		break
		case 1:
		cards = document.querySelectorAll("#playhand card-t[discarding]")
		cards.forEach((card) => {card.remove()})
		handDraw()
		break
	}
}
function scoreCount(step){ //count the score from all cards
	switch (step){
		case 0:
		i = 0
		cards = document.querySelectorAll("#counthand card-t[selected]")
		count = setInterval(() => {
			if (i == cards.length){
				clearInterval(count)
				scoreCount(1)
				return
			}
			console.log("ding!")
			cards[i].style.animation = `count${randInt(1,2)} ${0.5 / data.settings.game_speed}s`
			value = cards[i].rank
			if (value > 10){value = 10}
			if (value == 1){value = 11}
			chips += Number(value)
			updateHUD()
			i+=1
		},500 / data.settings.game_speed)
		break
		case 1:
		data.run.score += chips * mult
		chips = "&nbsp;"
		mult = "&nbsp;"
		handtype = "&nbsp;"
		updateHUD()
		i = 0 // remove scoring cards
		cards = document.querySelectorAll("#counthand card-t")
		cards.forEach((card) => {
			card.removeAttribute("selected")
			card.removeAttribute("style")
		})
		remove = setInterval(() => {
			if (i == cards.length){
				clearInterval(remove)
				setTimeout("handDraw()",266 / data.settings.game_speed)
				document.querySelector("#counthand").innerHTML = ""
				return
			}
			cards[i].setAttribute("drawing","")
			i += 1
		},134 / data.settings.game_speed)
		break
	}
}
function drawCard(rank=1,suit=0){ //draw card to hand
	card = document.createElement("card-t")
	card.rank = rank
	card.suit = String(suit)
	card.setAttribute("drawing","")
	setTimeout(() => {document.querySelector("card-t[drawing]").removeAttribute("drawing")},17)
	document.querySelector("#playhand").appendChild(card)
	setCards()
}

function handDraw(){ //draw cards to fit hand size 
	cutscene = 1
	pile = document.querySelector("#playhand")
	drawing = setInterval(() => {
		if (pile.childElementCount >= data.run.handsize|| data.run.drawpile.length == 0){
			cutscene = 0
			selected = 0
			clearInterval(drawing)
			return
		}
		idx = randInt(0,data.run.drawpile.length - 1)
		card = data.run.drawpile[idx]
		drawCard(card.rank,card.suit)
		data.run.drawpile.splice(idx,1)
		updateHUD()
		if (data.settings.card_autosort){
			handSort(data.settings.sort_recent)
		}
	},100 / data.settings.game_speed)
}
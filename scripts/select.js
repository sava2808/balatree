//select.js :: card selection

moveDelay = 33 //ms delay between mousemove events
selected = 0 //ammount of cards selected
selectMax = 5 //max cards to select

function setCards(){ //set up card moving
	cards = document.querySelectorAll("#playhand card-t:not([onmousedown])")
	cards.forEach((card) => {
		card.onmousedown = dragStart
		card.onmouseenter = swipeSelect
	})
}

function selectCard(card){ //toggle card selection
	if (card.getAttribute("selected") == null){
		if (selected < selectMax){
			card.setAttribute("selected","")
			selected += 1
			console.log("i'm readyy")
		}
	}else{
		card.removeAttribute("selected")
		selected -= 1
		console.log("oh.. nevermind")
	}
}
function swipeSelect(e){ //swipe card to select it
	if (e.buttons == 1 && data.settings.card_swipeselect && cutscene == 0){
		selectCard(e.target)
	}
}
//card moving::
function dragStart(e){
	if (cutscene){return}
	console.log("movingmoving")
	try{clearInterval(intr)}catch{}
	dragTarget = e.target
	dragTarget.removeAttribute("style")
	cards = document.querySelectorAll("card-t")
	cards.forEach((card) => {
		card.onmousedown = "" //{removeAttribute doesn't work}
		card.onmouseenter = ""
	})
	rect = dragTarget.getBoundingClientRect()
	document.body.onmouseup = dragStop
	document.body.onmouseleave = dragStop
	mousepos = [e.clientX,e.clientY]
	xpositions = []
	intr = setInterval(() => {dragTarget.style.rotate = '0deg';document.body.onmousemove = dragMove},moveDelay)
}
function dragMove(e){
	//cardswap::
	pile = dragTarget.parentElement
	cards = pile.querySelectorAll("card-t")
	order = []
	cards.forEach((card) => {
		order.push([card,card.getBoundingClientRect().x])
	})
	order.sort((a,b) => {return a[1] - b[1]}) //sort by x position
	pile.innerHTML = ""
	order.forEach((item) => {
		pile.appendChild(item[0])
	})
	for (var i = 0;i<order.length;i+=1){
		pile.appendChild(order[i][0])
		// console.log(order[i][0])
	}
	//END cardswap;;
	dragTarget = pile.querySelector("card-t[style]")
	dragTarget.style.translate = "0px"
	rect = dragTarget.getBoundingClientRect()
	dragTarget.style.translate = `${e.clientX - rect.x - 32}px ${e.clientY - rect.y - 44}px`
	if (xpositions.length > 2){
		dragTarget.style.rotate = `${(xpositions.at(-1) - xpositions.at(-2)) / 2}deg`
		xpositions.splice(0,1)
	}
	xpositions.push(e.clientX)
	document.body.onmousemove = ""
}
function dragStop(e){

	if (mousepos.toString() == [e.clientX,e.clientY].toString()){ //click detection //why must i toString it
		selectCard(dragTarget)
	}else{
		console.log("you've dropped me..")
	}
	
	document.body.onmousemove = ""
	document.body.onmouseup = ""
	document.body.onmouseleave = ""
	dragTarget.onmousedown = dragStart
	dragTarget.onmouseenter = swipeSelect
	clearInterval(intr)
	dragTarget.removeAttribute("style")
	setCards()
}
//END card moving;;
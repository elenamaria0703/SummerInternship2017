var Army = function(name,attack,defense,hp){
	this.name= name;
	this.attack = attack;
	this.defense = defense;
	this.hp = hp;

	this.duel=function(attack){
		var att1 = attack - (attack/100*this.defense);
		this.hp-=att1;

		if(this.hp < 0)
			this.hp =0;
	}
	this.alive = function(){
		return this.hp>0;
	}
};

var war = [
	new Army("RO",rand(2,10),rand(10,50),rand(15,10)),
	new Army("FR",rand(2,10),rand(10,50),rand(15,10)),

];
var defender =0;
var attecker = 1;
do{
	war[defender].duel(war[attacker].attack);
	
	defender++;
	defender=defender%war.length;
	attacker = Math.abs(defender -(war.length - 1));
}while(war[defender].alive()>0&&war[attacker].alive());
for(var i in war){
	if(war[i].alive()){
		console.log("The winner is "+war[i].name);
		break;
	}
}
function rand(min,max){
	return Math.round(min+Math.random()*(max-min));
}
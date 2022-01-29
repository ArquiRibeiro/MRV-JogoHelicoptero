/*DADOS*/
const FPS = 1000/60;
let loop;

foreground = document.getElementById("foreground");
instrucoes = document.getElementById("instrucoes");
instrucoes.addEventListener("click", start);
jogador = document.querySelector(".jogador");
inimigo1 = document.querySelector(".inimigo1");
inimigo2 = document.getElementById("inimigo2");
refem = document.querySelector(".refem");
energias = document.getElementById("energias");
pontuacao = document.getElementById("pontuacao");
canhao = document.querySelector(".canhao");

musica_fundo = document.querySelector(".musica_fundo");
explosao = document.querySelector(".explosao");
resgate = document.querySelector(".resgate");
morte = document.querySelector(".morte");
tiro = document.querySelector(".tiro");

document.addEventListener("keydown", function(){player.input(event.keyCode)})
document.addEventListener("keyup", function(){player.release(event.keyCode)})



/*OBJETOS*/
player = {
    positionX: parseInt(getComputedStyle(document.body).getPropertyValue("--player_position_x")),
    positionY: parseInt(getComputedStyle(document.body).getPropertyValue("--player_position_y")),

    pontos: 0,
    charges : 3,
    canShoot: true,
    shoot: false,
    shootArray: [],
    left: false,
    up: false,
    right: false,
    down: false,


    input: function(key){
        switch(key){
            case 32:
                if(this.canShoot == true && this.charges > 0){
                    player.shoot = true;
                }
                break
            case 37:
                this.left = true;
                break
            case 38:
                this.up = true;
                break
            case 39:
                this.right = true;
                break
            case 40:
                this.down = true;
                break
        }
    },

    release: function(key){
        switch(key){
            case 32:
                break
            case 37:
                player.left = false;
                break
            case 38:
                player.up = false;
                break
            case 39:
                this.right = false;
                break
            case 40:
                player.down = false;
        }
    },

    action: function(){
        

        if(this.left == true && this.positionX > 8){
            this.positionX -= 4;
        }

        else if(this.right == true && this.positionX < 300){
            this.positionX += 4
        }

        if(this.up == true && this.positionY > 10){
            this.positionY -= 4;
        }

        else if(this.down == true && this.positionY < 435){
            this.positionY += 4;
        }

        if(this.shoot == true && this.canShoot == true){
            this.shoot = false;
            this.canShoot = false;
            player.charges -= 1;
            canhao.classList.add("recarregando");
            tiro.play();

            setTimeout(function(){
                player.canShoot = true;
                canhao.classList.remove("recarregando");
            }, 3000);

            setTimeout(function(){
                player.charges += 1;
            }, 10000);
            
            x = document.createElement("div");
            x.className = "shoot";
            foreground.appendChild(x);
            this.shootArray.push(x);
        }
        else if(this.shoot == true && this.canShoot == false){
            this.shoot = false;
        }

        if(this.shootArray != []){
            this.shootArray.forEach(function(x){
                x.style.left = String(parseInt(getComputedStyle(x).left) + 10) + "px";
                x.style.top = String(parseInt(getComputedStyle(x).top)) + "px";

                if(parseInt(x.style.left) > 800){
                    foreground.removeChild(x);
                    player.shootArray.shift();
                }
            })
        }

        document.body.style.setProperty("--player_position_x", String(this.positionX)+"px");
        document.body.style.setProperty("--player_position_y", String(this.positionY)+"px");
    }
}

hostage = {
    positionX: parseInt(getComputedStyle(document.body).getPropertyValue("--hostage_position_x")),
    sprint: 2,

    move: function(){
        if(
            (refem.classList.contains("dead") == false) &&
            (refem.classList.contains("rescued") == false) &&
            (this.positionX + 44 > enemy2.positionX && this.positionX < enemy2.positionX + 165)
        ){
            refem.classList.add("dead");
            morte.play();
        }
        else if(
            (refem.classList.contains("dead") == false) &&
            (refem.classList.contains("rescued") == false) &&
            (this.positionX + 44 > player.positionX && this.positionX < player.positionX + 256) &&
            (player.positionY >= 435 - 51)
        ){
            player.pontos += 10;
            refem.classList.add("rescued");
            resgate.play();
        }
        else if(
            (refem.classList.contains("dead") == true)
        ){
            this.positionX -= ((2200/10)/60);

            if(enemy2.positionX >= 900){
                hostage.positionX = Math.floor(Math.random() * -300) - 100;
                hostage.sprint = Math.floor(Math.random() * 4) + 1;
                refem.classList.remove("dead");
            }
        }
        else if(
            (refem.classList.contains("rescued") == true)
        ){
            if(enemy2.positionX >= 950){
                setTimeout(function(){
                    hostage.positionX = Math.floor(Math.random() * -300) - 100;
                    hostage.sprint = Math.floor(Math.random() * 4) + 1;
                    refem.classList.remove("rescued");
                }, 2000);
            }
        }
        else{
            this.positionX += this.sprint;
        }
        document.body.style.setProperty("--hostage_position_x", String(this.positionX)+"px");
    }
}

enemy1 = {
    positionX: parseInt(getComputedStyle(document.body).getPropertyValue("--enemy1_position_x")),
    positionXOffset: 0,
    positionY: parseInt(getComputedStyle(document.body).getPropertyValue("--enemy1_position_y")),
    width: parseInt(getComputedStyle(inimigo1)["width"]),
    height: parseInt(getComputedStyle(inimigo1)["height"]),

    move: function(){
        player.shootArray.forEach(function(x){
            if(
                (!inimigo1.classList.contains("destroyed")) &&
                (parseInt(x.style.top) > enemy1.positionY && parseInt(x.style.top) < enemy1.positionY + enemy1.height) &&
                (parseInt(x.style.left) >= enemy1.positionX)
            
            ){
                player.pontos += 10;
                inimigo1.classList.add("destroyed");
                explosao.play();
            }
        })

        if(
            (jogador.classList.contains("destroyed") == false) &&
            (inimigo1.classList.contains("destroyed") == false) &&
            (this.positionX + 120 > player.positionX && this.positionX < player.positionX + 120) &&
            (this.positionY + 50 > player.positionY && this.positionY < player.positionY + 50)
        ){
            endGame();
        }

        else if(this.positionX > -256){
            this.positionX -= 8;
        }

        else{
            inimigo1.classList.remove("destroyed");
            positionXOffset = Math.floor(Math.random() * 600);
            this.positionX = 800 + positionXOffset;
            this.positionY = /*positionXOffset =*/ Math.floor(Math.random() * 365) + 10; //10px abaixo da tela e 40px acima do chão
        }

        document.body.style.setProperty("--enemy1_position_x", String(this.positionX)+"px");
        document.body.style.setProperty("--enemy1_position_y", String(this.positionY)+"px");
    }
}

enemy2 = {
    positionX: parseInt(getComputedStyle(document.body).getPropertyValue("--enemy2_position_x")),

    move: function(){
        if(
            (jogador.classList.contains("destroyed") == false) &&
            (this.positionX + 165 > player.positionX && this.positionX < player.positionX + 182) &&
            (player.positionY > 370)
        ){
            endGame();
        }
        else if(this.positionX > -256){
            this.positionX -= 5;
        }
        else{
            positionXOffset = Math.floor(Math.random() * 1600) + 1;
            this.positionX = 800 + positionXOffset;
        }
        document.body.style.setProperty("--enemy2_position_x", String(this.positionX)+"px");
    }
}

hud = {
    update: function(){
        switch(player.charges){
            case 0:
                energias.style.backgroundImage = "url(assets/JogosHTML5/jogo1/imgs/energia0.png)";
                break
            case 1:
                energias.style.backgroundImage = "url(assets/JogosHTML5/jogo1/imgs/energia1.png)";
                break
            case 2:
                energias.style.backgroundImage = "url(assets/JogosHTML5/jogo1/imgs/energia2.png)";
                break
            case 3:
                energias.style.backgroundImage = "url(assets/JogosHTML5/jogo1/imgs/energia3.png)";
                break

        }

        pontuacao.innerHTML = `PONTOS: ${player.pontos}`;
    }
}


/*FUNCOES*/
function toggleHideClass(toggle_array){
    for(let i=0; i<toggle_array.length; i++){
        toggle_array[i].classList.remove("hide");
    }
    instrucoes.classList.toggle("hide");
}

function gameLoop(){
    loop = setInterval(function(){
        hud.update();
        player.action();
        hostage.move();
        enemy1.move();
        enemy2.move();
    }, FPS);
}

function start(){
    let toggle_array = document.querySelectorAll(".hide");
    toggleHideClass(toggle_array);
    musica_fundo.loop = true;
    musica_fundo.play();
    gameLoop();
}

function endGame(){
    //clearInterval(loop);
    jogador.classList.add("destroyed");
    explosao.play();
    delete player.input;
    document.removeEventListener("keydown", function(){player.input(event.keyCode)});

    console.log("FIM DE JOGO");
}
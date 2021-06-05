var obstacles = [];
var score;
var player;

// Game Control
function startGame() {
    player = new Player();
    score = new Component("30px", "Consolas", "black", 280, 40, "text");
    GameArea.start();
    player.init();
}
function restart() {
    clearInterval(GameArea.interval)
    obstacles = []
    player = undefined
    GameArea.clear()
    startGame()
}

// Main Game
var GameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        screen_ratio = 9 / 16,
            this.canvas.width = 600;
        this.canvas.height = this.canvas.width * screen_ratio;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

// Main Update
function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    // Collision Detection
    for (i = 0; i < obstacles.length; i += 1) {
        if (player.crashWith(obstacles[i])) {
            return;
        }
    }
    GameArea.clear();
    GameArea.frameNo += 1;
    // Create a new obstacles 
    if (GameArea.frameNo == 1 || everyInterval(125)) {
        x = GameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
        obstacles.push(new Component(10, height, "green", x, 0));
        obstacles.push(new Component(10, x - height - gap, "green", x, height + gap));
    }
    // Move the obstacles forward
    for (i = 0; i < obstacles.length; i += 1) {
        obstacles[i].x += -1;
        obstacles[i].update();
    }
    score.text = "SCORE: " + GameArea.frameNo;
    score.update();
    player.update();
}

function everyInterval(n) {
    if ((GameArea.frameNo / n) % 1 == 0) { return true; }
    return false;
}

// General Components
function Component(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;

    this.update = function () {
        ctx = GameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}


// Player object
function Player() {
    // Sprite init
    this.sprite = new Image(),
        this.sprite.src = "car.png";
    this.ratio = this.sprite.width / this.sprite.height
    this.scaling_factor = this.ratio * 0.035
    this.width = this.scaling_factor * this.sprite.width
    this.height = this.scaling_factor * this.sprite.height
    this.x = 20
    this.y = 20
    this.speed = 3
    this.init = function () {
        // Same as update but with an EventListener used for
        // loading the image
        ctx = GameArea.context
        this.sprite.addEventListener('load', () => {
            ctx.drawImage(this.sprite, this.x, this.y,
                this.width,
                this.height);
        })
    }
    this.update = function () {
        ctx = GameArea.context
        ctx.drawImage(this.sprite, this.x, this.y,
            this.width,
            this.height);
    }
    this.crashWith = function (otherobj) {
        var left = this.x;
        var right = this.x + (this.width);
        var top = this.y;
        var bottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((bottom < othertop) || (top > otherbottom) || (right < otherleft) || (left > otherright)) {
            crash = false;
        }
        return crash;
    }
}


// Event Listener
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
        console.log("move player up");
        player.y += -player.speed;
    }
    else if (event.key === "ArrowDown") {
        console.log("move player down");
        player.y += player.speed;
    }
    else if (event.key === "ArrowLeft") {
        console.log("move player left");
        player.x += -player.speed;
    }
    else if (event.key === "ArrowRight") {
        console.log("move player right");
        player.x += player.speed;
    }
});
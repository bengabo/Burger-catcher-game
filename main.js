import "./style.css";
import Phaser from "phaser";

const sizes = {
  width: 500,
  height: 500,
};
const speedDown = 400;

const gameStart = document.getElementById("gameStart");
const gameStartBtn = document.getElementById("gameStartBtn");
const gameRestartBtn = document.getElementById("gameRestartBtn");
const gameEnd = document.getElementById("gameEnd");
const gameWinLose = document.getElementById("gameWinLose");
const gameEndScore = document.getElementById("gameEndScore");

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.player;
    this.cursor;
    this.playerSpeed = speedDown + 200;
    this.target;
    this.points = 0;
    this.textScore;
    this.textTime;
    this.timedEvent;
    this.remainingTime;
    this.emitter;
  }

  preload() {
    this.load.image("bg", "/assets/bg.png");
    this.load.image("box", "/assets/red-cardboardbox.png");
    this.load.image("burger", "/assets/burger.png");
    this.load.image("money", "/assets/money.png");
  }
  create() {
    this.scene.pause("scene-game");

    // Background image
    this.add.image(0, 0, "bg").setOrigin(0, 0);

    // Red cardbox
    this.player = this.physics.add
      .image(0, sizes.height - 100, "box")
      .setOrigin(0, 0);
    this.player.setScale(0.6);
    this.player.setSize(150, 10).setOffset(10, 70);
    this.player.setImmovable(true);
    this.player.body.allowGravity = false;
    this.player.setCollideWorldBounds(true);
    // this.add.image(0, 0, "burger").setOrigin(0, 0);

    // Burger
    this.target = this.physics.add.image(0, 0, "burger").setOrigin(0, 0);
    this.target.setMaxVelocity(50, speedDown);
    this.physics.add.overlap(
      this.target,
      this.player,
      this.targetHit,
      null,
      this
    );
    this.cursor = this.input.keyboard.createCursorKeys();

    // Coins
    this.emitter = this.add.particles(0, 0, "money", {
      speed: 100,
      gravityY: speedDown - 200,
      scale: 0.05,
      duration: 50,
      emitting: false,
      quantity: 5,
      angle: { min: 180, max: 360 },
      emitZone: {
        type: "random",
        source: new Phaser.Geom.Rectangle(-20, -15, 20, 20),
      },
    });
    this.emitter.startFollow(
      this.player,
      this.player.width / 3,
      this.player.height / 5,
      true
    );

    // Text
    this.textScore = this.add.text(30, 30, "Score: 0", {
      font: "25px Helvetica",
      fill: "#fff",
      backgroundColor: "#FF2745",
    });

    this.textTime = this.add.text(sizes.width - 120, 30, "Time: 00", {
      font: "25px Helvetica",
      fill: "#fff",
      backgroundColor: "#FF2745",
    });

    this.timedEvent = this.time.delayedCall(15000, this.gameOver, [], this);
  }

  update() {
    this.remainingTime = this.timedEvent.getRemainingSeconds();
    this.textTime.setText(`Time: ${Math.round(this.remainingTime).toString()}`);

    if (this.target.y >= sizes.height) {
      this.target.setY(0);
      this.target.setX(this.getRandomX());
    }

    const { left, right } = this.cursor;

    const easeFactor = 0.2;
    if (left.isDown) {
      this.player.setVelocityX(
        Phaser.Math.Linear(
          this.player.body.velocity.x,
          -this.playerSpeed,
          easeFactor
        )
      );
    } else if (right.isDown) {
      this.player.setVelocityX(
        Phaser.Math.Linear(
          this.player.body.velocity.x,
          this.playerSpeed,
          easeFactor
        )
      );
    } else {
      this.player.setVelocityX(
        Phaser.Math.Linear(this.player.body.velocity.x, 0, easeFactor)
      );
    }
  }

  getRandomX() {
    return Math.floor(Math.random() * 450);
  }

  targetHit() {
    this.emitter.start();
    this.target.setY(0);
    this.target.setX(this.getRandomX());
    this.points++;
    this.textScore.setText(`Score: ${this.points}`);
  }

  gameOver() {
    // game.scene.resume("scene-game");
    this.sys.game.destroy(true);
    if (this.points >= 10) {
      gameEndScore.textContent = this.points;
      gameWinLose.textContent = " win!";
    } else if (this.points < 10) {
      gameEndScore.textContent = this.points;
      gameWinLose.textContent = " lose!";
    }
    gameEnd.style.display = "flex";
  }
}

const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: gameCanvas,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: speedDown },
      debug: false,
    },
  },
  scene: [GameScene],
};

const game = new Phaser.Game(config);

function preload() {
  this.load.setBaseURL("http://labs.phaser.io");
}

function create() {}

gameStartBtn.addEventListener("click", () => {
  gameStart.style.display = "none";
  game.scene.resume("scene-game");
});

gameRestartBtn.addEventListener("click", () => {
  location.reload();
});

import "./style.css";
import Phaser from "phaser";

const sizes = {
  width: 500,
  height: 500,
};
const speedDown = 300;

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.player;
    this.cursor;
    this.playerSpeed = speedDown + 200;
    this.target;
    this.emitter;
  }

  preload() {
    this.load.image("bg", "/assets/bg.png");
    this.load.image("box", "/assets/red-cardboardbox.png");
    this.load.image("burger", "/assets/burger.png");
    this.load.image("money", "/assets/money.png");
  }
  create() {
    this.add.image(0, 0, "bg").setOrigin(0, 0);
    this.player = this.physics.add
      .image(0, sizes.height - 100, "box")
      .setOrigin(0, 0);
    this.player.setScale(0.6);
    this.player.setSize(75, 20).setOffset(50, 65);
    this.player.setImmovable(true);
    this.player.body.allowGravity = false;
    this.player.setCollideWorldBounds(true);
    // this.add.image(0, 0, "burger").setOrigin(0, 0);

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

    this.emitter = this.add.particles(0, 0, "money", {
      speed: 100,
      gravityY: speedDown - 200,
      scale: 0.05,
      duration: 100,
      emitting: false,
    });
    this.emitter.startFollow(this.player, this.player.width / 3, this.player.height / 5, true)
  }
  update() {
    if (this.target.y >= sizes.height) {
      this.target.setY(0);
      this.target.setX(this.getRandomX());
    }

    const { left, right } = this.cursor;

    if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
    } else {
      this.player.setVelocityX(0);
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

var game = new Phaser.Game(config);

function preload() {
  this.load.setBaseURL("http://labs.phaser.io");
}

function create() {
}

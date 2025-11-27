import Phaser from 'phaser';

export class OnePulseGameScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Arc;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private pulseCallback?: () => void;
  private otherPlayers: Map<string, Phaser.GameObjects.Arc> = new Map();
  private grid!: Phaser.GameObjects.Grid;
  private lastPulseTime: number = 0;
  private pulseCooldown: number = 1000; // 1 second

  constructor() {
    super({ key: 'OnePulseGame' });
  }

  init(data: { onPulse?: () => void }) {
    this.pulseCallback = data.onPulse;
  }

  create() {
    // Create cyberpunk grid background
    this.createBackground();

    // Create player
    this.player = this.add.circle(400, 300, 20, 0x00f5ff);
    this.player.setStrokeStyle(2, 0xffffff);

    // Add glow effect
    this.player.postFX.addGlow(0x00f5ff, 4, 0, false, 0.1, 10);

    // Input
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Pulse effect on space
    this.spaceKey.on('down', () => {
      this.triggerPulse();
    });

    // Add instructions text
    this.add.text(400, 50, 'Arrow Keys to Move • SPACE to Pulse', {
      fontSize: '16px',
      color: '#00F5FF',
      fontFamily: 'monospace',
    }).setOrigin(0.5);
  }

  private createBackground() {
    // Dark background
    this.cameras.main.setBackgroundColor('#0A0E27');

    // Animated grid
    this.grid = this.add.grid(
      400,
      300,
      800,
      600,
      40,
      40,
      0x1e293b,
      0,
      0x00f5ff,
      0.3
    );

    // Animate grid
    this.tweens.add({
      targets: this.grid,
      alpha: 0.5,
      duration: 2000,
      yoyo: true,
      repeat: -1,
    });

    // Add particles for ambient effect (stored for future use)
    // @ts-ignore - particles kept for future ambient effects
    const _particles = this.add.particles(0, 0, 'particle', {
      x: { min: 0, max: 800 },
      y: { min: 0, max: 600 },
      speed: { min: 10, max: 30 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.5, end: 0 },
      lifespan: 3000,
      frequency: 200,
      tint: 0x00f5ff,
    });
  }

  private triggerPulse() {
    const now = Date.now();
    if (now - this.lastPulseTime < this.pulseCooldown) {
      return;
    }

    this.lastPulseTime = now;

    // Visual pulse effect
    const pulse = this.add.circle(this.player.x, this.player.y, 20, 0xff006e, 0.5);

    this.tweens.add({
      targets: pulse,
      radius: 100,
      alpha: 0,
      duration: 500,
      onComplete: () => {
        pulse.destroy();
      },
    });

    // Player bounce
    this.tweens.add({
      targets: this.player,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 100,
      yoyo: true,
    });

    // Trigger blockchain pulse
    if (this.pulseCallback) {
      this.pulseCallback();
    }
  }

  update() {
    // Player movement
    const speed = 200;

    if (this.cursors.left.isDown) {
      this.player.x -= speed * (this.game.loop.delta / 1000);
    } else if (this.cursors.right.isDown) {
      this.player.x += speed * (this.game.loop.delta / 1000);
    }

    if (this.cursors.up.isDown) {
      this.player.y -= speed * (this.game.loop.delta / 1000);
    } else if (this.cursors.down.isDown) {
      this.player.y += speed * (this.game.loop.delta / 1000);
    }

    // Keep player in bounds
    this.player.x = Phaser.Math.Clamp(this.player.x, 20, 780);
    this.player.y = Phaser.Math.Clamp(this.player.y, 20, 580);
  }

  public addOtherPlayer(address: string, x: number, y: number, color: number) {
    if (this.otherPlayers.has(address)) return;

    const otherPlayer = this.add.circle(x, y, 15, color, 0.7);
    otherPlayer.setStrokeStyle(2, 0xffffff);
    this.otherPlayers.set(address, otherPlayer);
  }

  public updateOtherPlayer(address: string, x: number, y: number) {
    const player = this.otherPlayers.get(address);
    if (player) {
      player.x = x;
      player.y = y;
    }
  }

  public removeOtherPlayer(address: string) {
    const player = this.otherPlayers.get(address);
    if (player) {
      player.destroy();
      this.otherPlayers.delete(address);
    }
  }

  public showPulseAt(x: number, y: number, color: number = 0xff006e) {
    const pulse = this.add.circle(x, y, 15, color, 0.5);

    this.tweens.add({
      targets: pulse,
      radius: 80,
      alpha: 0,
      duration: 500,
      onComplete: () => {
        pulse.destroy();
      },
    });
  }
}

// Preloader scene for assets
export class PreloadScene extends Phaser.Scene {
  private initData?: { onPulse?: () => void };

  constructor() {
    super({ key: 'Preload' });
  }

  init(data: { onPulse?: () => void }) {
    this.initData = data;
  }

  preload() {
    // Create a simple particle texture
    const graphics = this.add.graphics();
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(2, 2, 2);
    graphics.generateTexture('particle', 4, 4);
    graphics.destroy();
  }

  create() {
    // Pass the callback data to the game scene
    this.scene.start('OnePulseGame', this.initData);
  }
}

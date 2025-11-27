import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { OnePulseGameScene, PreloadScene } from '../game/OnePulseGame';
import { useOnePulseArena } from '../hooks/useOnePulseArena';

interface GameCanvasProps {
  onPulse?: () => void;
}

export function GameCanvas({ onPulse }: GameCanvasProps) {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { recordPulse } = useOnePulseArena();

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: containerRef.current,
      backgroundColor: '#0A0E27',
      scene: [PreloadScene, OnePulseGameScene],
      physics: {
        default: 'arcade',
        arcade: {
          debug: false,
        },
      },
    };

    gameRef.current = new Phaser.Game(config);

    // Pass pulse callback to game scene
    gameRef.current.scene.start('Preload', {
      onPulse: async () => {
        await recordPulse();
        if (onPulse) onPulse();
      },
    });

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [recordPulse, onPulse]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="border-2 border-neon-blue rounded-lg overflow-hidden shadow-lg shadow-neon-blue/30"
        style={{ width: '800px', height: '600px' }}
      />
      <div className="absolute top-4 right-4 bg-cyber-darker/90 px-4 py-2 rounded-lg border border-neon-purple">
        <p className="text-neon-blue text-sm font-mono">
          🎮 Use Arrow Keys to Move
        </p>
        <p className="text-neon-pink text-sm font-mono">
          ⚡ Press SPACE to Pulse
        </p>
      </div>
    </div>
  );
}

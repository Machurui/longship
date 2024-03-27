import React, { createContext, useState, useContext, useEffect } from "react";
import { ethers } from "ethers";
import { Boat, BoatType } from "../model/Battleship";
import BattleShipAbi from "../BattleShip.json";

interface GameState {
  myBoats: Map<BoatType, Boat>;
  setMyBoats: React.Dispatch<React.SetStateAction<Map<BoatType, Boat>>>;
  provider: ethers.JsonRpcProvider | null;
  contract: ethers.Contract | null;
  startGame: () => Promise<void>;
  checkIfGameStarted: () => Promise<boolean>;
  checkCurrentPlayer: () => Promise<string>;
  gameStarted: boolean;
  checkPlayer1: () => Promise<string>;
  checkPlayer2: () => Promise<string>;
  surrender: () => Promise<void>;
  checkIfGameEnded: () => Promise<boolean>;
  checkWinner: () => Promise<string>;
  attackContract: (x: number, y: number, status: number) => Promise<void>;
}

const GameContext = createContext<GameState | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [myBoats, setMyBoats] = useState<Map<BoatType, Boat>>(new Map());
  const [provider, setProvider] = useState<ethers.JsonRpcProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  // Connect to Ethereum provider when component mounts
  useEffect(() => {
    const initializeProvider = async () => {
      let signer = null;

      let provider;
      if ((window as any).ethereum == null) {
        console.log("no provider! quit...");
        return;
      }
      console.log("provider", (window as any).ethereum);

      provider = new ethers.BrowserProvider((window as any).ethereum);

      console.log("signer", signer);
      const network = await provider.getNetwork();

      console.log("Provider initialized:", provider);
      console.log(network);

      // Deploy the contract after the provider is ready
      signer = await provider.getSigner();

      console.log("Signer address:", await signer.getAddress());
      const contract = await deployNewBattleShip(signer);
      setContract(contract);
    };

    initializeProvider();
  }, []);

  async function deployNewBattleShip(signer: ethers.Signer) {
    const factory = new ethers.ContractFactory(
      BattleShipAbi.abi,
      BattleShipAbi.bytecode,
      signer
    );

    const deployTransaction = await factory.getDeployTransaction(
      "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
    );
    const deployedContract = await signer.sendTransaction(deployTransaction);
    const receipt = await deployedContract.wait();

    const contractAddress = receipt ? receipt.contractAddress : null;
    console.log("Battleship contract deployed at address:", contractAddress);

    const deployedInstance = new ethers.Contract(
      contractAddress as string,
      BattleShipAbi.abi,
      signer
    );

    return deployedInstance;
  }

  // Start the game
  const startGame = async () => {
    if (contract) {
      try {
        // Fetch and log gameStarted before starting the game
        const gameStartedBefore = await contract.gameStarted();
        console.log("Game started before:", gameStartedBefore);

        const tx = await contract.startGame();
        await tx.wait(); // Wait for transaction to be mined

        // Fetch and log gameStarted after starting the game
        const gameStartedAfter = await contract.gameStarted();
        console.log("Game started after:", gameStartedAfter);

        // After starting the game, fetch the current player
      } catch (error) {
        console.error("Failed to start game:", error);
      }
    } else {
      console.error("Contract not loaded");
    }
  };

  const surrender = async () => {
    if (contract) {
      try {
        const tx = await contract.endGameManually();
        await tx.wait(); // Wait for transaction to be mined
      } catch (error) {
        console.error("Failed to surrender:", error);
      }
    } else {
      console.error("Contract not loaded");
    }
  };

  // check events --------------------------------------------------------------
  useEffect(() => {
    if (contract) {
      // check event GameStarted
      contract.on("GameStarted", async (player1, player2) => {
        console.log("Game started event:", player1, player2);
      });
    }
  }, [contract]);

  useEffect(() => {
    if (contract) {
      // check event GameEnded
      contract.on("GameEnded", async (winner) => {
        console.log("Game finished, the winner is:", winner);
      });
    }
  }, [contract]);

  useEffect(() => {
    if (contract) {
      // check event Attack
      contract.on("Attack", async (attacker, x, y, hit) => {
        console.log(
          "Attack event:",
          attacker,
          "attack on x:",
          x,
          " y:",
          y,
          " result:",
          hit
        );
      });
    }
  }, [contract]);

  //--------------------------------------------------------------------------------

  // check if game started
  const checkIfGameStarted = async () => {
    if (contract) {
      try {
        const gameStarted = await contract.gameStarted();
        setGameStarted(gameStarted);
        return gameStarted;
      } catch (error) {
        console.error("Failed to check if game started:", error);
      }
    } else {
      console.error("Contract not loaded");
      return false;
    }
  };
  const checkIfGameEnded = async () => {
    if (contract) {
      try {
        const gameEnded = await contract.gameOver();
        return gameEnded;
      } catch (error) {
        console.error("Failed to check if game ended:", error);
      }
    } else {
      console.error("Contract not loaded");
    }
  };
  // check current player
  const checkCurrentPlayer = async () => {
    if (contract) {
      try {
        const currentPlayer = await contract.currentPlayer();
        return currentPlayer;
      } catch (error) {
        console.error("Failed to check current player:", error);
      }
    } else {
      console.error("Contract not loaded");
    }
  };
  // check player1 and player2
  const checkPlayer1 = async () => {
    if (contract) {
      try {
        const player1 = await contract.host();
        return player1;
      } catch (error) {
        console.error("Failed to check player1:", error);
      }
    } else {
      console.error("Contract not loaded");
    }
  };
  const checkPlayer2 = async () => {
    if (contract) {
      try {
        const player2 = await contract.guest();
        return player2;
      } catch (error) {
        console.error("Failed to check player2:", error);
      }
    } else {
      console.error("Contract not loaded");
    }
  };

  const checkWinner = async () => {
    if (contract) {
      try {
        const winner = await contract.winner();
        return winner;
      } catch (error) {
        console.error("Failed to check winner:", error);
      }
    } else {
      console.error("Contract not loaded");
    }
  };

  const attackContract = async (x: number, y: number, status: number) => {
    if (contract) {
      try {
        const tx = await contract.attack(x, y, status);
        await tx.wait(); // Wait for transaction to be mined
      } catch (error) {
        console.error("Failed to attack:", error);
      }
    } else {
      console.error("Contract not loaded");
    }
  };

  return (
    <GameContext.Provider
      value={{
        myBoats,
        setMyBoats,
        provider,
        contract,
        startGame,
        checkIfGameStarted,
        checkCurrentPlayer,
        gameStarted,
        checkPlayer1,
        checkPlayer2,
        surrender,
        checkIfGameEnded,
        checkWinner,
        attackContract,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};

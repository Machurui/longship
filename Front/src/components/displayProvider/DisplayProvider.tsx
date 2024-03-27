import { useGame } from "../../context/GameContext";
import { useState, useEffect } from "react";
import { Network, JsonRpcSigner } from "ethers";

function DisplayProvider() {
  const { provider } = useGame();
  const [network, setNetwork] = useState<Network | null>(null);
  const [accounts, setAccounts] = useState<string[]>([]);

  useEffect(() => {
    if (provider) {
      provider.getNetwork().then((network) => setNetwork(network));
      provider
        .listAccounts()
        .then((signers: JsonRpcSigner[]) =>
          Promise.all(signers.map((signer) => signer.getAddress()))
        )
        .then((addresses: string[]) => setAccounts(addresses));
    }
  }, [provider]);

  if (provider) {
    return (
      <div>
        Provider:{" "}
        {network
          ? `Chain ID: ${network.chainId.toString()}, Name: ${network.name}`
          : "Loading..."}
        <br />
        Accounts: {accounts.length > 0 ? accounts.join(", ") : "No accounts"}
      </div>
    );
  } else {
    return <div>No provider</div>;
  }
}

export default DisplayProvider;

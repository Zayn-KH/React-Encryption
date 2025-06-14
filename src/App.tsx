import { useState } from 'react';
import forge from 'node-forge';
import './App.css';

function App() {
  const [responseMessage, setResponseMessage] = useState('');

  // Read client's key pair
  async function getClientKeyPair() {
    const [publicKeyPem, privateKeyPem] = await Promise.all([
      fetch('/assets/client-public.pem').then(r => r.text()),
      fetch('/assets/client-private.pem').then(r => r.text())
    ]);
    return {
      publicKey: forge.pki.publicKeyFromPem(publicKeyPem),
      privateKey: forge.pki.privateKeyFromPem(privateKeyPem)
    };
  }

  async function encryptForServer(data: string): Promise<string> {
    const serverPublicPem = await fetch('/assets/server-public.pem').then(r => r.text());
    const serverPublicKey = forge.pki.publicKeyFromPem(serverPublicPem);
    const encrypted = serverPublicKey.encrypt(data, 'RSA-OAEP');
    return forge.util.encode64(encrypted);
  }

  async function decryptFromServer(encryptedBase64: string): Promise<string> {
    const { privateKey } = await getClientKeyPair();
    const encrypted = forge.util.decode64(encryptedBase64);
    const decrypted = privateKey.decrypt(encrypted, 'RSA-OAEP');
    return decrypted;
  }

  async function handleSecureSend() {
    const { publicKey } = await getClientKeyPair();
    const publicKeyPem = forge.pki.publicKeyToPem(publicKey);

    const encrypted = await encryptForServer("Sensitive Data");
    const payload = {
      encrypted,
      clientPublicKey: publicKeyPem
    };

    const res = await fetch("http://localhost:8080/api/secure", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const { encryptedResponse } = await res.json();
    const decryptedResponse = await decryptFromServer(encryptedResponse);
    setResponseMessage(decryptedResponse);
  }

  return (
    <div>
      <button onClick={handleSecureSend}>Send Secure Request include public key</button>
      <p>Server says: {responseMessage}</p>
    </div>
  );
}

export default App;

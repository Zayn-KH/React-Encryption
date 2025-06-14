import { useState } from 'react';
import forge from 'node-forge';

function RSA() {
  const [responseMessage, setResponseMessage] = useState('');

  async function getClientPrivateKey() {
    const privatePem = await fetch('/assets/client-private.pem').then(res => res.text());
    return forge.pki.privateKeyFromPem(privatePem);
  }

  async function encryptForServer(data: string): Promise<string> {
    const serverPublicPem = await fetch('/assets/server-public.pem').then(r => r.text());
    const serverPublicKey = forge.pki.publicKeyFromPem(serverPublicPem);
    const encrypted = serverPublicKey.encrypt(data, 'RSA-OAEP');
    return forge.util.encode64(encrypted);
  }

  async function decryptFromServer(encryptedBase64: string): Promise<string> {
    const privateKey = await getClientPrivateKey();
    const encrypted = forge.util.decode64(encryptedBase64);
    return privateKey.decrypt(encrypted, 'RSA-OAEP');
  }

  async function handleSecureSend() {
    const encrypted = await encryptForServer("Sensitive Hello Pig Dog Data");

    const res = await fetch("http://localhost:8080/apiv2/secure", {
      method: "POST",
      headers: { "Content-Type": "application/json"},

      body: JSON.stringify({ encrypted })
    });

    const { encryptedResponse } = await res.json();
    const decryptedResponse = await decryptFromServer(encryptedResponse);
    setResponseMessage(decryptedResponse);
  }

  return (
    <div>
      <button onClick={handleSecureSend}>Send Secure Request exclude public key</button>
      <p>Server says: {responseMessage}</p>
    </div>
  );
}

export default RSA;

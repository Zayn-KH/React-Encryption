// ✅ AppHybrid.tsx (React client)

import forge from 'node-forge';
import { useState } from 'react';
import './App.css';
import data from './data';

let cachedAESKey = ''; // Store AES key for decrypting server response

function AppHybrid() {
  const [responseMessage, setResponseMessage] = useState('');

  async function encryptHybrid(data: string) {
    const aesKey = forge.random.getBytesSync(32); // AES-256
    const iv = forge.random.getBytesSync(16);

    const cipher = forge.cipher.createCipher('AES-CBC', aesKey);
    cipher.start({ iv });
    cipher.update(forge.util.createBuffer(data, 'utf8'));
    cipher.finish();
    const encryptedData = cipher.output.getBytes();

    cachedAESKey = aesKey; // Store AES key for decryptHybrid()

    const serverPublicPem = await fetch('/assets/server-public.pem').then(r => r.text());
    const serverPublicKey = forge.pki.publicKeyFromPem(serverPublicPem);
    const encryptedKey = serverPublicKey.encrypt(aesKey, 'RSA-OAEP');

    return {
      encryptedKey: forge.util.encode64(encryptedKey),
      iv: forge.util.encode64(iv),
      encryptedData: forge.util.encode64(encryptedData),
    };
  }

  async function decryptHybrid(iv: string, encryptedData: string) {
    const decipher = forge.cipher.createDecipher('AES-CBC', cachedAESKey);
    decipher.start({ iv: forge.util.decode64(iv) });
    decipher.update(forge.util.createBuffer(forge.util.decode64(encryptedData)));
    decipher.finish();
    return decipher.output.toString('utf8');
  }

  async function handleSecureSend() {
    const encryptedPayload = await encryptHybrid(data);

    const res = await fetch("http://localhost:8080/apiv3/secure", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(encryptedPayload),
    });

    const resBody = await res.json();
    const decrypted = await decryptHybrid(resBody.iv, resBody.encryptedData);
    setResponseMessage(decrypted);
  }

  return (
    <div>
      <button onClick={handleSecureSend}>Send Secure Request Hybrid RSA + AES</button>
      <p>Server says: {responseMessage}</p>
    </div>
  );
}

export default AppHybrid;

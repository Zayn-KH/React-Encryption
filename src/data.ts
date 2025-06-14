const data = `
In a world where technology evolves faster than the blink of an eye, businesses, developers, and innovators constantly seek robust solutions to secure data. One approach that stands out is hybrid encryption—a method that cleverly combines the speed of symmetric algorithms like AES with the security of asymmetric algorithms like RSA.

Hybrid encryption works by generating a random AES key for each session. This key encrypts the actual message (no matter how large), ensuring fast performance. Then, the AES key itself is encrypted using RSA and sent alongside the encrypted message. The receiver, who possesses the corresponding RSA private key, decrypts the AES key and then uses it to decrypt the original message.

This methodology is not only secure but also extremely efficient, especially when handling large payloads of data such as logs, form submissions, media metadata, and more. 

To illustrate, imagine sending the full text of a novel:
`.repeat(50) + `
“Chapter One: The Dawn of Innovation”

It was a silent morning. The servers hummed in their racks, the lines of code ready to be compiled and deployed. Data streamed through encrypted tunnels, bouncing across the globe, each packet a whisper of something greater.

Encryption, once a dark art known only to a few, had become the cornerstone of all communication. From chat messages to massive financial transactions, everything relied on keys—public and private, symmetric and asymmetric. And somewhere in a dimly lit room, a developer pressed "Deploy", watching as a hybrid system ensured the safety of a new era of communication.
`;

export default data;

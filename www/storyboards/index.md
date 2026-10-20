*Source: <https://send.sgit.ai/storyboards/> · send.sgit.ai v0.1.4 · generated from the same data as the page, so the two cannot drift.*

# Send, as storyboards

> How send.sgit.ai works, drawn: for everyone, the four things a person does (send a file, say a token aloud, keep files in a vault, keep the keys); under the hood, what the bytes look like, the two kinds of API, how an agent hands a result over, and what can go wrong. Each board links to the page where you can do it for real.

8 storyboards, 69 panels, drawn by the kit at api.storyboards.sgit.ai v0.1.0.

## For everyone

No cryptography required: what you do, what the other person sees, and what the server never sees.

- [Send a file. Keep the key.](/storyboards/send-a-file/index.md): Maya sends forty photos to Hugo, who has no account; the server keeps bytes it cannot read; Hugo scans a code on his phone. 9 panels.
- [A token you can say aloud](/storyboards/say-it-aloud/index.md): river-cloud-3847 is the whole key: Maya says it on a call, Hugo types it, Eve hears it a week too late. 8 panels.
- [A folder that remembers](/storyboards/a-folder-that-remembers/index.md): Ravi gets a new version every week; Maya puts the files in a vault, shares the read key once, and every version stays. 9 panels.
- [Where the keys live](/storyboards/where-the-keys-live/index.md): The thing that was missing before: a keyring on the device, what it is, what it is not, and the one rule about which key may travel. 8 panels.

## Under the hood

For the engineer and the agent: the bytes, the two APIs, a hand-over by an agent, and the six ways it fails.

- [The envelope and the fragment](/storyboards/the-envelope/index.md): What the bytes look like, which of them the server sees, and where each of the two secrets goes. 9 panels.
- [Two kinds of API](/storyboards/two-kinds-of-api/index.md): The code a page runs is a release that never changes; the server it talks to is a deployment. Inês pins one and runs the other. 8 panels.
- [An agent hands over](/storyboards/an-agent-hands-over/index.md): Pip finishes a job, sends the result once with an expiry, keeps the work in a vault, and never logs a key. 9 panels.
- [What can go wrong](/storyboards/what-can-go-wrong/index.md): Six ways a hand-over fails: a link in a public channel, expired, the wrong key, a vault key in a link, and what revocation does and does not do. 9 panels.

## The cast

The cast of send.sgit.ai's storyboards, v0.1, proposed by the site's build agent on 20 October 2026 for Dinis to accept, change or replace. Drawn by the storyboard kit at api.storyboards.sgit.ai from 'look'; nothing here is an image. Fictional people and agents, each standing for a part a person or an agent plays when a file is handed over: the sender, the recipient on a phone, the client who asks who else can see it, the engineer who embeds the code and runs her own server, the listener on the wire, the server that holds bytes it cannot read, and a session agent that hands over a result. Names chosen not to clash with the gen-z-developers or the pki casts. Eve is the name cryptography has long given a passive eavesdropper.

- **Maya** (she/her): the sender: a consultant who sends reports and photos to people who have no account anywhere. anyone with a file to hand over who should not have to learn cryptography to do it. "Scan this."
- **Hugo** (he/him): the recipient: on the newest phone he has ever owned, with no account and no wish for one. everyone a link is sent to who did not choose the site. "Do I need an account?"
- **Ravi** (he/him): the client: a finance director who receives a new version every week and asks who else can see it. the person who needs the latest version and an answer about who can read it. "Who else can see this?"
- **Inês** (she/her): the engineer: embeds the send code in her company's product and runs a server of their own. anyone who builds on this and must know exactly which code their readers run. "Which release is this page running?"
- **Eve** (they/them): the listener: on the wire, in the chat, by the laptop; reads whatever passes and never gets the key. every channel a link travels by, and every reason the key must not travel with it. "Everything after the # is yours, not mine."
- **The Server** (it/its): the server: a capability-checked store of ciphertext, at send.sgraph.ai or wherever it is deployed. what a zero-knowledge service is: it holds the bytes, checks hashes, and cannot read anything. "I keep the bytes. I cannot read them."
- **Pip** (it/its): a session agent: a Claude session that finishes a job, hands the result over once, and keeps the work in a vault. every agent that must hand something to a person or another agent without an account and without pasting a key. "Report ready. One link, seven days."

# Examples, a page, curl, Python

> The same transfer made three ways: from a page with the pinned API, from a shell with curl and openssl, and from Python for an agent; plus the server in memory for trying it on a laptop.

*Source: <https://send.sgit.ai/use/> · send.sgit.ai v0.1.1 · this file is generated from the same content as the page, so the two cannot drift. Every page on this site has a `.md` twin; internal links below point at pages, swap `.html` for `.md` to read the twin.*

---

# Use it: examples

Everything here talks to the same server with the same formats, so a file sent one way opens every other way, including on [the open page](/open/).

## From a page {#page}

```html
<script type="module">
  import * as send from 'https://api.send.sgit.ai/v0.1.1/send/send-api.js'
  const api = new send.SendTransfers({ endpoint: 'https://send.sgraph.ai', accessToken })
  const r   = await api.send({ bytes, filename: 'report.pdf', expiresAt: Date.now() + 7 * 86400e3 })
  const url = send.link.transferLink({ openUrl: 'https://send.sgit.ai/open/', transferId: r.transferId, key: r.keyString })
  qr.innerHTML = send.qr.toSvg(url)
</script>
```

Full walk-through, including a friendly token and a vault: [the quick start](https://api.send.sgit.ai/start/).

## From a shell, with curl and openssl {#curl}

The layout is simple enough to do by hand: envelope, encrypt, three calls.

```bash
TOKEN=...; HOST=https://send.sgraph.ai; FILE=report.pdf
KEY=$(openssl rand -hex 32); IV=$(openssl rand -hex 12)
META=$(printf '{"filename":"%s"}' "$FILE"); LEN=$(printf '%s' "$META" | wc -c)
{ printf 'SGMETA\0'; printf "$(printf '\\x%02x\\x%02x\\x%02x\\x%02x' $((LEN>>24&255)) $((LEN>>16&255)) $((LEN>>8&255)) $((LEN&255)))"; printf '%s' "$META"; cat "$FILE"; } > plain.bin
# AES-256-GCM: openssl's CLI cannot emit the GCM tag; use the Python example below for GCM, or sgit's transfer command when it ships.
```

A GCM tag is required, and OpenSSL's command line does not produce one, so the honest shell example stops here: the three HTTP calls are below in Python, and they are the same from curl.

```bash
ID=$(curl -s -H "x-sgraph-access-token: $TOKEN" -H 'content-type: application/json' -d '{"file_size_bytes":1234,"content_type_hint":"application/octet-stream"}' $HOST/api/transfers/create | python3 -c 'import json,sys;print(json.load(sys.stdin)["transfer_id"])')
curl -s -H "x-sgraph-access-token: $TOKEN" -H 'content-type: application/octet-stream' --data-binary @cipher.bin $HOST/api/transfers/upload/$ID
curl -s -X POST -H "x-sgraph-access-token: $TOKEN" $HOST/api/transfers/complete/$ID
echo "https://send.sgit.ai/open/#$ID/$KEY_BASE64URL"
```

## From Python, for an agent {#python}

An agent that finishes a job and hands the result over once. Standard library plus `cryptography`; no account for the recipient.

```python
import base64, json, os, struct, urllib.request
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

HOST, TOKEN = 'https://send.sgraph.ai', os.environ['SGRAPH_ACCESS_TOKEN']   # the token: an env var, a header, never a URL

def send_file(path, expires_ms=0, max_downloads=0):
    data = open(path, 'rb').read()
    meta = json.dumps({'filename': os.path.basename(path)}).encode()
    plain = b'SGMETA\0' + struct.pack('>I', len(meta)) + meta + data          # the name inside the ciphertext
    key, iv = AESGCM.generate_key(256), os.urandom(12)
    cipher = iv + AESGCM(key).encrypt(iv, plain, None)                        # IV || ciphertext || tag
    def call(method, p, body=None, ctype='application/json'):
        req = urllib.request.Request(HOST + p, data=body, method=method, headers={'x-sgraph-access-token': TOKEN, 'content-type': ctype})
        with urllib.request.urlopen(req) as r: return r.read()
    tid = json.loads(call('POST', '/api/transfers/create', json.dumps({'file_size_bytes': len(data), 'content_type_hint': 'application/octet-stream', 'max_downloads': max_downloads, 'expires_at': expires_ms}).encode()))['transfer_id']
    call('POST', f'/api/transfers/upload/{tid}', cipher, 'application/octet-stream')
    call('POST', f'/api/transfers/complete/{tid}')
    k = base64.urlsafe_b64encode(key).decode().rstrip('=')
    return f'https://send.sgit.ai/open/#{tid}/{k}'                             # the key: in the fragment, never logged

def receive(link):
    frag = link.split('#', 1)[1].split('|')[0]; tid, k = frag.split('/', 1)
    key = base64.urlsafe_b64decode(k + '=' * (-len(k) % 4))
    with urllib.request.urlopen(f'{HOST}/api/transfers/download/{tid}') as r: cipher = r.read()   # public: the key is the gate
    plain = AESGCM(key).decrypt(cipher[:12], cipher[12:], None)
    assert plain[:7] == b'SGMETA\0'; n = struct.unpack('>I', plain[7:11])[0]
    return json.loads(plain[11:11 + n])['filename'], plain[11 + n:]
```

For an agent-facing link prefer `max_downloads=0` with a short `expires_ms`: a retry is not a reader, and a cap burns the allowance. [For agents](/use/agents/) has the rest of that guidance.

## On a laptop, with the server in memory {#local}

```
git clone https://github.com/SGit-AI/SGit-AI__Website__Send__API
node SGit-AI__Website__Send__API/releases/v0.1.1/tests/server.mjs 8787 local-dev-token
```

Then in [Settings](/settings/) choose "a server on this machine" with the token `local-dev-token`. Every feature works, nothing leaves the machine, and it forgets everything when it stops. It is the same server the API's 43 tests run against.



```markdown
# Ethereum Chain Explorer (Node.js + TypeScript)

## 📌 Project Overview

This project is a lightweight Ethereum blockchain explorer built with Node.js and TypeScript. It aims to provide essential visibility into an Ethereum address’s activity without relying on heavy frontend frameworks or bloated UI libraries.

The tool offers basic tabbed navigation for:
- ETH transactions (internal and external)
- ERC-20 tokens
- ERC-721 / ERC-1155 NFTs
- ENS resolution and ETH balance

It uses [ethers.js](https://docs.ethers.org/) and the [Alchemy SDK](https://docs.alchemy.com/reference/alchemy-sdk-api-quickstart) to fetch and render data dynamically, with Handlebars templating for HTML rendering.

> 💡 **Author's note:**  
> This is a personal project intended both as a learning exercise and a showcase of backend/frontend integration without overengineering. The styling is intentionally minimal. The focus is on clarity, data, and code readability — not visual design.

---

## 🚀 Features

- 🔌 **Modular architecture**: MVC-like structure with `controllers`, `providers`, and `utils`
- 📦 **No bundler required**: Uses native ES modules and `<script type="module">` in browser
- 🔧 **Handlebars** for partials and dynamic tab injection
- 🧠 **Smart loading**: Tabs are loaded once (with memoization)
- 📡 **ENS & token support**: Full support for resolving human-readable names and assets
- 🔁 **Live reload dev setup** (optional)
- 🧪 **Hardhat** support for local testing (optional)

---

## 📋 Requirements

### ✅ Mandatory

- Node.js >= 18.x
- A valid Ethereum API provider:
  - Alchemy (recommended)
  - Etherscan (fallback — limited)
- Create a `.env` file (or symlink to an existing one) with:
```

ALCHEMY\_API\_KEY=your\_key\_here
ETHERSCAN\_API\_KEY=your\_key\_here

````

### 🔧 Optional (for development)

- [Hardhat](https://hardhat.org/) for local forking and testing (`npx hardhat node`)
- `tsc` for TypeScript compilation (already integrated in `run.sh`)

---

## 🛠 Installation & Usage (Dev)

```bash
# Clone the repository
git clone https://github.com/your-username/chain-explorer.git
cd chain-explorer

# Symlink .env if managed elsewhere
ln -s /volume1/docker/chain-explorer/.env .env

# Compile TypeScript
npx tsc

# Launch the service
./run.sh
````

---

## 🧪 Project Structure

```bash
.
├── controllers/        # Route handlers for blocks, accounts, transactions
├── providers/          # ethers.js / Alchemy logic
├── templates/          # Handlebars partials (one per tab)
├── public/             # Static assets and index.html
├── utils/              # Common utilities (type enums, formatting)
├── views/              # HTML rendered with Handlebars
├── dist/               # Compiled TypeScript
├── run.sh              # Service launcher (with process check)
└── README.md
```

---

## ⚙️ `run.sh` Explained

The `run.sh` file handles service launching in a persistent way (ideal for SSH or Synology environments):

```bash
#!/bin/bash
set -e

LOGFILE="chain-explorer.log"

# Check if already running using ps aux instead of pgrep for portability
if ps aux | grep -v grep | grep -q "dist/index.js"; then
  echo "Chain Explorer is already running."
  exit 0
fi

echo "Starting Chain Explorer..."
nohup node dist/index.js >> "$LOGFILE" 2>&1 &
echo "Chain Explorer started in background. Logs: $LOGFILE"
```

* ✅ Uses `nohup` to survive SSH logout
* ✅ Prevents duplicate launches
* ✅ Appends logs to `chain-explorer.log`
* ✅ Safe for manual restarts

To kill the service:

```bash
ps aux | grep dist/index.js
kill [PID]
```

---

## 💬 Author's Philosophy

This explorer reflects a "keep it simple" approach:

* No frontend frameworks
* No CSS frameworks (besides Bootstrap CDN)
* Server-side rendering with client-side tab injection
* Fully transparent logic
* Developer-first design (readable, hackable)

This isn't a production-grade scanner like Etherscan — it's a **focused developer tool** and a clean codebase showing how you can integrate blockchain APIs with templated frontend rendering, without overcomplication.

---

## 📎 Possible Extensions

* ✅ Add infinite scroll / pagination per tab
* ✅ Include ERC-1155 metadata
* ✅ Real-time updates via websockets (Alchemy)
* ✅ Contract verification & ABI explorer

---

## 📄 License

This project is under the MIT License. Use, fork, improve — but don't sell it as-is.

---

## 🤝 Contributions

This project is not actively looking for contributors, but if you find bugs or want to help with documentation, feel free to open an issue or a pull request.

---


# Configuration Files

This document explains the various configuration files used in this project and why they're important for maintaining consistency and preventing common issues.

## Table of Contents

- [.nvmrc - Node Version Manager Configuration](#nvmrc---node-version-manager-configuration)
- [.npmrc - NPM Configuration](#npmrc---npm-configuration)

---

## .nvmrc - Node Version Manager Configuration

### What is .nvmrc?

The `.nvmrc` file specifies which version of Node.js should be used for this project. It's a simple text file that contains a single version number.

### Why Do We Need It?

Different Node.js versions can have different features, APIs, and behaviors. Without version consistency:

- Code that works on one developer's machine might break on another's
- Production deployments might behave differently than local development
- Dependencies might not work correctly with incompatible Node.js versions

### Our Configuration

```
24.12.0
```

This project uses **Node.js version 24.12.0**, which is an LTS (Long Term Support) release.

**What is LTS?**

- LTS versions are stable, production-ready releases
- They receive critical bug fixes and security updates for an extended period
- Recommended for most applications, especially production systems
- New features are not added (only bug fixes and security patches)

### How to Use .nvmrc

#### Installing NVM (Node Version Manager)

If you don't have nvm installed:

**macOS/Linux:**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

**Windows:**
Use [nvm-windows](https://github.com/coreybutler/nvm-windows/releases)

#### Using the Specified Version

Once you have nvm installed:

1. Navigate to the project directory:

```bash
cd /path/to/NodeInDepth
```

2. Install the version specified in .nvmrc:

```bash
nvm install
```

3. Use the version:

```bash
nvm use
```

You should see output like:

```
Now using node v24.12.0 (npm v11.7.0)
```

#### Automatic Switching (Optional)

You can configure your shell to automatically switch Node.js versions when you enter a directory with a `.nvmrc` file.

**For Zsh** (add to `~/.zshrc`):

```bash
# Automatically use the Node version from .nvmrc
autoload -U add-zsh-hook
load-nvmrc() {
  local node_version="$(nvm version)"
  local nvmrc_path="$(nvm_find_nvmrc)"

  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")

    if [ "$nvmrc_node_version" = "N/A" ]; then
      nvm install
    elif [ "$nvmrc_node_version" != "$node_version" ]; then
      nvm use
    fi
  elif [ "$node_version" != "$(nvm version default)" ]; then
    echo "Reverting to nvm default version"
    nvm use default
  fi
}
add-zsh-hook chpwd load-nvmrc
load-nvmrc
```

**For Bash** (add to `~/.bashrc` or `~/.bash_profile`):

```bash
# Automatically use the Node version from .nvmrc
cdnvm() {
    command cd "$@";
    nvm_path=$(nvm_find_up .nvmrc | tr -d '\n')

    if [[ ! $nvm_path = *[^[:space:]]* ]]; then
        declare default_version;
        default_version=$(nvm version default);

        if [[ $default_version == "N/A" ]]; then
            nvm alias default node;
            default_version=$(nvm version default);
        fi

        if [[ $(nvm current) != "$default_version" ]]; then
            nvm use default;
        fi
    elif [[ -s $nvm_path/.nvmrc && -r $nvm_path/.nvmrc ]]; then
        declare nvm_version
        nvm_version=$(<"$nvm_path"/.nvmrc)

        declare locally_resolved_nvm_version
        locally_resolved_nvm_version=$(nvm ls --no-colors "$nvm_version" | tail -1 | tr -d '\->*' | tr -d '[:space:]')

        if [[ "$locally_resolved_nvm_version" == "N/A" ]]; then
            nvm install "$nvm_version";
        elif [[ $(nvm current) != "$locally_resolved_nvm_version" ]]; then
            nvm use "$nvm_version";
        fi
    fi
}
alias cd='cdnvm'
cd "$PWD"
```

### Alternative Version Managers

While `.nvmrc` was originally designed for nvm, it's supported by many other version managers:

- **fnm** (Fast Node Manager): `fnm use`
- **volta**: Automatically detects .nvmrc
- **asdf**: `asdf install nodejs` (with asdf-nodejs plugin)
- **n**: `n auto`

Most modern version managers recognize this file format.

---

## .npmrc - NPM Configuration

### What is .npmrc?

The `.npmrc` file configures how npm (Node Package Manager) behaves in this project. Settings here apply whenever you run npm commands within this directory.

### Our Configuration

```
engine-strict=true
```

### What Does engine-strict Do?

This setting works with the `engines` field in `package.json` to enforce Node.js and npm version requirements.

**Without engine-strict:**

```bash
npm install
# Warning: Unsupported engine...
# (But installation continues anyway)
```

**With engine-strict:**

```bash
npm install
# Error: The engine "node" is incompatible with this module.
# Expected version "24.12.0". Got "16.14.0"
# (Installation fails immediately)
```

### Why Is This Important?

1. **Fail Fast**: Errors are caught immediately, not during runtime
2. **Team Consistency**: All developers must use compatible versions
3. **Prevent Subtle Bugs**: Version mismatches can cause hard-to-debug issues
4. **Documentation**: Makes version requirements explicit and enforced

### How It Works

The `.npmrc` setting works together with the `engines` field in `package.json`:

**package.json:**

```json
{
  "engines": {
    "node": "24.12.0",
    "npm": "11.7.0"
  }
}
```

**.npmrc:**

```
engine-strict=true
```

When you run `npm install`, npm checks:

1. Is `engine-strict` enabled? (Yes, in .npmrc)
2. What versions are required? (Check package.json engines field)
3. Do current versions match? (Check node -v and npm -v)
4. If NO → Installation fails with clear error message
5. If YES → Installation proceeds normally

### Other Useful .npmrc Settings

While this project currently only uses `engine-strict`, here are other common settings you might see:

```bash
# Save exact versions instead of ranges (e.g., 1.2.3 instead of ^1.2.3)
save-exact=true

# Always save dependencies to package.json when installing
save=true

# Use a specific npm registry
registry=https://registry.npmjs.org/

# Set the maximum number of concurrent downloads
maxsockets=5

# Disable package-lock.json generation (not recommended)
package-lock=false
```

### Configuration Levels

npm configuration can exist at multiple levels (in order of precedence):

1. **Per-project** (`.npmrc` in project root) ← This is what we're using
2. **Per-user** (`~/.npmrc` in your home directory)
3. **Global** (`$PREFIX/etc/npmrc`)
4. **Built-in** (npm's default configuration)

Settings in the project `.npmrc` override user and global settings.

### Checking Current Configuration

To see all npm configuration settings currently in effect:

```bash
npm config list
```

To see where a specific setting comes from:

```bash
npm config get engine-strict
```

To see all settings including defaults:

```bash
npm config ls -l
```

---

## Best Practices

### Version Control

- ✅ **DO** commit `.nvmrc` and `.npmrc` to version control (git)
- ✅ **DO** update `.nvmrc` when upgrading Node.js versions
- ✅ **DO** document any custom `.npmrc` settings in this file

### Team Workflow

1. When cloning the project:

   ```bash
   git clone <repository>
   cd NodeInDepth
   nvm use          # Switch to project's Node version
   npm install      # Install dependencies (will check version)
   ```

2. When updating Node.js version:

   - Update `.nvmrc` with new version
   - Update `engines` field in `package.json`
   - Test thoroughly before committing
   - Document the change in commit message

3. In CI/CD pipelines:
   ```bash
   # Read Node version from .nvmrc
   nvm install
   nvm use
   npm ci  # Clean install using package-lock.json
   ```

### Troubleshooting

**Problem**: `nvm use` says "N/A"

**Solution**: The version isn't installed. Run `nvm install` first.

---

**Problem**: npm install works despite wrong Node version

**Solution**: Make sure `engine-strict=true` is in `.npmrc` and `engines` is set in `package.json`

---

**Problem**: Different developers have different Node versions

**Solution**: Everyone should run `nvm use` when starting work. Consider adding automatic version switching to shell configuration.

---

## Summary

- **`.nvmrc`**: Ensures everyone uses the same Node.js version (24.12.0 LTS)
- **`.npmrc`**: Enforces version requirements and configures npm behavior
- Together, they prevent version-related issues and maintain project consistency

These small configuration files are your first line of defense against "works on my machine" problems!

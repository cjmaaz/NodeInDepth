# Getting Started

Welcome to Node.js In-Depth! This guide will help you set up your development environment and get started with learning Node.js.

## Prerequisites

Before diving into Node.js, make sure you have the following:

### 1. Node.js Installation

You'll need Node.js installed on your system. Download and install it from [nodejs.org](https://nodejs.org/).

**To verify your installation:**

```bash
node --version
npm --version
```

You should see version numbers for both Node.js and npm (Node Package Manager).

**Recommended Version:**

- Node.js 18.x or higher (LTS - Long Term Support version)

### 2. Code Editor

Choose a code editor you're comfortable with. Popular options include:

- **Visual Studio Code (VS Code)** - Free, feature-rich, and highly recommended
- **Sublime Text** - Lightweight and fast
- **WebStorm** - Powerful IDE with built-in Node.js support
- **Atom** - Open-source and customizable

### 3. Terminal/Command Line Knowledge

You should be familiar with basic terminal commands like:

- Navigating directories (`cd`, `ls` or `dir`)
- Creating files and folders (`mkdir`, `touch`)
- Running commands and scripts

### 4. JavaScript Fundamentals

A solid understanding of JavaScript is essential, including:

- Variables and data types
- Functions and arrow functions
- Arrays and objects
- ES6+ features (let/const, destructuring, promises)

### 5. Foundational Concepts (Recommended)

Before diving into specific Node.js topics, consider reviewing foundational concepts in the [Fundamentals](../fundamentals/) section:

- **[Binary Data](../fundamentals/binary-data.md)**: Bits, bytes, number systems (needed for Buffers)
- **[Memory](../fundamentals/memory.md)**: Memory concepts, allocation, garbage collection (needed for Buffers)
- **[Asynchronous Programming](../fundamentals/async-programming.md)**: Callbacks, promises, event-driven patterns (needed for EventEmitter)
- **[File Systems](../fundamentals/file-systems.md)**: File descriptors, I/O operations (needed for File System)

These fundamentals provide the building blocks for understanding Node.js concepts deeply.

## Git Configuration

If you plan to use Git for version control (highly recommended), you need to configure it properly before initializing any repository.

### Understanding Git Configuration

Git uses your name and email to identify who made changes to the code. This information appears in every commit you make.

### Initial Git Setup

Before initializing Git in any project, run these commands in your terminal:

#### 1. Set Default Branch Name

```bash
git config --global init.defaultBranch main
```

**What this does:** Sets the default branch name to "main" for all new repositories. Historically, Git used "master" as the default branch name, but "main" is now the modern standard.

#### 2. Set Your Name

```bash
git config --global user.name "Your Name"
```

**What this does:** Sets your name for Git commits. Replace "Your Name" with your actual name.

**Example:**

```bash
git config --global user.name "John Doe"
```

#### 3. Set Your Email

```bash
git config --global user.email "your.email@example.com"
```

**What this does:** Sets your email address for Git commits. Use the email associated with your GitHub/GitLab account if you plan to use these services.

**Example:**

```bash
git config --global user.email "john.doe@example.com"
```

### Verify Your Configuration

To check your Git configuration, run:

```bash
git config --global --list
```

You should see output similar to:

```
init.defaultbranch=main
user.name=John Doe
user.email=john.doe@example.com
```

### What Does `--global` Mean?

The `--global` flag means these settings apply to all Git repositories on your computer. If you need different settings for a specific project, you can run the same commands without `--global` inside that project's directory.

## Project Structure

As you work through this documentation, you'll encounter various code examples and exercises. Here's how this project is organized:

```
NodeInDepth/
├── docs/                    # Documentation files
│   ├── getting-started.md   # Setup and prerequisites
│   ├── configuration-files.md  # Project configuration
│   └── fundamentals/        # Foundational concepts
│       ├── README.md       # Fundamentals overview
│       ├── binary-data.md  # Bits, bytes, number systems
│       ├── memory.md       # Memory concepts
│       ├── async-programming.md  # Async patterns
│       └── file-systems.md # File system basics
├── buffers/                 # Buffer concept folder
├── emitters/                # EventEmitter concept folder
├── file-system/             # File System concept folder
├── package.json             # Project dependencies and scripts
└── README.md               # Project overview
```

## How to Use This Documentation

1. **Start with Setup**: Complete environment setup and Git configuration
2. **Review Fundamentals**: Study foundational concepts in [Fundamentals](../fundamentals/) before diving into specific topics
3. **Follow the Order**: Start with foundational concepts before moving to advanced topics
4. **Practice Actively**: Type out the code examples yourself - don't just copy and paste
5. **Experiment**: Modify the examples to see what happens
6. **Build Projects**: Apply what you learn by building small projects
7. **Take Notes**: Keep your own notes on concepts that are challenging

### Learning Path Recommendation

1. **Setup**: Complete this getting started guide
2. **Configuration**: Read [Configuration Files](configuration-files.md)
3. **Fundamentals**: Review relevant fundamentals based on what you want to learn:
   - For Buffers: Study [Binary Data](../fundamentals/binary-data.md) and [Memory](../fundamentals/memory.md)
   - For EventEmitter: Study [Asynchronous Programming](../fundamentals/async-programming.md)
   - For File System: Study [File Systems](../fundamentals/file-systems.md) and [Asynchronous Programming](../fundamentals/async-programming.md)
4. **Concepts**: Study specific Node.js concepts (Buffers, EventEmitter, File System)
5. **Practice**: Work through code examples and build projects

## Next Steps

Once you've completed the setup:

1. Make sure Node.js is properly installed
2. Configure Git (if you haven't already)
3. Choose and set up your code editor
4. Create a test Node.js file to verify everything works:

```bash
# Create a test file
echo "console.log('Hello, Node.js!');" > test.js

# Run it with Node.js
node test.js
```

You should see `Hello, Node.js!` printed to your terminal.

## Getting Help

If you encounter issues during setup:

- Check the official [Node.js documentation](https://nodejs.org/docs/)
- Search for error messages on Stack Overflow
- Review the [Git documentation](https://git-scm.com/doc) for Git-related issues

## Ready to Learn?

Now that your environment is set up, you're ready to dive into Node.js!

### Recommended Next Steps

1. **Review Configuration**: Read [Configuration Files](configuration-files.md) to understand project setup
2. **Study Fundamentals**: Check out the [Fundamentals](../fundamentals/) section for foundational concepts
3. **Choose a Topic**: Start with a concept folder (Buffers, EventEmitter, or File System)
4. **Read Theory**: Study the README.md in each concept folder
5. **Practice**: Work through code examples

### Documentation Structure

- **[Fundamentals](../fundamentals/)**: Foundational concepts (binary data, memory, async programming, file systems)
- **[Concept Folders](../)**: Specific Node.js topics with theory and examples
- **[Configuration Files](configuration-files.md)**: Project setup and configuration

Additional documentation topics will be added as we explore different aspects of Node.js.

---

**Pro Tip:** Keep your terminal open while learning Node.js. You'll use it frequently to run scripts, install packages, and test your code.

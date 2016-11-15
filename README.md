# Rocky API Docs

Unofficial API docs based on the PDF docs: "Rocky RESTful API, Version 3.0 - Draft, May 2015"

Deployed using Github Pages to https://voteplz.github.io/rocky-api-docs/.

Built with [Slate](https://github.com/lord/slate).

# Getting Started with Slate

### Prerequisites

You're going to need:

 - **Linux or OS X** — Windows may work, but is unsupported.
 - **Ruby, version 2.0 or newer**
 - **Bundler** — If Ruby is already installed, but the `bundle` command doesn't work, just run `gem install bundler` in a terminal.

### Getting Set Up

2. Clone this repository to your hard drive with `git clone git@github.com:voteplz/rocky-api-docs.git`
3. `cd rocky-api-docs`
4. Initialize and start Slate. You can either do this locally, or with Vagrant:

```shell
# either run this to run locally
bundle install
bundle exec middleman server

# OR run this to run with vagrant
vagrant up
```

You can now see the docs at http://localhost:4567. Whoa! That was fast!

Now that Slate is all set up your machine, you'll probably want to learn more about [editing Slate markdown](https://github.com/lord/slate/wiki/Markdown-Syntax), or [how to publish your docs](https://github.com/lord/slate/wiki/Deploying-Slate).

If you'd prefer to use Docker, instructions are available [in the wiki](https://github.com/lord/slate/wiki/Docker).

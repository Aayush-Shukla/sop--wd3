# Social Website 

A simple blog site built using Node js and Express js for the backend.

---
## Requirements

For development, you will only need Node.js and a node global package, Yarn, installed in your environement.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v8.11.3

    $ npm --version
    6.1.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

###
### Yarn installation
  After installing node, this project will need yarn too, so just run the following command.

      $ npm install -g yarn

---

## Install

    $ git clone https://github.com/Aayush-Shukla/sop--wd3
    $ cd sop--w3
    $ yarn install

## Configure app

- Rename `.env.default` to `.env` then edit it with your DB settings like:
```NODE_ENV=DEVELOPMENT

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=dbpass
DB_NAME=dbname
```

- ### To autogenerate tables
This is only needed for the first time

```$ node create-tables.js``` -> ```Ctrl + C``` after 5 seconds



- ### On `ER_NOT_SUPPORTED_AUTH_MODE` error
Run SQL query 

```mysql> ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your-password' ```







## Running the project

    $ node start
    
### Visit localhost:3000 on your browser


## TODO
- [x] Account sign-up and login page
- [x] Article page for creating articles
- [x] Feed Page
- [x] Profile page with user's detail
- [x] Search by username and view/follow other users
- [ ] Advance Task

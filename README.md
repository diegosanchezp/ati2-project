# ATI 2 Project

# Setup development environment

## Install system dependencies
These system dependencies are required, **Linux OS** is preferred.

| System dependency | Version | Usage                           |
|-------------------|---------|---------------------------------|
| bash              | 5       | Setup scripts                   |
| docker            | >= 20   | Build images                    |
| docker-compose    | >= 2    | Backend Development environment |
| Nodejs            | LTS     | Frontend                        |
| yarn              | 1.22    | Install Nodejs dependencies     |

## Docker config
Docker has to be able run as a non root user for more info check

[Post-installation steps for Linux | Docker Documentation](https://docs.docker.com/engine/install/linux-postinstall/)

## Setup

If you are using Linux, put this into your bashrc `.bashrc` OR `.zhsrc`, it's needed for the file permissions.

```bash
export UID=$(id -u)
export GID=$(id -g)
```

1. Run this command, to setup the development environment

```bash
bash shscripts/setup_dev.sh
```
If you are using Windows you'll have to inspect `shscripts/setup_dev.sh`, and find the equivalent commands, or use the Linux Subsystem.

2. Load development command utilities with

```bash
source shscripts/dev.sh
```

3. Activate the backend server, to test if everything has worked

```bash
runserver
```

4. Activate the frontend server, to test if everything has worked

```bash
yarn dev
```

# Development
It is recommend to check the commands of `shscripts/dev.sh` it has a ton of useful commands.

If you want to source the commands

```bash
source shscripts/dev.sh
```

## Backend api docs
API REST documentation is located at

`http://127.0.0.1:8000/api/docs`

## Frontend

- [Nextjs](https://nextjs.org/docs) as the JS framework
- [rsuiter](https://rsuitejs.com/) as the UI component library



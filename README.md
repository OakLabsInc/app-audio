# Audio Application

Audio application for OakOS v5.0.X

## Running locally

Make sure that you are running the right version of Node locally. You will find the required version in the `.nvmrc` file
If you are not running the same version (`node -v`) then you will need to run 

``` bash
nvm install $(cat .nvmrc)
npm run rebuild
```

### Now you can run electron locally

``` bash
npm run dev
```

### Running in a docker container

``` bash
xhost +
docker-compose up --build
```

### Shutting down the  docker container

``` bash
docker-compose down
```
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

### OakOS API Install

If you use the Audio/Info of the API to see what the `mixer_id` of the card is:
`https://{{dashboardHost}}/api/{{dashboardVersion}}/machine/{{dashboardMachine}}/Audio/Info`

In my case it returns

``` json
{
    "code": "",
    "details": "",
    "body": {
        "mixers": [
            {
                "mixer_id": "Headset:Headphone",
                "configuration": {
                    "mute": false,
                    "volume": 48
                }
            },
            {
                "mixer_id": "Headset:Mic",
                "configuration": {
                    "mute": true,
                    "volume": 0
                }
            }
        ]
    }
}
```

So `Headset` is the environmental variable to use in this install:

```{
    "services": [
        {
            "image": "index.docker.io/oaklabs/app-audio:release-1.0.7",
            "environment": {
                "NODE_ENV": "production",
                "ALSA_CARD": "Headset"
            }
        }
    ]
}
```

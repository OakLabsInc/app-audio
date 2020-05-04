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
                "mixer_id": "PCH:Master",
                "configuration": {
                    "mute": false,
                    "volume": 100
                }
            },
            {
                "mixer_id": "PCH:Headphone Mic",
                "configuration": {
                    "mute": false,
                    "volume": 100
                }
            },
            {
                "mixer_id": "PCH:Headphone+LO",
                "configuration": {
                    "mute": false,
                    "volume": 100
                }
            },
            {
                "mixer_id": "PCH:Speaker",
                "configuration": {
                    "mute": false,
                    "volume": 100
                }
            },
            {
                "mixer_id": "PCH:PCM",
                "configuration": {
                    "mute": false,
                    "volume": 100
                }
            },
            {
                "mixer_id": "PCH:Capture",
                "configuration": {
                    "mute": false,
                    "volume": 87
                }
            },
            {
                "mixer_id": "PCH:Digital",
                "configuration": {
                    "mute": false,
                    "volume": 50
                }
            },
            {
                "mixer_id": "PCH:Headset Mic",
                "configuration": {
                    "mute": false,
                    "volume": 100
                }
            }
        ]
    }
}
```

So `PCH` is the environmental variable to use in this install:

```{
    "services": [
        {
            "image": "index.docker.io/oaklabs/app-audio:capture-dell",
            "environment": {
                "NODE_ENV": "production",
                "ALSA_CARD": "PCH"
            }
        }
    ]
}
```

The headset jack on the front of the dell 3060 is controlled by the `PCH: Capture` controls. The volume and mute will not be operational until 6.0.3 release

> Notice that this `Dockerfile` and `entrypoint.sh` have instructions that will enable the front builtin headset mic on the Dell 30xx series. This can be implemented in customer applications as well.

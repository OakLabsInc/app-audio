FROM oaklabs/oak:5.0.10

WORKDIR /app
COPY . /app

RUN apt-get update -yqq \
    && apt-get install -yqq \
    alsa-utils

RUN npm i --progress=false --loglevel="error" \
    && npm cache clean --force

ENV PLATFORM_HOST=localhost:443

COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]

FROM oaklabs/oak:7.0.0

WORKDIR /app
COPY . /app


RUN npm i --progress=false --loglevel="error" \
    && npm cache clean --force

CMD ["/app/src/server.js"]

ENV PLATFORM_HOST=localhost:443

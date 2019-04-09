FROM oaklabs/oak:5.0.4

WORKDIR /app
COPY . /app


RUN npm i --progress=false --loglevel="error" \
    && npm cache clean --force

CMD ["/app/src/server.js"]

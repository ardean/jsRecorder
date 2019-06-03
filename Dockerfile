FROM jrottenberg/ffmpeg

RUN apt update
RUN apt install sudo -y
RUN apt install curl -y

RUN curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
RUN apt install nodejs -y

RUN mkdir -p /server
WORKDIR /server

COPY package.json /
COPY package.json .
COPY package-lock.json .

RUN npm install --production

COPY dist /server

RUN mkdir -p /config
WORKDIR /config

ENTRYPOINT ["node", "/server"]